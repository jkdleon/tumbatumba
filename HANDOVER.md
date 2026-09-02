# Handover — Aling Nene's Tumba Tumba website

**Last updated:** 2026-09-01
**Repo:** `D:\projects\aling-nenes\`
**Owner:** James Kyle (kyleraizel@gmail.com) — building this for the family restaurant; also his cloud-transition sabbatical project (moving from network engineering). IaC + docs are written to teach.

---

## TL;DR state

The **site is built and content-accurate**. Hosting is **Vercel**, deployed from
GitHub (`jkdleon/tumbatumba`) — push to `main` is production, PRs get preview
URLs. Live on the Vercel `*.vercel.app` URL. Three things block a real launch:
Our Story copy, two photos, domain registration.

The earlier AWS/Terraform plan is archived under `infra-aws/` as a portfolio
reference — complete but never applied. See `DEPLOYMENT.md` for the live path.

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

- **Static site** in `site/` — hand-coded HTML/CSS/JS, no framework, no build step.
  - Design pulled from the client's own printed menu + logo (blush paper `#f6e7db`, brick-red `#a5211a` labels, Playfair Display Didone for the name, Newsreader body). Deliberately not a template — client asked for "no AI slop".
  - Sections: hero, The Food (full menu), Our Story, Visit, footer, mobile sticky call bar, styled `404.html`.
  - Menu fully transcribed from `img/menu.jpg` and **confirmed by client 2026-09-01**:
    - Crispy Pata `₱870 XL · ₱900 Jumbo` ("J" = Jumbo — confirmed)
    - Tokwa't Baboy `min. 2 orders` (confirmed)
    - Pancit bilao sizes + "add ₱50 for sotanghon or canton" note
  - All `tel:` links = `+63285708560` (landline dials as +63 2 8570 8560 — confirmed).
  - Accessible, responsive, `prefers-reduced-motion` respected, near-zero animation, print stylesheet.
  - `robots.txt`, `sitemap.xml`, JSON-LD `Restaurant` schema in `index.html`.
  - Client's `Logo.jpg` → `site/img/logo.jpg`, `Menu.jpg` → `site/img/menu.jpg` (menu photo linked from the page as "view the printed menu").
- **Vercel hosting** — `site/vercel.json` sets `cleanUrls`, security headers
  (CSP, HSTS, `X-Frame-Options`, etc.), and asset cache headers. Project root
  directory is `site/`, no build command. Setup + domain steps in `DEPLOYMENT.md`.
- **CI** — `.github/workflows/ci.yml`: `prettier --check`, `html-validate`, and a
  `lychee` link check on every PR and push to `main`. `package.json` carries the
  dev tooling (`prettier`, `html-validate`); the site itself still has no build step.
- **PR governance** — `.github/pull_request_template.md`, `.github/CODEOWNERS`
  (`* @jkdleon`), branch protection on `main` (PR required, CI checks required,
  no force-push).
- **Archived AWS work** — `infra-aws/` (Terraform: private S3 + CloudFront (OAC) +
  ACM us-east-1 + Route 53) and `infra-aws/scripts/deploy.{ps1,sh}`. Complete,
  internally consistent, **never run**. `docs/aws-setup.md` is the matching
  walkthrough, banner-marked as archived.
- **Docs** — `README.md` (overview + local dev + checks), `DEPLOYMENT.md` (Vercel
  pipeline), `infra-aws/README.md` (why the AWS code is kept).
- `.gitignore` set up (`node_modules/`, `.vercel/`, tfstate/tfvars ignored;
  `.terraform.lock.hcl` intentionally NOT ignored).

---

## Pending / blockers 🚧

1. **Our Story copy.** `site/index.html` has bracketed placeholder text in the `#story` section. There's an HTML comment right above it listing what to ask the client:
   - Aling Nene's full name + what people call her
   - Where "Tumba Tumba" comes from (rocking chair? a place? a nickname?)
   - Year the kitchen started, and on what dish
   - Who runs it now (which generation, whose recipes)
   - One family-only detail (a regular's order, a fiesta, the vat)
     Replace placeholders with the family's own words — do **not** invent or write marketing fluff.
2. **Two photos** (client owns them, not stock). Specs in `site/img/README.md`:
   - `site/img/hero-pata.jpg` — ~2000px wide landscape, the whole crispy pata. Then swap the placeholder `<figure>` in `index.html` for the real one (commented example is right there).
   - `site/img/story.jpg` — ~1400px, portrait/square, family or kitchen. Same swap in the `#story` section.
3. **Register `alingnene.com`** and attach it in Vercel — steps in
   `DEPLOYMENT.md` § "Adding the domain later". Until then the site runs on the
   Vercel `*.vercel.app` URL. After attaching, update the hardcoded
   `https://alingnene.com` URLs in `site/sitemap.xml`, `site/robots.txt`, and the
   `og:url` / JSON-LD `url` in `site/index.html`.
4. **Favicon** — currently points at `logo.jpg`. Make a real `favicon.ico` from
   the logo.
5. **Optional** — decide on a Google Maps embed vs the current plain map link (an
   embed needs a `frame-src` widening in `site/vercel.json`'s CSP).

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
├── package.json         dev-only tooling (prettier, html-validate)
├── .prettierrc  .prettierignore  .htmlvalidate.json
├── .gitignore
├── .github/
│   ├── workflows/ci.yml         prettier + html-validate + lychee link check
│   ├── pull_request_template.md
│   └── CODEOWNERS               * @jkdleon
├── site/
│   ├── index.html       the whole page (Our Story = placeholder)
│   ├── 404.html
│   ├── vercel.json      cleanUrls, security headers, asset cache headers
│   ├── css/styles.css   single stylesheet, design tokens at top
│   ├── js/main.js       ~30 lines: mobile nav toggle + footer year
│   ├── img/
│   │   ├── logo.jpg     ✅ from client
│   │   ├── menu.jpg     ✅ from client
│   │   └── README.md    photo specs + how to add hero/story images
│   ├── robots.txt
│   └── sitemap.xml
├── infra-aws/           ARCHIVED — reference Terraform, never applied
│   ├── versions.tf providers.tf variables.tf main.tf outputs.tf backend.tf
│   ├── terraform.tfvars.example
│   ├── scripts/deploy.ps1 · deploy.sh   (S3 sync + CloudFront invalidation)
│   └── README.md        why this is kept
└── docs/
    └── aws-setup.md     ARCHIVED walkthrough (banner-marked)
```

---

## How to run / deploy

**Local preview:**

```bash
cd D:\projects\aling-nenes\site
python -m http.server 8080
# http://localhost:8080
```

**Checks before pushing:**

```bash
npm install        # once
npm run lint       # prettier --check + html-validate
```

**Deploy:** open a PR (get a preview URL + CI), merge to `main` (production).
No manual deploy step. One-time Vercel project setup is in `DEPLOYMENT.md`.

---

## Design decisions worth keeping

- **Theme `carinderia` was renamed to `kusina` (2026-09-02).** The family
  confirmed this is a restaurant with a supplier, a chiller and a reservation
  book — not a carinderia — and the theme name was reading as a positioning
  claim. **Token values are unchanged**; they came from the client's printed
  menu and logo. A real visual re-theme is still open, and should be reviewed
  before it ships rather than changed by fiat.

- **No framework, no build step** — deliberate. Editable by anyone, nothing to break.
- **Palette + type are derived from the client's real menu/logo**, not chosen freshly. This is the main defence against the site looking AI-generated. Keep it.
- **Menu is a typographic price list**, not cards. Keep it.
- **Almost no motion.** Client explicitly dislikes scroll animations.
- **No cache-busting on assets** — `css/`/`js/` filenames aren't hashed, so
  `vercel.json` keeps their `Cache-Control` short (1h, must-revalidate). Don't
  bump it without adding hashed filenames.
- **CSP is tight** (`script-src 'self'`, fonts allowlisted). Any analytics
  snippet, embed, or inline script needs a matching widening in `site/vercel.json`.

---

## If hosting ever moves back to AWS

The `infra-aws/` Terraform is complete and `docs/aws-setup.md` walks it through.
It was set aside for Vercel's simpler pipeline (no state, IAM, or deploy script
to maintain), not because it's broken. Keeping it as a portfolio artifact of the
AWS static-hosting pattern (private bucket + OAC, cert-region split, DNS alias
records).

---

## Context notes

- Environment is Windows 11, PowerShell primary, Bash tool available. Project on `D:` drive (client's choice).
- Client confirmed menu + phone details on 2026-09-01. Everything else in Our Story is unconfirmed placeholder.
- Hosting switched from AWS to Vercel on 2026-09-01, before first commit. GitHub repo: `jkdleon/tumbatumba`.
- There is a memory file: `aling-nene-website.md` (type: project) with a pointer in `MEMORY.md`.
