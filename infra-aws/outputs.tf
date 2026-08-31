# -----------------------------------------------------------------------------
# Values printed after "terraform apply" and readable later with
#   terraform output <name>
# The deploy script reads bucket name + distribution id from here.
# -----------------------------------------------------------------------------

output "site_bucket_name" {
  description = "S3 bucket the site files are uploaded to."
  value       = aws_s3_bucket.site.bucket
}

output "cloudfront_distribution_id" {
  description = "Needed to invalidate the CDN cache after a deploy."
  value       = aws_cloudfront_distribution.site.id
}

output "cloudfront_domain_name" {
  description = "The *.cloudfront.net name. Handy for testing before DNS is live."
  value       = aws_cloudfront_distribution.site.domain_name
}

output "name_servers" {
  description = <<-EOT
    Only set when Terraform created the hosted zone. Copy these 4 values into
    your domain registrar as the domain's name servers, then wait for
    propagation (minutes to a couple of hours).
  EOT
  value = var.create_route53_zone ? aws_route53_zone.this[0].name_servers : []
}

output "site_url" {
  value = "https://${var.domain_name}/"
}
