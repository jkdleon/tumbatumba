<#
    Deploy the site: upload to S3, then clear the CloudFront cache.

    Usage (from the repo root or anywhere):
        pwsh ./infra-aws/scripts/deploy.ps1
        pwsh ./infra-aws/scripts/deploy.ps1 -AwsProfile alingnene

    Requires: AWS CLI v2, Terraform (already applied once so outputs exist).
#>
[CmdletBinding()]
param(
    [string]$AwsProfile = $env:AWS_PROFILE
)

$ErrorActionPreference = "Stop"
Set-StrictMode -Version Latest

$infraDir = Split-Path -Parent $PSScriptRoot
$repoRoot = Split-Path -Parent $infraDir
$siteDir  = Join-Path $repoRoot "site"

$profileArgs = @()
if ($AwsProfile) { $profileArgs = @("--profile", $AwsProfile) }

Write-Host "Reading Terraform outputs..." -ForegroundColor Cyan
$bucket = (terraform -chdir="$infraDir" output -raw site_bucket_name).Trim()
$distId = (terraform -chdir="$infraDir" output -raw cloudfront_distribution_id).Trim()

if (-not $bucket -or -not $distId) {
    throw "Could not read Terraform outputs. Run 'terraform apply' in infra-aws/ first."
}

Write-Host "Bucket        : $bucket"
Write-Host "Distribution  : $distId"
Write-Host ""

# 1. Sync everything, deleting files in the bucket that no longer exist locally.
#    HTML is excluded here so we can give it a shorter cache lifetime below.
Write-Host "Uploading assets..." -ForegroundColor Cyan
aws s3 sync "$siteDir" "s3://$bucket" --delete `
    --exclude "*.html" `
    --exclude "*.DS_Store" `
    --cache-control "public,max-age=86400" `
    @profileArgs

# 2. Upload HTML last, with a short TTL so content edits show up quickly.
Write-Host "Uploading HTML..." -ForegroundColor Cyan
aws s3 sync "$siteDir" "s3://$bucket" `
    --exclude "*" --include "*.html" `
    --content-type "text/html; charset=utf-8" `
    --cache-control "public,max-age=60" `
    @profileArgs

# 3. Invalidate the CDN so edge locations fetch the new files now.
Write-Host "Invalidating CloudFront cache..." -ForegroundColor Cyan
aws cloudfront create-invalidation `
    --distribution-id $distId `
    --paths "/*" `
    @profileArgs | Out-Null

Write-Host ""
Write-Host "Done. https://alingnene.com/ (allow a minute for the invalidation)" -ForegroundColor Green
