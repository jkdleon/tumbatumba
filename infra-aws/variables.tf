# -----------------------------------------------------------------------------
# Inputs. Real values go in terraform.tfvars (copy it from the .example file).
# -----------------------------------------------------------------------------

variable "domain_name" {
  description = "Apex/root domain for the site."
  type        = string
  default     = "alingnene.com"
}

variable "subject_alternative_names" {
  description = "Extra names the TLS certificate should also cover."
  type        = list(string)
  default     = ["www.alingnene.com"]
}

variable "aws_region" {
  description = <<-EOT
    Region for the S3 bucket. Closest to Manila is ap-southeast-1 (Singapore).
    CloudFront serves the site from edge locations worldwide regardless, so this
    mostly affects deploy-upload speed and where the origin bytes sit.
  EOT
  type    = string
  default = "ap-southeast-1"
}

variable "create_route53_zone" {
  description = <<-EOT
    true  -> Terraform creates the Route 53 hosted zone for the domain. You then
             copy the 4 name servers it outputs into your domain registrar.
    false -> You already have a hosted zone (e.g. you registered the domain in
             Route 53). Terraform looks it up instead of creating it.
  EOT
  type    = bool
  default = true
}

variable "price_class" {
  description = <<-EOT
    CloudFront edge coverage vs cost.
      PriceClass_100 - US, Canada, Europe (cheapest)
      PriceClass_200 - + Asia, Middle East, Africa  <- good for a PH audience
      PriceClass_All - everywhere (most expensive)
  EOT
  type    = string
  default = "PriceClass_200"
}
