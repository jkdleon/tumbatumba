# infra-aws — reference implementation (not the live hosting path)

**The site is hosted on Vercel.** See [`../DEPLOYMENT.md`](../DEPLOYMENT.md).

This directory is kept as a portfolio artifact from the original plan to host on
AWS. It is a complete, internally consistent Terraform configuration for:

```
Route 53  →  CloudFront (OAC, ACM cert in us-east-1)  →  private S3 bucket
```

It has **never been applied**. No AWS account, state, or resources exist. Nothing
here runs in CI, and the deploy scripts in `scripts/` target the S3 + CloudFront
stack, not Vercel.

## Why it's still here

The site doubles as a cloud-transition learning project (network engineering →
cloud). The Terraform and the walkthrough in [`../docs/aws-setup.md`](../docs/aws-setup.md)
were written to teach the AWS static-hosting pattern properly — private bucket,
Origin Access Control, cert-region split, DNS alias records — and they're worth
keeping as a worked example even though the live site took the simpler path.

## If you ever want to actually use it

1. Read [`../docs/aws-setup.md`](../docs/aws-setup.md) top to bottom.
2. `cd infra-aws && cp terraform.tfvars.example terraform.tfvars` and edit.
3. `terraform init && terraform plan && terraform apply`.
4. Deploy with `scripts/deploy.ps1` (Windows) or `scripts/deploy.sh`.

You would then be paying ~$1–2/month plus the domain, and maintaining state,
IAM, and a deploy pipeline — which is exactly why the live site is on Vercel.
