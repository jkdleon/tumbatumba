# Aling Nene's Tumba Tumba Crispy Pata — website

The site for the restaurant at 823 General Kalentong Street, Mandaluyong City.
A static **Next.js** app (App Router, `output: 'export'` — no server runtime),
deployed on **Vercel** from this repo.

Two visual directions are built from one shared component set and switched by
route: `/` ("Kusina") and `/heritage` ("Heritage kitchen"). Each is a
_theme_ — a `web/theme/*.ts` token object applied as CSS variables — so swapping
the object reskins every component.

The `infra-aws/` folder is an archived Terraform reference implementation (S3 +
CloudFront + Route 53), kept as a learning artifact. See
[`infra-aws/README.md`](infra-aws/README.md).

---

## What's in here

```
tumbatumba/
├── web/                    the site — Next.js static export
│   ├── app/                routes: / , /heritage , robots.ts , sitemap.ts
│   ├── components/         shared UI (themed via <ThemeProvider>)
│   ├── content/            all business data (menu, dishes, restaurant, press, story)
│   ├── theme/              kusina.ts / heritage.ts token objects
│   ├── public/photos/      real photos
│   ├── public/stock/       remaining placeholder images — DO NOT SHIP
│   └── vercel.json         security headers / caching (applied by Vercel)
├── DEPLOYMENT.md           how Vercel is wired up — read this
├── package.json            repo-root dev tooling (Prettier only)
├── .github/workflows/      CI: prettier, link check, web (tsc/lint/test/build)
├── infra-aws/              ARCHIVED Terraform
└── docs/aws-setup.md       ARCHIVED walkthrough for the AWS path
```

## Deploying

Push to `main` → production. Open a PR → Vercel preview URL. The Vercel project's
**Root Directory is `web`**. One-time setup and the staging project are in
[`DEPLOYMENT.md`](DEPLOYMENT.md).

## Working locally

```bash
cd web
npm install        # once
npm run dev        # http://localhost:3000  ( / and /heritage )
```

## Checks before pushing

```bash
# from repo root
npm run lint       # prettier --check .

# from web/
cd web
npx tsc --noEmit
npx next lint
npx vitest run
npm run build      # static export → web/out/
node scripts/check-no-stock.mjs   # lists any /stock/ placeholder still referenced
```

CI runs the same on every PR and they're required to merge.

## Still to do before launch

- [ ] Real photos for the remaining signature dishes (**sisig**, **pancit by the
      bilao**) and a **kitchen / family / storefront** shot for Our Story —
      replace the files under `web/public/stock/` and flip `isStock` in
      `web/content/dishes.ts` / drop the placeholder in `web/components/OurStory.tsx`.
      See [`web/public/stock/README.md`](web/public/stock/README.md).
- [ ] Fill in the family's real **Our Story** copy (`web/content/story.ts`) and
      confirmed **press** details (`web/content/press.ts`).
- [ ] Run **Lighthouse + axe** against a deployed URL for both `/` and
      `/heritage` (target ≥ 95) — this pass can't run in CI.
- [ ] Register `alingnene.com` and attach it in Vercel — steps in
      [`DEPLOYMENT.md`](DEPLOYMENT.md).

## Menu / contact details

Confirmed by the client on 2026-09-01 (single source of truth:
`web/content/`):

- Crispy Pata `₱870 XL · ₱900 Jumbo`
- Pancit bilao: add ₱50 for sotanghon or canton
- Landline dials as `+63 2 8570 8560`; all `tel:` links use `+63285708560`
