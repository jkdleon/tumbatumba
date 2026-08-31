#!/usr/bin/env bash
# Deploy the site: upload to S3, then clear the CloudFront cache.
#
# Usage:
#   ./infra-aws/scripts/deploy.sh
#   AWS_PROFILE=alingnene ./infra-aws/scripts/deploy.sh
#
# Requires: AWS CLI v2, Terraform (already applied once so outputs exist).

set -euo pipefail

infra_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
repo_root="$(cd "$infra_dir/.." && pwd)"
site_dir="$repo_root/site"

echo "Reading Terraform outputs..."
bucket="$(terraform -chdir="$infra_dir" output -raw site_bucket_name)"
dist_id="$(terraform -chdir="$infra_dir" output -raw cloudfront_distribution_id)"

echo "Bucket       : $bucket"
echo "Distribution : $dist_id"
echo

echo "Uploading assets..."
aws s3 sync "$site_dir" "s3://$bucket" --delete \
  --exclude "*.html" \
  --exclude "*.DS_Store" \
  --cache-control "public,max-age=86400"

echo "Uploading HTML..."
aws s3 sync "$site_dir" "s3://$bucket" \
  --exclude "*" --include "*.html" \
  --content-type "text/html; charset=utf-8" \
  --cache-control "public,max-age=60"

echo "Invalidating CloudFront cache..."
aws cloudfront create-invalidation \
  --distribution-id "$dist_id" \
  --paths "/*" >/dev/null

echo
echo "Done. https://alingnene.com/ (allow a minute for the invalidation)"
