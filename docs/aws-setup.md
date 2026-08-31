# AWS setup walkthrough

> **ARCHIVED — this is not the live hosting path.** The site is deployed on
> Vercel; see [`../DEPLOYMENT.md`](../DEPLOYMENT.md). This walkthrough and the
> Terraform in [`../infra-aws/`](../infra-aws/) are kept as a reference
> implementation of the AWS static-hosting pattern. Nothing below has been run.

Written for someone comfortable with networking who is new to AWS and Terraform.
Follow it top to bottom the first time. Every command is safe to re-run.

- [0. Mental model](#0-mental-model)
- [1. One-time prerequisites](#1-one-time-prerequisites)
- [2. Get the domain](#2-get-the-domain)
- [3. Provision the hosting stack](#3-provision-the-hosting-stack-terraform)
- [4. Point the domain at AWS](#4-point-the-domain-at-aws)
- [5. Deploy the site](#5-deploy-the-site)
- [6. Verify](#6-verify)
- [7. Everyday workflow](#7-everyday-workflow)
- [8. What each resource does](#8-what-each-resource-does-and-why)
- [9. Tear it down](#9-tear-it-down)
- [10. Troubleshooting](#10-troubleshooting)
- [11. Where to take this next](#11-where-to-take-this-next-sabbatical-track)

---

## 0. Mental model

If you come from network engineering, a rough translation:

| You know                                             | AWS equivalent here                                                                                        |
| ---------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| DNS zone file on a server                            | **Route 53 hosted zone** (`aws_route53_zone`)                                                              |
| A/AAAA/CNAME records                                 | **Route 53 records** — plus "alias" records, an AWS-only type that points at an AWS resource without an IP |
| A CDN / reverse proxy with TLS termination           | **CloudFront distribution**                                                                                |
| TLS cert from a CA                                   | **ACM certificate** (free, auto-renews, DNS-validated)                                                     |
| A file server / web root                             | **S3 bucket** (object storage, not a filesystem)                                                           |
| Firewall rule: "only the proxy may reach the origin" | **S3 bucket policy** + **Origin Access Control**                                                           |
| `router.cfg` you edit and push                       | **Terraform** `.tf` files you `apply`                                                                      |
| `show running-config` vs `startup-config`            | Terraform **state** (`terraform.tfstate`) vs your `.tf` files                                              |
| `configure terminal` / `commit`                      | `terraform plan` / `terraform apply`                                                                       |

Terraform's model: you _declare_ the end state in `.tf` files. `terraform plan`
diffs that against reality (tracked in state) and shows what it will add, change,
or destroy. `terraform apply` makes it so. It is the same discipline as keeping
device configs in Git and pushing them, except Terraform also _reads back_ what
exists so it can converge.

---

## 1. One-time prerequisites

### 1.1 AWS account and a non-root user

1. Create an AWS account if you don't have one.
2. **Stop using the root account.** Sign in as root once, then:
   - Enable **MFA** on the root user.
   - Open **IAM → Users → Create user**, name it e.g. `jameskyle-cli`.
   - Attach the **AdministratorAccess** policy for now (you can tighten this
     later — see §11).
   - Create an **access key** for it: _Security credentials → Create access key
     → Command Line Interface (CLI)_. Copy the **Access key ID** and **Secret
     access key**. You see the secret once.
   - Enable MFA on this user too.

> Why not root: the root account can close the account, change billing, and
> ignores IAM policies. Leaked root keys are catastrophic. Leaked IAM keys can
> be deleted and re-issued.

### 1.2 AWS CLI v2 (Windows)

```powershell
winget install --id Amazon.AWSCLI -e
```

Close and reopen the terminal, then check:

```powershell
aws --version
```

You want `aws-cli/2.x`.

### 1.3 Configure credentials

Use a **named profile** so this project's creds are separate from anything else:

```powershell
aws configure --profile alingnene
```

Answer:

- **AWS Access Key ID** — from step 1.1
- **AWS Secret Access Key** — from step 1.1
- **Default region name** — `ap-southeast-1`
- **Default output format** — `json`

Tell your shell to use it for this session:

```powershell
$env:AWS_PROFILE = "alingnene"
```

Verify it works:

```powershell
aws sts get-caller-identity
```

You should see your account ID and the user ARN.

### 1.4 Terraform

```powershell
winget install --id Hashicorp.Terraform -e
```

Reopen the terminal:

```powershell
terraform version
```

Want `>= 1.6`.

---

## 2. Get the domain

You need to own `alingnene.com` and be able to set its **name servers**. Two paths:

### Path A — register it in Route 53 (simplest, everything in one place)

1. AWS console → **Route 53 → Registered domains → Register domains**.
2. Search `alingnene.com`, add to cart, complete purchase (~$13/yr for `.com`).
3. Route 53 automatically creates a **hosted zone** for it.
4. Because the zone already exists, set this in `infra-aws/terraform.tfvars`:

   ```hcl
   create_route53_zone = false
   ```

   Terraform will _look up_ the existing zone instead of creating a second one.

Registration can take a few minutes to an hour to show as complete.

### Path B — register anywhere (Namecheap, GoDaddy, Porkbun, …)

1. Buy `alingnene.com` at the registrar of your choice.
2. Leave `create_route53_zone = true` (the default). Terraform creates the
   hosted zone; in §4 you copy its name servers to the registrar.

Either path works. Path A is fewer moving parts; Path B is often a few dollars
cheaper and registrar-independent.

---

## 3. Provision the hosting stack (Terraform)

```powershell
cd D:\projects\aling-nenes\infra-aws
copy terraform.tfvars.example terraform.tfvars
```

Open `terraform.tfvars` and set `create_route53_zone` per the path you chose in §2.

### 3.1 Initialise

```powershell
terraform init
```

This downloads the AWS provider plugin into `.terraform/` and writes
`.terraform.lock.hcl` (the exact provider version hashes — commit that file).

### 3.2 See the plan

```powershell
terraform plan
```

Read it. You should see roughly **15–18 resources to add** and nothing to
change or destroy. Nothing has been created yet — `plan` is read-only.

### 3.3 Apply

```powershell
terraform apply
```

Type `yes`. What happens, in order:

1. S3 bucket + its lockdown settings — seconds.
2. ACM certificate requested — seconds, but starts as `PENDING_VALIDATION`.
3. Route 53 records for validation are written.
4. `aws_acm_certificate_validation` **waits** for ACM to see those records and
   flip the cert to `ISSUED`. Usually 1–5 minutes. If the hosted zone's name
   servers aren't authoritative yet (Path B, before §4), this step can sit for
   a long time — that's expected; see §10.
5. CloudFront distribution is created and deployed to edge locations —
   **this alone takes 3–8 minutes.** Normal. Go make coffee.
6. Bucket policy + DNS alias records — seconds.

When it finishes it prints the **outputs**. See them again any time:

```powershell
terraform output
```

---

## 4. Point the domain at AWS

**Skip this section if you chose Path A** (domain registered in Route 53) — the
name servers already match.

**Path B:** get the zone's name servers:

```powershell
terraform output name_servers
```

You'll get four hostnames like `ns-123.awsdns-45.com`. In your registrar's
control panel, replace the domain's name servers with those four. Save.

Propagation is minutes to a couple of hours. Check it:

```powershell
nslookup -type=NS alingnene.com
```

Once that returns the AWS name servers, ACM validation (if it was still
waiting) completes on its own within a few minutes, and the pending
`terraform apply` continues. If `apply` already exited, just run it again:

```powershell
terraform apply
```

---

## 5. Deploy the site

From the repo root:

```powershell
cd D:\projects\aling-nenes
pwsh .\infra-aws\scripts\deploy.ps1 -AwsProfile alingnene
```

The script:

1. reads `site_bucket_name` and `cloudfront_distribution_id` from Terraform outputs,
2. `aws s3 sync`s `site/` into the bucket (`--delete` removes files you deleted locally),
3. uploads `.html` with a short cache lifetime so edits appear fast,
4. creates a CloudFront **invalidation** so edge caches drop the old copies.

---

## 6. Verify

```powershell
# certificate + CDN, before DNS if needed — use the CloudFront domain directly
terraform -chdir=infra-aws output -raw cloudfront_domain_name
# open that https:// URL in a browser

# once DNS is live:
nslookup alingnene.com
curl.exe -I https://alingnene.com
```

`curl -I` should show `HTTP/2 200`, a `content-type: text/html`, and headers
like `x-cache: Hit from cloudfront` on the second hit.

In the browser, check:

- `https://alingnene.com` and `https://www.alingnene.com` both load
- `http://` redirects to `https://`
- a made-up path like `https://alingnene.com/nope` shows the styled 404
- padlock shows a valid certificate

---

## 7. Everyday workflow

**Change the site** (text, CSS, images):

```powershell
# edit files under site/ ...
pwsh .\infra-aws\scripts\deploy.ps1 -AwsProfile alingnene
```

**Change the infrastructure** (`infra-aws/*.tf`):

```powershell
cd infra-aws
terraform plan      # always look first
terraform apply
```

**Roll back a bad site deploy:** the bucket has versioning on. Quickest fix is
usually `git checkout` the previous file state and re-run `deploy.ps1`.

---

## 8. What each resource does, and why

| Resource                                               | Role                                                       | Notes for later                                                                                                                 |
| ------------------------------------------------------ | ---------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| `aws_s3_bucket.site`                                   | Holds the files                                            | Not "website hosting mode" — that mode is HTTP-only and public. We serve through CloudFront instead.                            |
| `aws_s3_bucket_public_access_block`                    | All four public toggles OFF                                | This is what prevents the "accidentally public bucket" headline.                                                                |
| `aws_s3_bucket_ownership_controls`                     | `BucketOwnerEnforced` — disables ACLs                      | Current AWS best practice; objects are owned by the bucket.                                                                     |
| `aws_s3_bucket_versioning` + `lifecycle_configuration` | Keep old file versions 30 days                             | Cheap safety net for bad deploys.                                                                                               |
| `aws_acm_certificate.this`                             | Free TLS cert for the domain + `www`                       | **Must** be in `us-east-1` for CloudFront — hence the aliased provider. Auto-renews as long as the DNS validation record stays. |
| `aws_route53_record.cert_validation`                   | CNAME(s) proving you control the domain                    | ACM checks these to issue and to renew. Don't delete them.                                                                      |
| `aws_acm_certificate_validation.this`                  | A "wait until ISSUED" gate                                 | Not a real cloud object — a Terraform synchronisation helper.                                                                   |
| `aws_cloudfront_origin_access_control.site`            | Lets CloudFront sign requests to S3 with SigV4             | Replaces the legacy "Origin Access Identity".                                                                                   |
| `aws_cloudfront_distribution.site`                     | The CDN + HTTPS front door                                 | `default_root_object = index.html`; `redirect-to-https`; `compress = true`; custom 403/404 → `/404.html`. Deploys take minutes. |
| `data.aws_cloudfront_cache_policy.optimized`           | AWS-managed caching rules                                  | Compress, sensible TTLs, ignores cookies.                                                                                       |
| `data.aws_cloudfront_response_headers_policy.security` | Adds `X-Content-Type-Options`, `Referrer-Policy`, etc.     | Free hardening.                                                                                                                 |
| `aws_s3_bucket_policy.site`                            | "Allow `s3:GetObject` **only** from this one distribution" | The `AWS:SourceArn` condition is the important bit — without it, any CloudFront account could read your bucket.                 |
| `aws_route53_zone.this` _(optional)_                   | The DNS zone for the domain                                | Only created when `create_route53_zone = true`.                                                                                 |
| `aws_route53_record.alias_a` / `alias_aaaa`            | Point apex + `www` at CloudFront                           | **Alias** records: AWS-specific, free, no IP to track, work at the zone apex (a plain CNAME can't).                             |

### Why two AWS providers

`providers.tf` declares `aws` (your region) and `aws.us_east_1`. CloudFront only
accepts certificates from `us-east-1`. Resources tagged `provider = aws.us_east_1`
(the cert and its validation) are created there; everything else in
`ap-southeast-1`.

### Where state lives

Right now: `infra-aws/terraform.tfstate` on your disk. It contains resource IDs and
some values in plaintext — **gitignored**, don't commit it. Moving it to S3 is
§11.

---

## 9. Tear it down

To remove everything this project created:

```powershell
cd D:\projects\aling-nenes\infra-aws
terraform destroy
```

Notes:

- If the bucket still has objects, `destroy` will fail on it. Empty it first:
  ```powershell
  aws s3 rm "s3://$(terraform output -raw site_bucket_name)" --recursive
  ```
- The CloudFront distribution takes several minutes to disable then delete.
- If Terraform created the **hosted zone**, `destroy` deletes it — the domain
  itself stays registered but has no DNS until you recreate a zone.
- A domain _registration_ is never deleted by Terraform.

---

## 10. Troubleshooting

**`terraform apply` hangs on `aws_acm_certificate_validation`.**
ACM can't validate because the hosted zone isn't authoritative for the domain
yet. Finish §4 (set name servers at the registrar), confirm with
`nslookup -type=NS alingnene.com`, then re-run `terraform apply`. Until DNS
cuts over, ACM has nowhere to read the validation record.

**`Error: creating CloudFront Distribution: ... InvalidViewerCertificate`.**
The cert isn't `ISSUED` yet, or it isn't in `us-east-1`. Check:

```powershell
aws acm list-certificates --region us-east-1
```

**Browser shows `AccessDenied` XML from S3.**
The file isn't in the bucket (run the deploy script), or the bucket policy
didn't attach. `terraform apply` again and check for errors.

**Site loads but an edit isn't showing.**
CloudFront cached the old version. The deploy script invalidates `/*`, but if
you uploaded manually: `aws cloudfront create-invalidation --distribution-id <id> --paths "/*"`.
Also hard-reload the browser.

**`deploy.ps1` — "Could not read Terraform outputs".**
You haven't run `terraform apply` yet, or you're pointing at the wrong folder.
The script lives in `infra-aws/scripts/` and reads the Terraform state one level
up in `infra-aws/`.

**`AuthFailure` / `ExpiredToken`.**
`$env:AWS_PROFILE` isn't set in this terminal, or the access key was rotated.
Re-run `aws sts get-caller-identity`.

---

## 11. Where to take this next (sabbatical track)

Each of these is a self-contained thing to add and write up:

1. **Remote state.** Move state to S3 + DynamoDB lock (`infra-aws/backend.tf` has the
   steps). Now the project is machine-independent and CI-ready.
2. **CI/CD with GitHub Actions + OIDC.** No stored AWS keys: GitHub gets a
   short-lived role via `sts:AssumeRoleWithWebIdentity`. On push to `main`:
   `terraform apply` if `infra-aws/` changed, then run the deploy script.
3. **Least-privilege IAM.** Replace `AdministratorAccess` with a policy scoped to
   S3 + CloudFront + Route 53 + ACM on this project's resources. Good portfolio
   piece — it forces you to learn the actual API actions.
4. **Observability.** CloudFront standard logs to S3, or real-time logs to
   CloudWatch; an Athena table over the logs to query traffic. A CloudWatch
   alarm on 5xx rate.
5. **WAF.** Attach an `aws_wafv2_web_acl` with the managed common rule set to
   the distribution.
6. **`www` → apex redirect.** Right now both serve the same content. Add a
   CloudFront Function (tiny JS at the edge) to 301 `www` to the apex so there's
   one canonical URL.
7. **Staging.** Parameterise the stack with a `workspace` or an `env` variable
   and stand up `staging.alingnene.com`.
8. **Terraform module.** Extract `infra-aws/` into a reusable
   `modules/static-site/` and call it from `environments/prod/`.

Document each as you go — that write-up _is_ the transition evidence.
