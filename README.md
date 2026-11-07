# Aling Nene's Tumba Tumba Crispy Pata — website

The site for the restaurant at 823 General Kalentong Street, Mandaluyong City.
A static **Next.js** app (App Router, `output: 'export'` — no server runtime),
deployed on **Vercel** from this repo.

One marketing landing page at `/`, designed around the logo: cream ground, sage,
peach, butter and the pig's red bandana, chunky Bricolage Grotesque headlines with
Shrikhand script accents, sticker-style cards, marquee tickers and scroll reveals
(all motion respects `prefers-reduced-motion`). Sections: announcement ticker,
hero, bestsellers bento, "how the crunch happens", tabbed menu, **Barkada
planner** (head-count → bilao size + estimate, sent by Messenger/SMS/call — not a
cart), vlog reels, order-in-3-steps / visit. Palette tokens live in
`web/app/globals.css` (`@theme`).

Unconfirmed content (Our Story, TV feature, Facebook rating) is **hidden** from
customers until its `confirmed` flag in `web/content/` is flipped — no placeholder
text ever renders on the page.

The `infra-aws/` folder is an archived Terraform reference implementation (S3 +
CloudFront + Route 53), kept as a learning artifact. See
[`infra-aws/README.md`](infra-aws/README.md).

---

## What's in here

```
tumbatumba/
├── web/                    the site — Next.js static export
│   ├── app/                route / , robots.ts , sitemap.ts , globals.css (design tokens)
│   ├── components/         shared UI (themed via <ThemeProvider>)
│   ├── content/            all business data (menu, dishes, restaurant, press, story)
│   ├── lib/                openNow (Manila time), planner (bilao sizing + estimate)
│   ├── public/photos/      real photos
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
npm run dev        # http://localhost:3000
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

- [ ] Real photos for **sisig** and **pancit by the bilao** — drop them in
      `web/public/photos/` and add an `image` to that dish in `web/content/dishes.ts`
      (until then the cards render as typographic colour tiles, never stock).
- [ ] Fill in the family's real **Our Story** copy (`web/content/story.ts`, then
      set `confirmed: true` — the section appears automatically) and confirmed
      **press** details / vlogger names (`web/content/press.ts`).
- [ ] Run **Lighthouse + axe** against a deployed URL (target ≥ 95) — this pass
      can't run in CI.
- [ ] Register `alingnene.com` and attach it in Vercel — steps in
      [`DEPLOYMENT.md`](DEPLOYMENT.md).

## Menu / contact details

Confirmed by the client on 2026-09-01 (single source of truth:
`web/content/`):

- Crispy Pata `₱870 XL · ₱900 Jumbo`
- Pancit bilao: add ₱50 for sotanghon or canton
- Landline dials as `+63 2 8570 8560`; all `tel:` links use `+63285708560`
