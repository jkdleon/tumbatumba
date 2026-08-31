# -----------------------------------------------------------------------------
# Provider configuration.
#
# We declare the AWS provider twice:
#
#   1. The default one, in whatever region you pick (var.aws_region). This is
#      where the S3 bucket that holds the website lives.
#
#   2. A second one aliased "us_east_1". CloudFront can ONLY use an ACM
#      certificate that lives in us-east-1 (N. Virginia). That's an AWS rule,
#      not ours. So the cert and its DNS-validation records are created through
#      this aliased provider, everything else through the default one.
# -----------------------------------------------------------------------------

provider "aws" {
  region = var.aws_region

  default_tags {
    tags = {
      Project   = "alingnene-website"
      ManagedBy = "terraform"
    }
  }
}

provider "aws" {
  alias  = "us_east_1"
  region = "us-east-1"

  default_tags {
    tags = {
      Project   = "alingnene-website"
      ManagedBy = "terraform"
    }
  }
}
