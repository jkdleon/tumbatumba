# -----------------------------------------------------------------------------
# Which versions of Terraform and the AWS provider this project expects.
# Pinning these means "terraform init" on another machine (or in CI) resolves
# the same tooling you tested with.
# -----------------------------------------------------------------------------
terraform {
  required_version = ">= 1.6.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.60" # any 5.x from .60 up; not 6.x
    }
  }
}
