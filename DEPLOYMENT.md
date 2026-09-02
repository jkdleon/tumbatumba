# Deployment

The site is hosted on **Vercel**, deployed straight from GitHub. There is no
build step — Vercel serves the files in `site/` as static assets.

- **Repo:** https://github.com/jkdleon/tumbatumba
- **Production:** every push to `main` deploys to the production URL.
- **Previews:** every pull request gets its own preview URL, posted by the
  Vercel bot on the PR. That preview is what reviewers look at.
- **Live URL:** the Vercel-assigned `*.vercel.app` domain for now.
  `alingnene.com` is not registered yet — see "Adding the domain" below.

## One-time Vercel project setup

Do this once, in the Vercel dashboard (or it's already done — check first):

1. **Add New… → Project**, import `jkdleon/tumbatumba`.
2. **Root Directory:** set to `site`. This is the important one — the site is in
   a subfolder, and everything else keys off it.
3. **Framework Preset:** `Other`.
4. **Build Command:** leave empty (override on, blank value).
5. **Output Directory:** leave empty — with no build, Vercel serves the root
   directory (`site/`) as-is.
6. **Install Command:** leave empty.
7. Deploy.

`site/vercel.json` (read relative to the root directory) then applies:

| Setting                              | Effect                                                                                   |
| ------------------------------------ | ---------------------------------------------------------------------------------------- |
| `cleanUrls: true`                    | `/x.html` is served at `/x`; `/x.html` 308-redirects to `/x`                             |
| `trailingSlash: false`               | `/x/` redirects to `/x`                                                                  |
| Security headers on `/(.*)`          | CSP, HSTS, `X-Frame-Options: DENY`, `nosniff`, `Referrer-Policy`, `Permissions-Policy`   |
| `Cache-Control` on `/img/*`          | `public, max-age=604800` (7 days)                                                        |
| `Cache-Control` on `/css/*`, `/js/*` | `public, max-age=3600, must-revalidate` — short, because filenames aren't content-hashed |

`404.html` is served automatically by Vercel for unmatched paths.

### About the CSP

The page pulls Google Fonts, so the policy allows:

- `style-src 'self' https://fonts.googleapis.com` — the font stylesheet
- `font-src https://fonts.gstatic.com` — the font files
- `script-src 'self'` — only `/js/main.js`; the inline `application/ld+json`
  block is data, not script, and isn't affected

If you add an inline `<script>`, a `<style>` attribute, an analytics snippet, or
an embedded map, the CSP will block it until you widen the relevant directive in
`site/vercel.json`.

## Local preview

No build step. Serve `site/` so root-absolute paths resolve:

```bash
cd site
python -m http.server 8080   # http://localhost:8080
```

`vercel.json` headers do **not** apply to `python -m http.server`. To preview
them, use `npx vercel dev` from the repo root after linking the project.

## Adding the domain later

When `alingnene.com` is registered:

1. Vercel project → **Settings → Domains → Add** `alingnene.com` and
   `www.alingnene.com`.
2. Vercel shows the DNS records to set:
   - if the registrar's nameservers stay put: an `A` record for the apex and a
     `CNAME` for `www` (values Vercel gives you), or
   - move the nameservers to Vercel and it manages the zone.
3. Set the primary domain to the apex; Vercel issues the TLS cert automatically
   and redirects `www` → apex.
4. Then update the absolute URLs that currently hardcode `https://alingnene.com`:
   `site/sitemap.xml`, `site/robots.txt`, and the `og:url` / JSON-LD `url` in
   `site/index.html`.

## Staging (redesign)

The `redesign` branch adds a second, independent site under `web/` (Next.js,
static export). Vercel's "root directory" is a **project-level** setting, so we
preview it as a **separate Vercel project** — the production project is never
touched until cutover (spec §4.4).

### One-time setup (James)

1. Vercel dashboard → **Add New… → Project** → import the same GitHub repo
   (`aling-nenes`).
2. **Project Name:** `aling-nene-staging`.
3. **Framework Preset:** Next.js.
4. **Root Directory:** `web` (click _Edit_ → select `web`).
5. **Build & Output:** leave defaults (`next build`; output auto-detected).
   Do **not** set a "no build command" override — that is a production-only relic.
6. **Environment Variables:** add `NEXT_PUBLIC_SITE_URL` =
   `https://<the-staging-domain-vercel-gives-you>` (used for canonical/OG URLs).
7. **Settings → Git → Production Branch:** set to `redesign`.
8. Deploy. The staging URL then serves:
   - `/` → "Kusina"
   - `/heritage` → "Heritage kitchen"

### Day-to-day

- Every push to `redesign` redeploys staging automatically.
- PRs into `redesign` get Vercel preview URLs.
- The production project (root `site/`, no build) is unaffected.

### After James picks a direction

Cutover is spec §4.4 — a separate task. In short: delete the losing route +
its `theme/*.ts`, promote the winner to `/`, repoint the **production** Vercel
project's root directory to `web/`, port headers, regenerate robots/sitemap,
update CI, then delete this staging project.

## What is _not_ used

`infra-aws/` (Terraform for S3 + CloudFront + Route 53) and its
`scripts/deploy.*` are an archived reference implementation, kept for portfolio
purposes. They are not applied and not part of this pipeline. See
[`infra-aws/README.md`](infra-aws/README.md).
