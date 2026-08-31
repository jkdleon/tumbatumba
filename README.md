# Aling Nene's Tumba Tumba Crispy Pata — website

A hand-coded static site for the restaurant at 823 General Kalentong Street,
Mandaluyong City. No framework, no build step, no template. Deployed on
**Vercel** from this repo.

The `infra-aws/` folder is an archived Terraform reference implementation of the
same site on AWS (S3 + CloudFront + Route 53) — kept as a learning artifact, not
the live path. See [`infra-aws/README.md`](infra-aws/README.md).

---

## What's in here

```
tumbatumba/
├── site/                 the website — plain HTML, CSS, a little JS
│   ├── index.html
│   ├── 404.html
│   ├── css/styles.css
│   ├── js/main.js
│   ├── img/              logo + menu photo (client's); add hero-pata.jpg, story.jpg
│   ├── vercel.json       headers, cleanUrls — applied by Vercel
│   ├── robots.txt
│   └── sitemap.xml
├── DEPLOYMENT.md         how Vercel is wired up — read this
├── HANDOVER.md           full project state and pending items
├── package.json          dev-only: prettier + html-validate
├── .github/workflows/    CI: prettier, html-validate, link check
├── infra-aws/            ARCHIVED Terraform (S3 + CloudFront + ACM + Route 53)
└── docs/aws-setup.md     ARCHIVED walkthrough for the AWS path
```

## Deploying

Push to `main` → production. Open a PR → preview URL. That's the whole pipeline;
details and one-time project setup are in [`DEPLOYMENT.md`](DEPLOYMENT.md).

## Working on the site locally

No build step. Serve `site/` so paths starting with `/` resolve:

```bash
cd site
python -m http.server 8080
# visit http://localhost:8080
```

## Checks before pushing

```bash
npm install        # once
npm run format     # prettier --write
npm run lint       # prettier --check + html-validate
```

CI runs the same checks plus a link check on every PR, and they're required to
merge.

## Still to do before launch

- [ ] Replace the **Our Story** placeholder text in `site/index.html` with the
      family's real account (prompts are in an HTML comment there).
- [ ] Add `site/img/hero-pata.jpg` and `site/img/story.jpg` — real photos,
      resized and compressed (see `site/img/README.md`), then swap the
      placeholder `<figure>` blocks.
- [ ] Register `alingnene.com` and attach it in Vercel — steps in
      [`DEPLOYMENT.md`](DEPLOYMENT.md#adding-the-domain-later).
- [ ] Make a proper `favicon.ico` from the logo (currently points at `logo.jpg`).
- [ ] Decide whether to add a Google Maps embed or keep the plain map link
      (an embed needs a CSP `frame-src` widening in `site/vercel.json`).

## Menu / contact details

Confirmed by the client on 2026-09-01:

- Crispy Pata `₱870 XL · ₱900 Jumbo` ("J" = Jumbo)
- Tokwa't Baboy `min. 2 orders`
- Pancit bilao: add ₱50 for sotanghon or canton
- Landline dials as `+63 2 8570 8560`; all `tel:` links use `+63285708560`
