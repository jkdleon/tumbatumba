# =============================================================================
#  Aling Nene's Tumba Tumba — static site hosting on AWS
#
#  Request flow once this is applied:
#
#     visitor ──► Route 53 (alingnene.com)
#             ──► CloudFront (HTTPS, caching, compression, edge locations)
#             ──► S3 bucket (private — only CloudFront can read it)
#
#  The bucket is NEVER public. CloudFront reaches it through an
#  Origin Access Control (OAC), and the bucket policy trusts only this one
#  CloudFront distribution.
# =============================================================================


# -----------------------------------------------------------------------------
#  Route 53 hosted zone
#  Either we create it, or we look up one you already have. See
#  var.create_route53_zone.
# -----------------------------------------------------------------------------
resource "aws_route53_zone" "this" {
  count = var.create_route53_zone ? 1 : 0
  name  = var.domain_name
}

data "aws_route53_zone" "this" {
  count = var.create_route53_zone ? 0 : 1
  name  = var.domain_name
}

locals {
  zone_id   = var.create_route53_zone ? aws_route53_zone.this[0].zone_id : data.aws_route53_zone.this[0].zone_id
  all_names = concat([var.domain_name], var.subject_alternative_names)
  bucket_name = "${replace(var.domain_name, ".", "-")}-site" # e.g. alingnene-com-site
}


# -----------------------------------------------------------------------------
#  TLS certificate (must be in us-east-1 for CloudFront) + DNS validation
# -----------------------------------------------------------------------------
resource "aws_acm_certificate" "this" {
  provider = aws.us_east_1

  domain_name               = var.domain_name
  subject_alternative_names = var.subject_alternative_names
  validation_method         = "DNS"

  lifecycle {
    create_before_destroy = true
  }
}

# One DNS record per name on the cert, proving to ACM we control the domain.
resource "aws_route53_record" "cert_validation" {
  for_each = {
    for dvo in aws_acm_certificate.this.domain_validation_options :
    dvo.domain_name => {
      name   = dvo.resource_record_name
      type   = dvo.resource_record_type
      record = dvo.resource_record_value
    }
  }

  zone_id         = local.zone_id
  name            = each.value.name
  type            = each.value.type
  records         = [each.value.record]
  ttl             = 60
  allow_overwrite = true
}

# Blocks until ACM sees those records and marks the cert "ISSUED".
resource "aws_acm_certificate_validation" "this" {
  provider = aws.us_east_1

  certificate_arn         = aws_acm_certificate.this.arn
  validation_record_fqdns = [for r in aws_route53_record.cert_validation : r.fqdn]
}


# -----------------------------------------------------------------------------
#  S3 bucket — holds the built site. Private.
# -----------------------------------------------------------------------------
resource "aws_s3_bucket" "site" {
  bucket = local.bucket_name
}

# Refuse every form of public access, belt and braces.
resource "aws_s3_bucket_public_access_block" "site" {
  bucket                  = aws_s3_bucket.site.id
  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

# ACLs off entirely — the bucket owner owns every object. Modern default.
resource "aws_s3_bucket_ownership_controls" "site" {
  bucket = aws_s3_bucket.site.id
  rule {
    object_ownership = "BucketOwnerEnforced"
  }
}

# Keep old versions of files so a bad deploy can be rolled back.
resource "aws_s3_bucket_versioning" "site" {
  bucket = aws_s3_bucket.site.id
  versioning_configuration {
    status = "Enabled"
  }
}

# Expire non-current versions after 30 days so they don't pile up cost.
resource "aws_s3_bucket_lifecycle_configuration" "site" {
  bucket = aws_s3_bucket.site.id
  rule {
    id     = "expire-old-versions"
    status = "Enabled"
    noncurrent_version_expiration {
      noncurrent_days = 30
    }
  }
}


# -----------------------------------------------------------------------------
#  CloudFront
# -----------------------------------------------------------------------------

# OAC = the modern way for CloudFront to authenticate to a private S3 origin
# (replaces the old "Origin Access Identity").
resource "aws_cloudfront_origin_access_control" "site" {
  name                              = "${var.domain_name}-oac"
  description                       = "OAC for ${var.domain_name} static site"
  origin_access_control_origin_type = "s3"
  signing_behavior                  = "always"
  signing_protocol                  = "sigv4"
}

# AWS-managed policies — no need to hand-roll these.
data "aws_cloudfront_cache_policy" "optimized" {
  name = "Managed-CachingOptimized"
}

data "aws_cloudfront_response_headers_policy" "security" {
  name = "Managed-SecurityHeadersPolicy"
}

resource "aws_cloudfront_distribution" "site" {
  enabled             = true
  is_ipv6_enabled     = true
  comment             = "Aling Nene's Tumba Tumba - static site"
  default_root_object = "index.html"
  price_class         = var.price_class
  aliases             = local.all_names

  origin {
    origin_id                = "s3-site"
    domain_name              = aws_s3_bucket.site.bucket_regional_domain_name
    origin_access_control_id = aws_cloudfront_origin_access_control.site.id
  }

  default_cache_behavior {
    target_origin_id       = "s3-site"
    viewer_protocol_policy  = "redirect-to-https"
    allowed_methods        = ["GET", "HEAD"]
    cached_methods         = ["GET", "HEAD"]
    compress               = true

    cache_policy_id            = data.aws_cloudfront_cache_policy.optimized.id
    response_headers_policy_id = data.aws_cloudfront_response_headers_policy.security.id
  }

  # S3 returns 403 (not 404) for a missing key when accessed via OAC, so map
  # both onto our styled 404 page.
  custom_error_response {
    error_code            = 403
    response_code         = 404
    response_page_path    = "/404.html"
    error_caching_min_ttl = 60
  }
  custom_error_response {
    error_code            = 404
    response_code         = 404
    response_page_path    = "/404.html"
    error_caching_min_ttl = 60
  }

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  viewer_certificate {
    acm_certificate_arn      = aws_acm_certificate_validation.this.certificate_arn
    ssl_support_method       = "sni-only"
    minimum_protocol_version = "TLSv1.2_2021"
  }
}


# -----------------------------------------------------------------------------
#  Bucket policy — allow ONLY this CloudFront distribution to read objects.
# -----------------------------------------------------------------------------
data "aws_iam_policy_document" "site" {
  statement {
    sid       = "AllowCloudFrontServicePrincipalReadOnly"
    effect    = "Allow"
    actions   = ["s3:GetObject"]
    resources = ["${aws_s3_bucket.site.arn}/*"]

    principals {
      type        = "Service"
      identifiers = ["cloudfront.amazonaws.com"]
    }

    condition {
      test     = "StringEquals"
      variable = "AWS:SourceArn"
      values   = [aws_cloudfront_distribution.site.arn]
    }
  }
}

resource "aws_s3_bucket_policy" "site" {
  bucket     = aws_s3_bucket.site.id
  policy     = data.aws_iam_policy_document.site.json
  depends_on = [aws_s3_bucket_public_access_block.site]
}


# -----------------------------------------------------------------------------
#  DNS — point the domain (and www) at CloudFront with alias records.
#  Alias records are free and resolve straight to the distribution.
# -----------------------------------------------------------------------------
resource "aws_route53_record" "alias_a" {
  for_each = toset(local.all_names)

  zone_id = local.zone_id
  name    = each.value
  type    = "A"

  alias {
    name                   = aws_cloudfront_distribution.site.domain_name
    zone_id                = aws_cloudfront_distribution.site.hosted_zone_id
    evaluate_target_health = false
  }
}

resource "aws_route53_record" "alias_aaaa" {
  for_each = toset(local.all_names)

  zone_id = local.zone_id
  name    = each.value
  type    = "AAAA"

  alias {
    name                   = aws_cloudfront_distribution.site.domain_name
    zone_id                = aws_cloudfront_distribution.site.hosted_zone_id
    evaluate_target_health = false
  }
}
