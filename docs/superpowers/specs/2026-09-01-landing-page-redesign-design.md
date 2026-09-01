# Aling Nene's Tumba Tumba — Landing Page Redesign

**Status:** Design approved 2026-09-01. Not yet reviewed as a written spec by James. Next step: `superpowers:writing-plans`.
**Owner:** James Kyle (kyleraizel@gmail.com) — building for the family restaurant.
**Branch (to be created):** `redesign`
**This doc supersedes:** nothing. The current `HANDOVER.md` still describes the _live_ site; several of its "deliberate decisions" are deliberately overridden here (see §2).

---

## 1. Why we're doing this

The current site (`site/`, hand-coded static HTML/CSS/JS, live on Vercel) is content-accurate but, in James's words, "not catchy — plain — a landing page should make the customer order." He wants a conversion-focused rebuild.

**The current site is not being deleted.** It stays live on production until James previews the rebuild on a staging URL and picks a direction. Then we cut over (§4).

## 2. Decisions made in the 2026-09-01 brainstorm

| Question                                        | Decision                                                                                                                                                                                                            | Notes / risk                                                                                                                                                                                                                                       |
| ----------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| How far from the documented client constraints? | **Full creative reset.** The `HANDOVER.md` constraints "no framework / no build step / no AI slop / palette+type locked to the menu / almost no motion / menu as a price list not cards" are **no longer binding.** | James owns this call (it's his family's restaurant). He accepted he may need to re-sell the result to the family. Mitigation baked into the design: both visual directions still derive their palette from the existing menu/logo tokens — see §6. |
| What does "make them order" mean?               | **Strong CTAs only. No order builder, no cart, no payment.**                                                                                                                                                        | Ordering stays phone + Facebook Messenger + GCash-on-pickup, exactly as today. The page's job is persuasion + friction removal.                                                                                                                    |
| Stack                                           | **Next.js (latest, App Router, TypeScript) + Tailwind.**                                                                                                                                                            | James asked for it, mainly for familiarity and future extensibility. Acknowledged cost: loses the zero-build / family-can-hand-edit property, changes CI and the Vercel setup.                                                                     |
| Imagery                                         | **Stock photos temporarily**, clearly marked, swapped for the family's own before launch.                                                                                                                           | Client originally said "no stock." Stock is dev-only scaffolding; must not ship.                                                                                                                                                                   |
| Repo landing                                    | **New `web/` directory.** `site/` untouched until cutover.                                                                                                                                                          |                                                                                                                                                                                                                                                    |
| Preview strategy                                | **Build BOTH "Carinderia heat" and "Heritage kitchen"** as two themes of one app; James previews both on a staging Vercel project and picks one to promote.                                                         |                                                                                                                                                                                                                                                    |
| New sections                                    | Open-now indicator, Signature dishes strip, Social proof (national TV feature + vlogger features + Facebook tags). Delivery apps (GrabFood/foodpanda) **not** wanted.                                               |                                                                                                                                                                                                                                                    |

## 3. Goals / non-goals

**Goals**

- A visually distinctive, appetite-driven landing page that drives calls and Facebook messages.
- Two complete visual directions, switchable, both shippable.
- Static output, no backend, deployable on Vercel.
- Lighthouse mobile ≥ 95 (perf / a11y / SEO / best-practices) for both directions.
- All confirmed business data (menu, contacts, hours, GCash) preserved and centralized.

**Non-goals (YAGNI)**

- Online ordering / cart / checkout / payment.
- CMS or admin UI.
- Real photography (separate, James-owned).
- Domain registration (`alingnene.com` still unregistered — see `HANDOVER.md`).
- Delivery-app listings, i18n, blog, reservations backend, Google Maps embed (keep the plain map link).

## 4. Repo, branch & deployment architecture

### 4.1 Layout

```
aling-nenes/
├── site/              # UNCHANGED. Current live site. Stays on prod until cutover.
├── web/               # NEW. The Next.js app. All redesign work happens here.
│   ├── app/
│   │   ├── page.tsx           # "/"          → Carinderia heat
│   │   ├── heritage/page.tsx  # "/heritage"  → Heritage kitchen
│   │   ├── layout.tsx
│   │   ├── robots.ts / sitemap.ts
│   ├── components/    # shared section components (§7)
│   ├── content/       # single source of truth for data (§8)
│   ├── theme/         # carinderia.ts, heritage.ts token maps (§6)
│   ├── lib/           # openNow.ts (Manila-time logic), etc.
│   ├── public/        # logo, stock images (marked), favicon assets
│   ├── next.config.ts # output: 'export', images.unoptimized: true
│   ├── tailwind.config.ts
│   └── package.json   # web app's own deps (separate from repo-root dev tooling)
├── infra-aws/         # unchanged, archived
└── docs/superpowers/specs/2026-09-01-landing-page-redesign-design.md  # this file
```

### 4.2 Branch strategy

- Create branch **`redesign`** off `main`. All work lands there.
- `main` → production stays pointed at `site/`. Never broken during the rebuild.
- Merge `redesign` → `main` only at cutover (§4.4).

### 4.3 Staging on Vercel

Vercel's "root directory" is a **project-level** setting, not per-branch, so we cannot preview `web/` from the existing project without disturbing prod. Instead:

1. James creates a **second Vercel project** ("aling-nene-staging") linked to the same GitHub repo.
2. Root directory: `web/`. Framework preset: **Next.js**. Production branch: `redesign`.
3. This yields a stable staging URL showing `/` (Carinderia) and `/heritage` (Heritage).
4. The existing production project is left alone (root `site/`, no build).
5. Document the exact click-path in `DEPLOYMENT.md` under a new "Staging (redesign)" section.

### 4.4 Cutover procedure (after James picks a direction)

1. On `redesign`: delete the losing route + its `theme/*.ts` file; promote the winner to `/`.
2. Move `site/` → `site-legacy/`; add a short README banner like `infra-aws/`'s ("archived, was the launch site until <date>").
3. Update the **production** Vercel project: root directory `site/` → `web/`, framework preset → Next.js, remove the "no build command" override.
4. Port the security headers from `site/vercel.json` into the Next.js app (§9.3) — headers now come from `next.config.ts` or a `web/vercel.json`.
5. Move/replace `robots.txt` + `sitemap.xml` with the generated Next equivalents; keep the JSON-LD `Restaurant` schema.
6. Update `.github/workflows/ci.yml` (§9.2): drop the `site/**` html-validate glob, keep/point lychee at the built output or the running preview.
7. Delete the staging Vercel project.
8. Update `HANDOVER.md` and `README.md` to describe the Next.js app as the live site; note the "no framework" decision was reversed on <date> and why.

## 5. Page structure (identical for both directions)

1. **Sticky header** — logo, nav (Menu / Story / Visit), "Call to order" button.
   - Mobile: a persistent sticky **order bar** at the bottom ("Call to order — 8570-8560").
   - Desktop: order bar slides in after the hero scrolls out of view.
2. **Hero** — dish photo (stock), large headline, one-line subhead, **Open-now badge**, primary CTA **Call to order** (`tel:+63285708560`), secondary **Message on Facebook** (`m.me/alingnenetumbatumba`), address + hours line.
3. **Signature dishes strip** — 4 cards: **Crispy Pata**, **Sisig**, **Lengua Asado**, **Pancit by the Bilao**. Each: photo, name, one-line description, price, "Order this" → call/Messenger.
4. **Social proof** — "As seen on \<national TV feature\>" with a still or clip; the vlogger features (see §9.4 for the embed-vs-card decision); Facebook rating + "tag us @alingnenetumbatumba" callout. **Content required from James.**
5. **Full menu** — the complete confirmed price list, four groups: **Pork**, **Must Try**, **Pancit by the Bilao** (with the "+₱50 for sotanghon or canton" note), **Extras**. Styled as a lit menu board (Carinderia) or an editorial list (Heritage). Link to the printed-menu photo (`menu.jpg`).
6. **Our Story** — condensed. **Copy is still the unconfirmed placeholder from the current site.** Same open questions carry over (Aling Nene's full name; origin of "Tumba Tumba"; founding year & first dish; who runs it now; one family-only detail). Keep it visibly flagged until the family answers. Do not invent copy.
7. **Visit & order** — address (823 General Kalentong Street, Mandaluyong City, Metro Manila), hours table (daily 9:00 AM–10:00 PM), landline `(02) 8570 8560`, mobile `0932 514 7741`, **GCash `0932 514 7741` (Cristina D.)** shown right at the decision point, Facebook, "dine-in by reservation" note, Google Maps link (plain link, not an embed). Large CTAs.
8. **Footer** — name, address, phone, Facebook, © year, "Site by the family".

## 6. Design tokens per direction

Both directions **derive their palette from the current site's tokens** (`site/css/styles.css` `:root`) — this is the deliberate guard against the "AI slop / generic template" look even under a full reset.

### Carinderia heat (route `/`)

- **Mood:** warm, loud, appetite-first — a busy Manila eatery at night.
- **Canvas:** warm charcoal `#1a1512`; alternating sections in the existing blush `#f6e7db` / cream `#fbf3e3`.
- **Accents:** brick/chili red `#a5211a` → `#d7382a`; warm gold `#e0983f` (all existing tokens, inverted onto a dark ground).
- **Type:** display **Bricolage Grotesque** (heavy, characterful); body **Inter**.
- **Menu treatment:** lit menu-board panel, tabular prices.
- **Motion:** CTA press/hover, sticky-bar slide-in, dish-card lift on hover, gentle pulse on the open-now badge. Full `prefers-reduced-motion` support. No parallax, no scroll-jacking.

### Heritage kitchen (route `/heritage`)

- **Mood:** editorial, premium, trust-led — a decades-old institution.
- **Canvas:** bone/ivory `#f7f0e6`.
- **Accents:** ink `#241c15`, brick `#a5211a` / `#7c1611`, sage `#93ab72` hairlines (existing tokens, refined).
- **Type:** display **Fraunces** (high-contrast old-style serif); body **Newsreader** (already used on the current site).
- **Menu treatment:** editorial price list, generous leading.
- **Layout:** more whitespace, food-magazine photo treatment.
- **Motion:** minimal — short fade/rise on section entry only.

### Mechanism

`theme/carinderia.ts` and `theme/heritage.ts` each export a token object (color, type scale, spacing rhythm, radius/border treatment, motion durations, photo treatment flags). A `<ThemeProvider>` sets these as CSS custom properties on a wrapper `<div>`; `tailwind.config.ts` maps utilities to the CSS variables (e.g. `bg-canvas`, `text-accent`, `font-display`). Route-level layout variants (whitespace, section order tweaks) read a `theme.name` from context. Deleting a direction at cutover = delete one route folder + one theme file.

## 7. Components (each: one purpose, props-driven, independently testable)

| Component                      | Purpose                                                                           | Key inputs                    | Depends on                  |
| ------------------------------ | --------------------------------------------------------------------------------- | ----------------------------- | --------------------------- |
| `SiteHeader`                   | Logo, nav, header CTA, mobile nav toggle                                          | `theme`                       | `content/restaurant`        |
| `StickyOrderBar`               | Always-on (mobile) / scroll-in (desktop) call+message bar                         | `phone`, `messengerUrl`       | scroll listener             |
| `OpenNowBadge`                 | "Open now · closes 10 PM" / "Opens 9 AM"                                          | `hours` config                | `lib/openNow`               |
| `Hero`                         | Headline, subhead, CTAs, photo slot, badge                                        | content module                | `CtaButton`, `OpenNowBadge` |
| `SignatureDishes` / `DishCard` | 4 hero dishes with per-card order CTA                                             | `content/dishes`              | `CtaButton`                 |
| `SocialProof`                  | TV feature + vlogger features + FB rating/tag                                     | `content/press`               | §9.4 decision               |
| `MenuBoard`                    | Full price list, 4 groups, printed-menu link                                      | `content/menu`                | —                           |
| `OurStory`                     | Condensed story + photo slot, placeholder-aware                                   | `content/story`               | —                           |
| `VisitOrder`                   | Address, hours, all contacts, GCash, map link, CTAs                               | `content/restaurant`          | `CtaButton`                 |
| `SiteFooter`                   | Name, address, phone, FB, © year                                                  | `content/restaurant`          | —                           |
| `CtaButton`                    | Shared button; `variant` solid/ghost; renders `<a href="tel:">` or Messenger link | `variant`, `href`, `children` | —                           |

## 8. Content data modules (`web/content/`)

Single source of truth; both themes import these.

- **`restaurant.ts`** — name, address parts, landline `+63285708560` (display `(02) 8570 8560`), mobile `+639325147741` (display `0932 514 7741`), GCash `{ number: "0932 514 7741", name: "Cristina D." }`, hours `{ open: "09:00", close: "22:00", tz: "Asia/Manila", days: "daily" }`, socials `{ facebook: "https://www.facebook.com/alingnenetumbatumba", messenger: "https://m.me/alingnenetumbatumba" }`, maps link.
- **`menu.ts`** — the four groups and every item/price, transcribed from the current site (confirmed by client 2026-09-01). Crispy Pata `870 XL · 900 Jumbo`; Tokwa't Baboy `min. 2 orders`; pancit note "add ₱50 for sotanghon or canton". This is the authoritative copy — `site/` menu must not diverge before cutover.
- **`dishes.ts`** — the 4 signature dishes: name, blurb (write short, factual, no fluff), price ref, image slot.
- **`press.ts`** — TV feature `{ network, show, year, still/clip }`, vloggers `[{ name, url, platform }]`, FB rating. **All placeholder until James supplies real values.**
- **`story.ts`** — the Our Story paragraphs, carrying the same bracketed placeholders + the "questions for the family" comment from `site/index.html`.

## 9. Tech details

### 9.1 Next.js config

- App Router, TypeScript, `output: 'export'` (fully static — no server runtime, portable).
- `images: { unoptimized: true }` (required with static export). Use `next/image` with static imports for the stock photos; every stock file lives under `public/stock/` and is referenced through a `content` image slot so swapping to real photos is a one-line change per slot.
- `next/font/google` self-hosts Bricolage Grotesque, Inter, Fraunces, Newsreader at build time — **no runtime request to Google Fonts** (improves on the current site's render-blocking `<link>` and lets us tighten `font-src` to `'self'`).
- `metadataBase` + per-route `metadata` for OG/Twitter; keep `og:image` pointing at a real asset.

### 9.2 CI (`.github/workflows/ci.yml`)

Add a job (runs on PRs touching `web/**`):

```
- working-directory: web
- npm ci
- npx tsc --noEmit
- npx next lint
- npx next build      # also validates the static export
```

Keep the existing `lint` + `links` jobs for `site/` until cutover. Root-level `npx prettier --check .` should include `web/` (add a `web/.prettierignore` for build output: `.next/`, `out/`).

### 9.3 Security headers

Port everything from `site/vercel.json` `headers` into the new app (via `next.config.ts` `headers()` or `web/vercel.json`), with these changes:

- `font-src` → `'self'` (fonts now self-hosted); drop the `fonts.googleapis.com` / `fonts.gstatic.com` entries and the `<link rel=preconnect>`s.
- `style-src` → `'self'` (no external stylesheet) — but verify Tailwind/Next don't need `'unsafe-inline'` for injected `<style>`; if they do, prefer hashed styles or accept `'unsafe-inline'` for `style-src` only.
- `script-src`: a static Next export ships small inline bootstrap scripts. Test whether `'self'` alone passes; if not, add per-build hashes or fall back to `script-src 'self' 'unsafe-inline'` (document the tradeoff — no nonces available in static export).
- If any video embeds are used in Social Proof, add `frame-src` for exactly those origins (see §9.4). Otherwise keep `object-src 'none'` and no `frame-src`.
- Keep `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy`, `Permissions-Policy`, HSTS.
- Keep the `/img|css|js` cache headers' spirit: Next fingerprints `/_next/static/**`, so give those `immutable` long cache; HTML short.

### 9.4 Social-proof embeds — decision needed

Two options for the vlogger features, pick during planning:

- **(a) Thumbnail cards that link out** (recommended): no iframes, CSP stays tight, fastest. Store a poster image + URL per creator.
- **(b) Real embeds** (YouTube `youtube-nocookie.com`, Facebook video): richer, but needs `frame-src` widening, hurts Lighthouse, adds third-party JS. Only if James specifically wants inline playback.

### 9.5 Open-now logic (`lib/openNow.ts`)

Pure function: given `hours` + a `Date`, compute the current time **in `Asia/Manila`** (via `Intl.DateTimeFormat` with `timeZone`, not the visitor's local zone) and return `{ open: boolean, label: string }`. Rendered by `OpenNowBadge` as a client component (so it's correct on load and can update). No server needed.

## 10. Content required from James before launch (not blockers for the build)

- **TV feature:** network, show name, year, and a still image or clip link; permission to use.
- **Vloggers:** names, video links, platform; permission to embed/quote; which ones to feature.
- **Testimonials:** which Facebook reviews (or other quotes) to display, with attribution.
- **Our Story:** the family's real answers, or confirmation to keep the flagged placeholder.
- **Confirm** `m.me/alingnenetumbatumba` resolves to the right inbox.
- **Photo shot-list** for the real shoot: hero pata, the 4 signature dishes, kitchen/family, storefront on General Kalentong.
- Decide embeds vs. link-out cards for social proof (§9.4).

## 11. Testing / verification

- **CI gate:** `tsc --noEmit`, `next lint`, `next build` all pass.
- **Manual:** review the staging URL — both `/` and `/heritage` — on mobile and desktop. This is the primary acceptance check and the basis for James's direction pick.
- **Lighthouse** (mobile): ≥ 95 perf / a11y / SEO / best-practices on both routes.
- **A11y:** keyboard pass through nav toggle, sticky bar, all CTAs, badge; visible focus; `prefers-reduced-motion` honored; axe clean.
- **Links:** extend lychee to the built `web/out/**` (or the running preview).
- **Playwright:** not installed locally and no browser binaries. Optional: add `@playwright/test` + a single smoke spec (page renders, CTAs have correct `tel:`/`m.me` hrefs, badge shows a label) only if James wants it; otherwise rely on `next build` + manual review.

## 12. Open questions / risks

- **CSP vs. static Next export** (§9.3) — may be forced to `script-src 'self' 'unsafe-inline'`. Acceptable but note it.
- **"Full creative reset" vs. the family** — James may still need to sell the result internally; both directions hedging back to the menu palette is the mitigation.
- **Stock photos must not ship** — enforce a pre-launch checklist item; consider a build-time warning if any `public/stock/**` file is still referenced.
- **Two Vercel projects billing/limits** — hobby tier should be fine; confirm.
- **Our Story still unconfirmed** — Heritage direction leans harder on heritage narrative; if the copy never lands, Heritage is weaker. Carinderia is more resilient to missing story copy.
- **`m.me` link** unverified.

## 13. Next step

Hand this spec to **`superpowers:writing-plans`** to produce the phased implementation plan. Suggested phase breakdown:

1. Scaffold `web/` (Next.js + TS + Tailwind + fonts + `output: export`), CI job, `content/` modules from confirmed data, `lib/openNow`.
2. Shared primitives: `ThemeProvider`, `tailwind.config` variable mapping, `CtaButton`, `OpenNowBadge`, `SiteHeader`, `StickyOrderBar`, `SiteFooter`.
3. Section components against the Carinderia theme on `/`: `Hero`, `SignatureDishes`, `SocialProof` (link-out cards), `MenuBoard`, `OurStory`, `VisitOrder`.
4. `theme/heritage.ts` + `/heritage` route + layout variants; verify both render from the same components.
5. SEO (`robots.ts`, `sitemap.ts`, JSON-LD, metadata), security headers, Lighthouse/a11y pass.
6. Staging Vercel project + `DEPLOYMENT.md` "Staging (redesign)" section. Stop here for James's direction pick — cutover (§4.4) is a separate follow-up.
