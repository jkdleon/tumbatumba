# Handover — Aling Nene's Tumba Tumba website

**Last updated:** 2026-09-02
**Repo:** `jkdleon/tumbatumba` on GitHub (owner's local clone: `D:\projects\aling-nenes\`)
**Owner:** James Kyle (kyleraizel@gmail.com) — building this for the family restaurant; also his cloud-transition sabbatical project (moving from network engineering). IaC + docs are written to teach.

---

## TL;DR state

Two workstreams now.

**1. The website** is built and content-accurate, a **Next.js static export** in
`web/`, hosted on **Vercel** from GitHub — push to `main` is production, PRs get
preview URLs. Live on the Vercel `*.vercel.app` URL. Three things block a real
launch: Our Story copy, three photos, domain registration.

**2. Ordering, inventory, chat and the books** are being built in a self-hosted
**Odoo on AWS** — not in this repo. The site links across to it. Nothing is
deployed yet; the decision and the model are recorded below. The site side of the
handoff is already merged and dormant behind a flag.

The earlier AWS/Terraform work under `infra-aws/` is an archived reference for
_static_ hosting (S3 + CloudFront). It does **not** transfer to the Odoo box —
that's a stateful server with a database. See `DEPLOYMENT.md` for the live path.

---

## What the restaurant is

|              |                                                              |
| ------------ | ------------------------------------------------------------ |
| Name         | Aling Nene's Tumba Tumba Crispy Pata                         |
| Address      | 823 General Kalentong Street, Mandaluyong City, Metro Manila |
| Phone        | Landline (02) 8570 8560 · Mobile 0932 514 7741               |
| GCash        | 0932 514 7741 (Cristina D.)                                  |
| Hours        | Daily, 9:00 AM – 10:00 PM                                    |
| Facebook     | https://www.facebook.com/alingnenetumbatumba                 |
| Domain       | `alingnene.com` — **not yet registered**                     |
| Reservations | Phone only; dine-in by reservation                           |

---

## Done ✅

- **The site** — `web/`, Next.js App Router, `output: 'export'` (no server runtime).
  - Two visual directions from one shared component set, switched by route:
    `/` (`kusina`) and `/heritage`. Each is a `web/theme/*.ts` token object applied
    as CSS variables, so swapping the object reskins every component.
  - Design pulled from the client's own printed menu + logo (blush paper `#f6e7db`,
    brick-red `#a5211a`). Deliberately not a template — client asked for "no AI slop".
  - Sections: hero, signature dishes, social proof, full menu board, Our Story,
    Visit & order, footer, mobile sticky order bar.
  - All business data lives in `web/content/` — menu, dishes, restaurant, press,
    story, ordering. **Confirmed by the client 2026-09-01:**
    - Crispy Pata `₱870 XL · ₱900 Jumbo` ("J" = Jumbo — confirmed)
    - Tokwa't Baboy `min. 2 orders` (confirmed)
    - Pancit bilao sizes + "add ₱50 for sotanghon or canton" note
  - All `tel:` links = `+63285708560` (landline dials as +63 2 8570 8560 — confirmed).
  - Accessible (a11y tests assert contrast on both themes), responsive,
    `prefers-reduced-motion` respected.
  - `robots.ts`, `sitemap.ts`, JSON-LD `Restaurant` schema via `RestaurantSchema`.
  - Real photos for hero, crispy pata and crispy ulo in `web/public/photos/`.
- **Ordering handoff to Odoo** — `web/content/ordering.ts` + `web/lib/ordering.ts`.
  Dormant behind `live: false`; see the Odoo section below.
- **Vercel hosting** — `web/vercel.json` sets `cleanUrls`, security headers
  (CSP, HSTS, `X-Frame-Options`), and asset cache headers. Vercel project **root
  directory is `web`**. Setup + domain steps in `DEPLOYMENT.md`.
- **CI** — `.github/workflows/ci.yml`, three jobs: `prettier --check` at the root,
  a `lychee` link check, and a `web` job running `tsc --noEmit`, `next lint`,
  `vitest run`, `next build`, and the `check-no-stock.mjs` reminder.
  106 tests across 26 files, all passing.
- **PR governance** — `.github/pull_request_template.md`, `.github/CODEOWNERS`
  (`* @jkdleon`), branch protection on `main` (PR required, CI checks required,
  no force-push).
- **Archived AWS work** — `infra-aws/` (Terraform: private S3 + CloudFront (OAC) +
  ACM us-east-1 + Route 53) and `infra-aws/scripts/deploy.{ps1,sh}`. Complete,
  internally consistent, **never run**. `docs/aws-setup.md` is the matching
  walkthrough, banner-marked as archived.
- **Docs** — `README.md`, `DEPLOYMENT.md`, `infra-aws/README.md`,
  `web/public/stock/README.md` (photo shot list).

---

## Pending / blockers 🚧

### Website launch

1. **Our Story copy.** `web/content/story.ts` is placeholder. What to ask the family:
   - Aling Nene's full name + what people call her
   - Where "Tumba Tumba" comes from (rocking chair? a place? a nickname?)
   - Year the kitchen started, and on what dish
   - Who runs it now (which generation, whose recipes)
   - One family-only detail (a regular's order, a fiesta, the vat)

   Use the family's own words — do **not** invent or write marketing fluff.

2. **Three photos** still stock. Specs in `web/public/stock/README.md`:
   - `dish-sisig.jpg` and `dish-pancit.jpg` → replace, then flip `isStock` in
     `web/content/dishes.ts`
   - `story.jpg` → kitchen / family / storefront shot, then drop the placeholder
     in `web/components/OurStory.tsx`

   `node scripts/check-no-stock.mjs` (from `web/`) lists what still references
   `/stock/`. It is a **reminder-only, non-strict** check — it does not fail CI.

3. **Register `alingnene.com`** and attach it in Vercel — steps in `DEPLOYMENT.md`.
   Until then the site runs on the Vercel `*.vercel.app` URL. The origin is
   centralised in `web/lib/siteUrl.ts` (overridable via `NEXT_PUBLIC_SITE_URL`),
   so there are no hardcoded URLs to hunt down.
4. **Lighthouse + axe** against a deployed URL for both `/` and `/heritage`
   (target ≥ 95). Can't run in CI.
5. **Favicon** — still points at `logo.jpg`. Make a real `favicon.ico`.
6. **Optional** — Google Maps embed vs the current plain link (an embed needs
   `frame-src` widening in `web/vercel.json`'s CSP).

### Odoo build — not started

7. **Phase 01: stand Odoo up on AWS.** One instance, TLS, real domain, nightly
   dump, and **a restore actually tested into a scratch database** before anyone
   depends on it.
8. **Answers needed from the family** before the inventory model is finalised:
   - **Chiller shelf life** for prepped, uncooked pata. This sets the lot expiry
     and is a food-safety number, not a config detail. Highest priority.
   - **Cutoff time** for next-day orders (latest a reservation still makes the
     dawn market list).
   - **Which dishes carry over** beyond pata / ulo / pancit — same chiller cycle,
     or made fresh daily?
9. **Visual re-theme** of the landing site is open. The owner approved the idea on
   2026-09-02; only the _name_ changed so far (see Design decisions). Any token
   change should be reviewed visually before it ships — the current palette came
   from the client's printed menu.

---

## Ordering & inventory — Odoo on AWS (decided 2026-09-02)

Online ordering, live availability, and chat are **not** being built into this
site. They go in a self-hosted **Odoo** instance on AWS, and the static site
links across to it. The split:

| Stays on Vercel (this repo)   | Goes in Odoo                                |
| ----------------------------- | ------------------------------------------- |
| hero, menu, Our Story, Visit  | availability, cart, next-day reservations   |
| the hand-designed identity    | live chat (replaces unwatched FB Messenger) |
| static export, CDN, always up | daily order rail (phone / online / walk-in) |
|                               | inventory, purchases, books                 |

**Why the split.** Moving `/` into Odoo would put the restaurant's front page
behind a single EC2 instance, and Odoo's website builder is a template system —
the client explicitly asked for something that wasn't one. Keeping the handoff to
a plain link means `output: "export"` stays, and `vercel.json`'s CSP needs no
`connect-src` or CORS changes, because the browser never calls Odoo from our
origin.

**How it's wired here.** `web/content/ordering.ts` holds the shop URL and a
`live` flag; `web/lib/ordering.ts` resolves the CTA. While `live: false` every
ordering CTA falls back to the landline with today's exact copy, so this shipped
without changing the live site. Flip `live: true` once `order.alingnene.com`
resolves and Hero, VisitOrder and StickyOrderBar all move across at once.

### How the kitchen actually works (confirmed by the family 2026-09-02)

This drives the whole inventory model, so don't lose it:

- Stock is bought **fresh at dawn** from the market, cleaned and pre-prepped.
- It is held **chilled and uncooked**. Nothing is cooked until a customer orders.
- Unsold stock **stays in the chiller** and is sold **first** the next day, while
  the new batch is being prepped. It carries over; it does not reset at close.
- They **rarely sell out**, because next-day reservations already account for
  most of it.
- **Fryer capacity ≈ 10 pick-up orders per hour** (4 burners). Against 09:00–22:00
  that is ~130 orders/day.

Consequences, in order of how much they matter:

1. **Use Odoo's standard inventory, not a custom per-day model.** Prepared stock
   is purchased, held, aged and consumed — that is ordinary inventory. Turn on
   lot tracking (one lot per market run, dated), set the removal strategy to
   **FIFO**, and set expiration dates. FIFO costing also gives real margin per
   dish, which is the accounting half of this project for free.
2. **The site is a reservation book more than a shop.** The number that matters
   is not what's in the chiller now but what's free on the requested date:
   on-hand + tomorrow's market run − already reserved. Odoo computes that as
   `virtual_available` at a date; nothing for us to calculate.
3. **The binding constraint is the fryer, not stock.** Ten pick-up orders all
   wanting 19:00 passes every inventory check and the kitchen still can't do it.
   Cap **pick-up slots per window**, not units per day.
4. **Don't model the cooking.** Frying is fast, one-to-one, and never stocked.
   A Manufacturing order per plate buys nothing.

Still to confirm with the family: chiller shelf life (drives the expiry setting —
a food-safety number, not a config detail), the cutoff time for next-day orders,
and which dishes beyond pata / ulo / pancit follow the same carry-over cycle.

Full write-up, with diagrams: see the build brief artifact linked in the PR.

---

## File map

```
tumbatumba/
├── HANDOVER.md          ← this file
├── README.md            overview, local dev, checks
├── DEPLOYMENT.md        Vercel pipeline + one-time setup + domain steps
├── package.json         repo-root dev tooling — Prettier ONLY
├── .prettierrc  .prettierignore  .gitattributes  .gitignore
├── .github/
│   ├── workflows/ci.yml         prettier + lychee + web (tsc/lint/test/build)
│   ├── pull_request_template.md
│   └── CODEOWNERS               * @jkdleon
├── web/                 ← the site. Vercel root directory is this folder.
│   ├── app/             routes: page.tsx (/), heritage/page.tsx, layout.tsx,
│   │                    robots.ts, sitemap.ts, globals.css
│   ├── components/      shared UI, themed via <ThemeProvider>. Co-located *.test.tsx
│   ├── content/         ALL business data — menu, dishes, restaurant, press,
│   │                    story, ordering (the Odoo handoff)
│   ├── lib/             openNow, siteUrl, ordering (CTA resolution)
│   ├── theme/           kusina.ts / heritage.ts token objects + tokens.ts types
│   ├── public/photos/   real photos (hero, pata, ulo)
│   ├── public/stock/    placeholders — DO NOT SHIP, see its README
│   ├── scripts/check-no-stock.mjs
│   ├── next.config.ts   output: "export" — keep it that way
│   └── vercel.json      security headers / caching
├── infra-aws/           ARCHIVED — reference Terraform for STATIC hosting.
│   │                    Does not apply to the Odoo box.
│   ├── versions.tf providers.tf variables.tf main.tf outputs.tf backend.tf
│   ├── scripts/deploy.ps1 · deploy.sh
│   └── README.md
└── docs/
    ├── aws-setup.md     ARCHIVED walkthrough (banner-marked)
    └── superpowers/     dated plan + design spec from the 2026-09-01 redesign.
                         Historical record — still says "carinderia" on purpose.
```

---

## How to run / deploy

**Local:**

```bash
cd web
npm install        # once
npm run dev        # http://localhost:3000  ( / and /heritage )
```

**Checks before pushing** — CI runs the same and they're required to merge:

```bash
# from repo root
npm run lint       # prettier --check .

# from web/
npx tsc --noEmit
npx next lint
npx vitest run
npm run build      # static export → web/out/
node scripts/check-no-stock.mjs   # reminder only, does not fail CI
```

**Deploy:** open a PR (preview URL + CI), merge to `main` (production). No manual
deploy step. One-time Vercel setup is in `DEPLOYMENT.md`.

---

## Design decisions worth keeping

- **Theme `carinderia` was renamed to `kusina` (2026-09-02).** The family
  confirmed this is a restaurant with a supplier, a chiller and a reservation
  book — not a carinderia — and the theme name was reading as a positioning
  claim. **Token values are unchanged**; they came from the client's printed
  menu and logo. A real visual re-theme is still open, and should be reviewed
  before it ships rather than changed by fiat.
- **`output: "export"` is load-bearing.** Keeping the Odoo handoff to a plain
  link is what lets the site stay a static export on a CDN. Dropping it to add a
  route handler is a real decision with an availability cost — don't do it by
  accident.
- **Palette + type are derived from the client's real menu/logo**, not chosen
  freshly. This is the main defence against the site looking AI-generated. Keep it.
- **Menu is a typographic price list**, not cards. Keep it.
- **Almost no motion.** Client explicitly dislikes scroll animations.
- **All business data lives in `web/content/`.** Components never hardcode a
  price, a phone number or an address.
- **CSP is tight** (`default-src 'self'`). Any analytics snippet, embed, chat
  widget or cross-origin fetch needs a matching widening in `web/vercel.json` —
  note `connect-src` and `frame-src` are not declared, so they inherit `'self'`.

---

## If hosting ever moves back to AWS

The `infra-aws/` Terraform is complete and `docs/aws-setup.md` walks it through.
It was set aside for Vercel's simpler pipeline (no state, IAM, or deploy script
to maintain), not because it's broken. Keeping it as a portfolio artifact of the
AWS static-hosting pattern (private bucket + OAC, cert-region split, DNS alias
records).

---

## Context notes

- Owner's environment is Windows 11, PowerShell primary. Project on `D:` (client's choice).
  Sessions may also run in Claude Code's cloud container against the GitHub repo.
- Client confirmed menu + phone details on 2026-09-01. Our Story remains unconfirmed placeholder.
- Daily operations confirmed by the family on 2026-09-02 — see the Odoo section.
  That conversation corrected an earlier wrong assumption (that stock is cooked
  in batches and resets nightly). It does not: it carries over in the chiller.
- Hosting switched from AWS to Vercel on 2026-09-01, before first commit.
- The `site/` directory referenced in older notes was deleted in commit `1591227`;
  everything moved to `web/`. Ignore any lingering `site/` path in the archived
  docs under `docs/superpowers/`.
- There is a memory file: `aling-nene-website.md` (type: project) with a pointer in `MEMORY.md`.
