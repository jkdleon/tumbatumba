# Landing Page Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the Aling Nene's Tumba Tumba landing page as a static Next.js app in a new `web/` directory, with two switchable visual directions ("Carinderia heat" at `/`, "Heritage kitchen" at `/heritage`) built from one shared component set, deployable to a staging Vercel project without touching the live `site/`.

**Architecture:** One Next.js App Router app, `output: 'export'` (fully static, no server runtime). All business data lives in typed modules under `web/content/`. Both visual directions are _themes_ of the same components: a `theme/*.ts` token object is applied by `<ThemeProvider>` as CSS custom properties on a wrapper `<div>`; Tailwind v4 utilities (`bg-canvas`, `text-ink`, `font-display`, …) are mapped to those variables via `@theme inline` in `globals.css`, so swapping the token object reskins every component. Route-level layout differences read `theme.name` / `theme.layout` from React context. Deleting a direction at cutover = delete one route folder + one `theme/*.ts` file.

**Tech Stack:** Next.js 15 (App Router, TypeScript), React 19, Tailwind CSS v4 (`@tailwindcss/postcss`), `next/font/google` (self-hosted Bricolage Grotesque, Inter, Fraunces, Newsreader), Vitest + React Testing Library + jsdom for unit/component tests, GitHub Actions CI, Vercel static hosting.

**Spec:** `docs/superpowers/specs/2026-09-01-landing-page-redesign-design.md` — read it alongside this plan. Section references below (§5, §6, …) point into that spec.

## Global Constraints

Every task's requirements implicitly include this section. Values are copied verbatim from the spec.

- **Stack is fixed:** Next.js (latest, App Router, TypeScript) + Tailwind. No CMS, no backend, no online ordering / cart / checkout / payment.
- **`output: 'export'`** — fully static. `images: { unoptimized: true }`. No server runtime, no route handlers, no middleware, no ISR.
- **`site/` is untouched** by every task in this plan. All new work lands in `web/` (and small edits to repo-root `.gitignore`, `.prettierignore`, `.github/workflows/ci.yml`, `DEPLOYMENT.md`). Cutover (spec §4.4) is a separate follow-up and is **out of scope** here — do not move `site/`, do not edit the production Vercel project, do not rewrite `HANDOVER.md` / `README.md`.
- **Both directions derive their palette from the current site's tokens** (`site/css/styles.css` `:root`): `--paper #f6e7db`, `--paper-2 #fbf3e3`, `--ink #241c15`, `--brick #a5211a`, `--brick-deep #7c1611`, `--sage #93ab72`, `--gold #e0983f`. This is the deliberate guard against a generic-template look; do not introduce unrelated colors.
- **Fonts are self-hosted at build time** via `next/font/google`. No runtime request to Google Fonts, no `<link rel=preconnect>` to font hosts.
- **Stock photos must not ship.** Every placeholder image lives under `web/public/stock/` and is referenced through a `content` image slot so swapping to a real photo is a one-line change. A CI step lists any `/stock/` reference still present in the build.
- **All confirmed business data is centralized in `web/content/`** and is the single source of truth. Transcribe exactly from `site/index.html` (client-confirmed 2026-09-01). Do not let `site/` and `web/content/` diverge.
- **Contacts (exact):** landline display `(02) 8570 8560` / href `tel:+63285708560`; mobile display `0932 514 7741` / href `tel:+639325147741`; GCash `0932 514 7741` name `Cristina D.`; Facebook `https://www.facebook.com/alingnenetumbatumba`; Messenger `https://m.me/alingnenetumbatumba`; address `823 General Kalentong Street, Mandaluyong City, Metro Manila`; hours `daily 09:00–22:00` timezone `Asia/Manila`.
- **Open-now logic computes time in `Asia/Manila`**, not the visitor's local zone (`Intl.DateTimeFormat` with `timeZone`).
- **Social-proof embeds decision (spec §9.4): option (a) — thumbnail cards that link out.** No iframes, no third-party JS, CSP stays tight. Do not add `frame-src` or YouTube/Facebook embeds.
- **Security headers ship via `web/vercel.json`**, not `next.config.ts`. `next.config` `headers()` is a no-op under `output: 'export'`.
- **Our Story and press content stay visibly flagged as placeholder** until the family answers. Do not invent copy. Carry the bracketed placeholders and the "questions for the family" list from `site/index.html`.
- **Lighthouse (mobile) ≥ 95** for perf / a11y / SEO / best-practices on both `/` and `/heritage`. Full `prefers-reduced-motion` support. No parallax, no scroll-jacking.
- **CI gate:** `tsc --noEmit`, `next lint`, `next build`, and `vitest run` all pass for changes touching `web/**`. Root `prettier --check .` must include `web/` (with `.next/` and `out/` ignored).
- **Local test runner override (added during execution):** `web/package.json` carries `"overrides": { "rollup": "npm:@rollup/wasm-node@<ver>" }` plus `@rollup/wasm-node` as a devDependency. The local dev machine's Application Control policy blocks rollup's native `.node` binding, and rollup's stub fallback breaks Vite's SSR transform (`Unknown node type: undefined`). `@rollup/wasm-node` is Vite's documented WASM fallback and is inert on CI Linux. A clean reinstall (`rm -rf node_modules package-lock.json && npm install`) is required after adding the override for it to take effect.

---

## File Structure

New tree under `web/` (created across Phase 1–2; every path is exact):

```
web/
├── package.json                 # web app deps, separate from repo-root dev tooling
├── package-lock.json            # committed
├── next.config.ts               # output: 'export', images.unoptimized
├── tsconfig.json                # paths: { "@/*": ["./*"] }
├── postcss.config.mjs           # @tailwindcss/postcss
├── .eslintrc.json               # extends next/core-web-vitals (prevents next lint prompt)
├── .prettierignore              # .next/  out/
├── vitest.config.ts             # jsdom, @ alias, setup file
├── vitest.setup.ts              # jest-dom matchers, mocks for next/font + next/image
├── vercel.json                  # security headers (added Phase 5)
├── scripts/
│   └── check-no-stock.mjs       # warns if built output still references /stock/
├── app/
│   ├── globals.css              # @import "tailwindcss"; @theme inline var mapping
│   ├── layout.tsx               # <html>, next/font wiring, metadataBase, JSON-LD
│   ├── page.tsx                 # "/"          → <LandingPage theme={carinderia} />
│   ├── heritage/page.tsx        # "/heritage"  → <LandingPage theme={heritage} />
│   ├── robots.ts
│   └── sitemap.ts
├── lib/
│   ├── openNow.ts               # pure Asia/Manila open/closed logic
│   └── siteUrl.ts               # absolute site URL (env-overridable)
├── theme/
│   ├── tokens.ts                # Theme type
│   ├── carinderia.ts            # token object for "/"
│   └── heritage.ts              # token object for "/heritage"
├── content/
│   ├── restaurant.ts            # name, address, phones, GCash, hours, socials, map
│   ├── menu.ts                  # 4 groups + every item/price (from site/index.html)
│   ├── dishes.ts                # 4 signature dishes
│   ├── press.ts                 # TV feature + vloggers + FB rating (all placeholder)
│   └── story.ts                 # Our Story paragraphs + questions-for-family list
├── components/
│   ├── ThemeProvider.tsx        # sets --t-* CSS vars, exposes useTheme()
│   ├── LandingPage.tsx          # composes every section; takes a `theme` prop
│   ├── CtaButton.tsx            # shared <a> button; variant solid|ghost
│   ├── OpenNowBadge.tsx         # client; renders lib/openNow output, ticks each minute
│   ├── SiteHeader.tsx           # client; logo, nav, header CTA, mobile nav toggle
│   ├── StickyOrderBar.tsx       # client; always-on mobile / scroll-in desktop
│   ├── SiteFooter.tsx
│   ├── Hero.tsx
│   ├── SignatureDishes.tsx      # + DishCard (same file)
│   ├── SocialProof.tsx          # link-out thumbnail cards, placeholder-aware
│   ├── MenuBoard.tsx            # full price list, board vs editorial per theme
│   ├── OurStory.tsx             # placeholder-aware
│   ├── VisitOrder.tsx
│   └── RestaurantSchema.tsx     # JSON-LD <script>
└── public/
    ├── logo.jpg                 # copied from site/img/logo.jpg
    ├── menu.jpg                 # copied from site/img/menu.jpg (printed-menu link target)
    └── stock/                   # marked stock photos, dev-only
        ├── README.md
        ├── hero-pata.jpg
        ├── dish-pata.jpg
        ├── dish-sisig.jpg
        ├── dish-lengua.jpg
        ├── dish-pancit.jpg
        └── story.jpg
```

Repo-root edits: `.gitignore` (+`web/node_modules`, `web/.next`, `web/out`), `.prettierignore` (+`web/.next`, `web/out`), `.github/workflows/ci.yml` (+`web` job), `DEPLOYMENT.md` (+"Staging (redesign)" section).

---

## Phase 1 — Scaffold & data

### Task 1: Scaffold the `web/` Next.js app

**Files:**

- Create: `web/package.json`, `web/next.config.ts`, `web/tsconfig.json`, `web/next-env.d.ts`, `web/postcss.config.mjs`, `web/.eslintrc.json`, `web/.prettierignore`, `web/app/globals.css`, `web/app/layout.tsx`, `web/app/page.tsx`
- Modify: `.gitignore` (repo root), `.prettierignore` (repo root)

**Interfaces:**

- Produces: a buildable static app. `npx next build` (run in `web/`) emits `web/out/index.html`. `web/app/page.tsx` default export `Page()` is replaced in Task 22; for now it renders a visible marker.

- [ ] **Step 1: Create `web/package.json`**

```json
{
  "name": "aling-nene-web",
  "version": "0.0.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "typecheck": "tsc --noEmit",
    "test": "vitest run",
    "check:stock": "node scripts/check-no-stock.mjs"
  },
  "dependencies": {
    "next": "^15.5.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0"
  },
  "devDependencies": {
    "@tailwindcss/postcss": "^4.0.0",
    "@testing-library/jest-dom": "^6.6.3",
    "@testing-library/react": "^16.1.0",
    "@testing-library/user-event": "^14.5.2",
    "@types/node": "^20.17.0",
    "@types/react": "^19.0.0",
    "@types/react-dom": "^19.0.0",
    "@vitejs/plugin-react": "^4.3.4",
    "eslint": "^8.57.1",
    "eslint-config-next": "^15.5.0",
    "jsdom": "^25.0.1",
    "tailwindcss": "^4.0.0",
    "typescript": "^5.7.0",
    "vitest": "^2.1.8"
  }
}
```

- [ ] **Step 2: Create `web/next.config.ts`**

```ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  images: { unoptimized: true },
  trailingSlash: false,
};

export default nextConfig;
```

- [ ] **Step 3: Create `web/tsconfig.json`**

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": false,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": { "@/*": ["./*"] }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules", "out", ".next"]
}
```

- [ ] **Step 4: Create `web/next-env.d.ts`**

```ts
/// <reference types="next" />
/// <reference types="next/image-types/global" />

// NOTE: This file should not be edited
// see https://nextjs.org/docs/app/api-reference/config/typescript for more information.
```

- [ ] **Step 5: Create `web/postcss.config.mjs`**

```js
const config = {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};

export default config;
```

- [ ] **Step 6: Create `web/.eslintrc.json`** (its presence stops `next lint` from prompting interactively)

```json
{
  "extends": "next/core-web-vitals"
}
```

- [ ] **Step 7: Create `web/.prettierignore`**

```
.next/
out/
```

- [ ] **Step 8: Create `web/app/globals.css`**

```css
@import "tailwindcss";

/* Map Tailwind utility namespaces to the CSS custom properties that
   <ThemeProvider> sets on its wrapper. `inline` keeps the generated
   utilities referencing var(--t-*) so a runtime theme swap reskins
   everything. The --t-* fallbacks below are the Carinderia values, so
   the page still renders correctly before a provider mounts. */
@theme inline {
  --color-canvas: var(--t-canvas);
  --color-surface-1: var(--t-surface-1);
  --color-surface-2: var(--t-surface-2);
  --color-ink: var(--t-ink);
  --color-ink-invert: var(--t-ink-invert);
  --color-accent: var(--t-accent);
  --color-accent-strong: var(--t-accent-strong);
  --color-gold: var(--t-gold);
  --color-sage: var(--t-sage);
  --font-display: var(--t-font-display);
  --font-body: var(--t-font-body);
  --radius-theme: var(--t-radius);
}

@layer base {
  :root {
    --t-canvas: #1a1512;
    --t-surface-1: #f6e7db;
    --t-surface-2: #fbf3e3;
    --t-ink: #241c15;
    --t-ink-invert: #fbf3e3;
    --t-accent: #a5211a;
    --t-accent-strong: #d7382a;
    --t-gold: #e0983f;
    --t-sage: #93ab72;
    --t-font-display: var(--font-bricolage), ui-sans-serif, system-ui, sans-serif;
    --t-font-body: var(--font-inter), ui-sans-serif, system-ui, sans-serif;
    --t-radius: 0.5rem;
    --t-motion-fast: 150ms;
    --t-motion-slide: 320ms;
  }

  html {
    -webkit-text-size-adjust: 100%;
  }

  body {
    margin: 0;
    background: var(--color-canvas);
    color: var(--color-ink);
    font-family: var(--font-body);
    line-height: 1.6;
    -webkit-font-smoothing: antialiased;
    text-rendering: optimizeLegibility;
  }

  img {
    max-width: 100%;
    height: auto;
    display: block;
  }
}
```

- [ ] **Step 9: Create `web/app/layout.tsx`** (fonts are wired in Task 9; keep minimal for now)

```tsx
import "./globals.css";
import type { ReactNode } from "react";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
```

- [ ] **Step 10: Create `web/app/page.tsx`** (placeholder — replaced in Task 22)

```tsx
export default function Page() {
  return (
    <main className="p-8">
      <h1 className="font-display text-3xl text-accent">web scaffold OK</h1>
    </main>
  );
}
```

- [ ] **Step 11: Append web build artifacts to repo-root `.gitignore`**

Add under the "Node / tooling" section:

```
web/node_modules/
web/.next/
web/out/
```

- [ ] **Step 12: Append web build output to repo-root `.prettierignore`**

Add:

```
web/.next/
web/out/
```

- [ ] **Step 13: Install and build**

Run:

```bash
cd web && npm install && npm run build
```

Expected: `npm install` writes `web/package-lock.json`; `npm run build` completes with "Exporting (…)" and creates `web/out/index.html`.

- [ ] **Step 14: Commit**

```bash
git add web/package.json web/package-lock.json web/next.config.ts web/tsconfig.json web/next-env.d.ts web/postcss.config.mjs web/.eslintrc.json web/.prettierignore web/app .gitignore .prettierignore
git commit -m "feat(web): scaffold static Next.js app with Tailwind v4"
```

---

### Task 2: Vitest + React Testing Library harness

**Files:**

- Create: `web/vitest.config.ts`, `web/vitest.setup.ts`, `web/lib/sample.test.ts`

**Interfaces:**

- Produces: `npm test` (in `web/`) runs Vitest once. Tests may import from `@/…`. `next/font/google` and `next/image` are mocked globally so component tests never touch the Next compiler.

- [ ] **Step 1: Write the failing test — `web/lib/sample.test.ts`**

```ts
import { describe, expect, it } from "vitest";

describe("test harness", () => {
  it("runs", () => {
    expect(1 + 1).toBe(2);
  });
});
```

- [ ] **Step 2: Run it to verify it fails**

Run: `cd web && npx vitest run lib/sample.test.ts`
Expected: FAIL — "Cannot find config" / "vitest is not recognized" is not it; the real expected failure is `Error: No test files found` or a config error because `vitest.config.ts` does not exist yet. (If Vitest picks it up with zero config and passes, that is also acceptable — proceed to Step 3 to pin the config.)

- [ ] **Step 3: Create `web/vitest.config.ts`**

```ts
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import { fileURLToPath } from "node:url";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: { "@": fileURLToPath(new URL("./", import.meta.url)) },
  },
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./vitest.setup.ts"],
    include: ["**/*.test.{ts,tsx}"],
  },
});
```

- [ ] **Step 4: Create `web/vitest.setup.ts`**

```ts
import "@testing-library/jest-dom/vitest";
import { vi } from "vitest";
import React from "react";

// next/font/google needs the Next compiler; stub it for jsdom tests.
vi.mock("next/font/google", () => {
  const stub = () => ({ variable: "", className: "", style: { fontFamily: "" } });
  return new Proxy({}, { get: () => stub });
});

// Render next/image as a plain <img> in tests.
vi.mock("next/image", () => ({
  default: (props: Record<string, unknown>) => React.createElement("img", props),
}));
```

- [ ] **Step 5: Run the test to verify it passes**

Run: `cd web && npm test`
Expected: PASS — 1 passed.

- [ ] **Step 6: Commit**

```bash
git add web/vitest.config.ts web/vitest.setup.ts web/lib/sample.test.ts web/package.json
git commit -m "test(web): add vitest + testing-library harness"
```

---

### Task 3: `content/restaurant.ts`

**Files:**

- Create: `web/content/restaurant.ts`, `web/content/restaurant.test.ts`

**Interfaces:**

- Produces:

  ```ts
  export interface Address {
    street: string;
    locality: string;
    region: string;
    country: string;
  }
  export interface Phone {
    landlineDisplay: string;
    landlineHref: string;
    mobileDisplay: string;
    mobileHref: string;
  }
  export interface GCash {
    number: string;
    name: string;
  }
  export interface Hours {
    open: string;
    close: string;
    tz: string;
    days: string;
  }
  export interface Socials {
    facebook: string;
    messenger: string;
  }
  export interface Restaurant {
    name: string;
    shortName: string;
    cuisine: string;
    address: Address;
    phone: Phone;
    gcash: GCash;
    hours: Hours;
    socials: Socials;
    mapsUrl: string;
    reservationNote: string;
    priceRange: string;
  }
  export const restaurant: Restaurant;
  ```

  Consumed by `SiteHeader`, `StickyOrderBar`, `Hero`, `VisitOrder`, `SiteFooter`, `RestaurantSchema`, `OpenNowBadge` (via `restaurant.hours`).

- [ ] **Step 1: Write the failing test — `web/content/restaurant.test.ts`**

```ts
import { describe, expect, it } from "vitest";
import { restaurant } from "@/content/restaurant";

describe("restaurant content", () => {
  it("has the confirmed contact values", () => {
    expect(restaurant.phone.landlineHref).toBe("tel:+63285708560");
    expect(restaurant.phone.landlineDisplay).toBe("(02) 8570 8560");
    expect(restaurant.phone.mobileHref).toBe("tel:+639325147741");
    expect(restaurant.phone.mobileDisplay).toBe("0932 514 7741");
  });

  it("has GCash under Cristina D.", () => {
    expect(restaurant.gcash).toEqual({ number: "0932 514 7741", name: "Cristina D." });
  });

  it("opens 09:00 and closes 22:00 in Asia/Manila, daily", () => {
    expect(restaurant.hours).toEqual({
      open: "09:00",
      close: "22:00",
      tz: "Asia/Manila",
      days: "daily",
    });
  });

  it("links Facebook and Messenger", () => {
    expect(restaurant.socials.facebook).toBe("https://www.facebook.com/alingnenetumbatumba");
    expect(restaurant.socials.messenger).toBe("https://m.me/alingnenetumbatumba");
  });

  it("carries the full address", () => {
    expect(restaurant.address).toEqual({
      street: "823 General Kalentong Street",
      locality: "Mandaluyong City",
      region: "Metro Manila",
      country: "PH",
    });
  });
});
```

- [ ] **Step 2: Run to verify it fails**

Run: `cd web && npx vitest run content/restaurant.test.ts`
Expected: FAIL — "Failed to resolve import '@/content/restaurant'".

- [ ] **Step 3: Create `web/content/restaurant.ts`**

```ts
export interface Address {
  street: string;
  locality: string;
  region: string;
  country: string;
}

export interface Phone {
  landlineDisplay: string;
  landlineHref: string;
  mobileDisplay: string;
  mobileHref: string;
}

export interface GCash {
  number: string;
  name: string;
}

export interface Hours {
  open: string; // "HH:MM", 24h
  close: string; // "HH:MM", 24h
  tz: string; // IANA timezone
  days: string; // human-readable, e.g. "daily"
}

export interface Socials {
  facebook: string;
  messenger: string;
}

export interface Restaurant {
  name: string;
  shortName: string;
  cuisine: string;
  address: Address;
  phone: Phone;
  gcash: GCash;
  hours: Hours;
  socials: Socials;
  mapsUrl: string;
  reservationNote: string;
  priceRange: string;
}

/**
 * Single source of truth for business data. Transcribed from site/index.html,
 * client-confirmed 2026-09-01. Do not let site/ and this module diverge.
 */
export const restaurant: Restaurant = {
  name: "Aling Nene's Tumba Tumba Crispy Pata",
  shortName: "Aling Nene's Tumba Tumba",
  cuisine: "Filipino",
  address: {
    street: "823 General Kalentong Street",
    locality: "Mandaluyong City",
    region: "Metro Manila",
    country: "PH",
  },
  phone: {
    landlineDisplay: "(02) 8570 8560",
    landlineHref: "tel:+63285708560",
    mobileDisplay: "0932 514 7741",
    mobileHref: "tel:+639325147741",
  },
  gcash: {
    number: "0932 514 7741",
    name: "Cristina D.",
  },
  hours: {
    open: "09:00",
    close: "22:00",
    tz: "Asia/Manila",
    days: "daily",
  },
  socials: {
    facebook: "https://www.facebook.com/alingnenetumbatumba",
    messenger: "https://m.me/alingnenetumbatumba",
  },
  mapsUrl:
    "https://www.google.com/maps/search/?api=1&query=823+General+Kalentong+Street+Mandaluyong+City",
  reservationNote:
    "Dine-in is by reservation. Call ahead for a table, or to have the pata, bilao, and platters ready for pick-up.",
  priceRange: "₱₱",
};
```

- [ ] **Step 4: Run to verify it passes**

Run: `cd web && npx vitest run content/restaurant.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add web/content/restaurant.ts web/content/restaurant.test.ts
git commit -m "feat(web): add restaurant content module"
```

---

### Task 4: `content/menu.ts`

**Files:**

- Create: `web/content/menu.ts`, `web/content/menu.test.ts`

**Interfaces:**

- Produces:

  ```ts
  export interface MenuItem {
    name: string;
    qualifier?: string;
    price: string;
  }
  export interface MenuGroup {
    id: string;
    label: string;
    note?: string;
    wide?: boolean;
    items: MenuItem[];
  }
  export const menuGroups: MenuGroup[];
  export const printedMenuHref: string; // "/menu.jpg"
  ```

  `price` is a string to preserve `"870 XL · 900 Jumbo"`. Consumed by `MenuBoard`.

- [ ] **Step 1: Write the failing test — `web/content/menu.test.ts`**

```ts
import { describe, expect, it } from "vitest";
import { menuGroups, printedMenuHref } from "@/content/menu";

describe("menu content", () => {
  it("has the four confirmed groups in order", () => {
    expect(menuGroups.map((g) => g.label)).toEqual([
      "Pork",
      "Must Try",
      "Pancit by the Bilao",
      "Extras",
    ]);
  });

  it("keeps Crispy Pata's dual price string verbatim", () => {
    const pork = menuGroups.find((g) => g.id === "pork")!;
    const pata = pork.items.find((i) => i.name === "Crispy Pata")!;
    expect(pata.price).toBe("870 XL · 900 Jumbo");
  });

  it("keeps the pancit +₱50 note", () => {
    const pancit = menuGroups.find((g) => g.id === "pancit")!;
    expect(pancit.note).toBe(
      "Choice of bihon or mix (canton–bihon). Add ₱50 for sotanghon or canton.",
    );
  });

  it("keeps the Tokwa't Baboy minimum-order qualifier", () => {
    const pork = menuGroups.find((g) => g.id === "pork")!;
    const tokwa = pork.items.find((i) => i.name === "Tokwa't Baboy")!;
    expect(tokwa.qualifier).toBe("min. 2 orders");
  });

  it("has 5 pork, 4 must-try, 4 pancit, 2 extras items", () => {
    expect(menuGroups.map((g) => g.items.length)).toEqual([5, 4, 4, 2]);
  });

  it("links the printed menu photo", () => {
    expect(printedMenuHref).toBe("/menu.jpg");
  });
});
```

- [ ] **Step 2: Run to verify it fails**

Run: `cd web && npx vitest run content/menu.test.ts`
Expected: FAIL — cannot resolve `@/content/menu`.

- [ ] **Step 3: Create `web/content/menu.ts`** (transcribed from `site/index.html` menu section)

```ts
export interface MenuItem {
  name: string;
  qualifier?: string;
  price: string;
}

export interface MenuGroup {
  id: string;
  label: string;
  note?: string;
  wide?: boolean;
  items: MenuItem[];
}

/** Full price list, four groups. Verbatim from site/index.html (confirmed 2026-09-01). */
export const menuGroups: MenuGroup[] = [
  {
    id: "pork",
    label: "Pork",
    items: [
      { name: "Crispy Pata", price: "870 XL · 900 Jumbo" },
      { name: "Crispy Ulo", price: "900" },
      { name: "Lumpiang Shanghai", qualifier: "10 pcs", price: "200" },
      { name: "Tokwa't Baboy", qualifier: "min. 2 orders", price: "200" },
      { name: "Big Siomai", qualifier: "5 pcs", price: "50" },
    ],
  },
  {
    id: "must-try",
    label: "Must Try",
    items: [
      { name: "Cheese Sticks", qualifier: "25 pcs", price: "60" },
      { name: "Cheese Sticks", qualifier: "homemade, 50 pcs", price: "120" },
      { name: "Lengua Asado", price: "200" },
      { name: "Sisig", price: "200" },
    ],
  },
  {
    id: "pancit",
    label: "Pancit by the Bilao",
    wide: true,
    note: "Choice of bihon or mix (canton–bihon). Add ₱50 for sotanghon or canton.",
    items: [
      { name: "Small Bilao", qualifier: "good for 3–4", price: "350" },
      { name: "Medium Bilao", qualifier: "good for 5–7", price: "450" },
      { name: "Large Bilao", qualifier: "good for 8–10", price: "650" },
      { name: "XL Bilao", qualifier: "good for 11–15", price: "850" },
    ],
  },
  {
    id: "extras",
    label: "Extras",
    items: [
      { name: "Suka", price: "10" },
      { name: "Sweet Chili", price: "15" },
    ],
  },
];

export const printedMenuHref = "/menu.jpg";
```

- [ ] **Step 4: Run to verify it passes**

Run: `cd web && npx vitest run content/menu.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add web/content/menu.ts web/content/menu.test.ts
git commit -m "feat(web): add menu content module"
```

---

### Task 5: `content/dishes.ts`, `content/press.ts`, `content/story.ts`

**Files:**

- Create: `web/content/dishes.ts`, `web/content/press.ts`, `web/content/story.ts`, `web/content/dishes.test.ts`, `web/content/press.test.ts`, `web/content/story.test.ts`

**Interfaces:**

- Produces:

  ```ts
  // dishes.ts
  export interface ImageSlot {
    src: string;
    alt: string;
    isStock: boolean;
  }
  export interface Dish {
    id: string;
    name: string;
    blurb: string;
    price: string;
    image: ImageSlot;
  }
  export const dishes: Dish[]; // exactly 4: pata, sisig, lengua, pancit

  // press.ts
  export interface TvFeature {
    network: string;
    show: string;
    year: string;
    confirmed: boolean;
  }
  export interface Vlogger {
    name: string;
    url: string;
    platform: string;
    poster: ImageSlot;
  }
  export interface FacebookProof {
    ratingLabel: string;
    tagHandle: string;
    confirmed: boolean;
  }
  export interface Press {
    tvFeature: TvFeature;
    vloggers: Vlogger[];
    facebook: FacebookProof;
  }
  export const press: Press;

  // story.ts
  export interface Story {
    confirmed: boolean;
    questionsForFamily: string[];
    paragraphs: string[];
  }
  export const story: Story;
  ```

  `ImageSlot` is re-exported from `dishes.ts` and imported by `press.ts`. Consumed by `SignatureDishes`, `SocialProof`, `OurStory`.

- [ ] **Step 1: Write the failing tests**

`web/content/dishes.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { dishes } from "@/content/dishes";

describe("dishes content", () => {
  it("has the four signature dishes from the spec", () => {
    expect(dishes.map((d) => d.name)).toEqual([
      "Crispy Pata",
      "Sisig",
      "Lengua Asado",
      "Pancit by the Bilao",
    ]);
  });

  it("marks every image as stock under /stock/", () => {
    for (const d of dishes) {
      expect(d.image.isStock).toBe(true);
      expect(d.image.src.startsWith("/stock/")).toBe(true);
      expect(d.image.alt.length).toBeGreaterThan(0);
    }
  });

  it("gives every dish a non-empty factual blurb and a price", () => {
    for (const d of dishes) {
      expect(d.blurb.trim().length).toBeGreaterThan(0);
      expect(d.price.trim().length).toBeGreaterThan(0);
    }
  });
});
```

`web/content/press.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { press } from "@/content/press";

describe("press content", () => {
  it("is unconfirmed until James supplies real values", () => {
    expect(press.tvFeature.confirmed).toBe(false);
    expect(press.facebook.confirmed).toBe(false);
  });

  it("keeps the Facebook tag handle", () => {
    expect(press.facebook.tagHandle).toBe("@alingnenetumbatumba");
  });

  it("starts with no vloggers listed", () => {
    expect(press.vloggers).toEqual([]);
  });
});
```

`web/content/story.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { story } from "@/content/story";

describe("story content", () => {
  it("is flagged unconfirmed", () => {
    expect(story.confirmed).toBe(false);
  });

  it("carries the five questions for the family", () => {
    expect(story.questionsForFamily).toHaveLength(5);
  });

  it("keeps the bracketed placeholder markers in the copy", () => {
    const joined = story.paragraphs.join("\n");
    expect(joined).toContain("[Placeholder");
    expect(joined).toContain("[names, roles]");
  });
});
```

- [ ] **Step 2: Run to verify all three fail**

Run: `cd web && npx vitest run content/dishes.test.ts content/press.test.ts content/story.test.ts`
Expected: FAIL — three unresolved imports.

- [ ] **Step 3: Create `web/content/dishes.ts`**

```ts
export interface ImageSlot {
  src: string;
  alt: string;
  isStock: boolean;
}

export interface Dish {
  id: string;
  name: string;
  blurb: string;
  price: string;
  image: ImageSlot;
}

/**
 * The four hero dishes for the Signature strip (spec §5.3). Blurbs are short and
 * factual — no fluff. Images are stock placeholders; swap `src`/`alt`/`isStock`
 * per slot when the family's photos arrive.
 */
export const dishes: Dish[] = [
  {
    id: "pata",
    name: "Crispy Pata",
    blurb: "Whole pork leg, scored and simmered, then fried until the skin blisters and cracks.",
    price: "₱870 XL · ₱900 Jumbo",
    image: {
      src: "/stock/dish-pata.jpg",
      alt: "Stock photo: a whole crispy pata on a platter beside a dish of vinegar.",
      isStock: true,
    },
  },
  {
    id: "sisig",
    name: "Sisig",
    blurb: "Chopped, seasoned pork served sizzling straight off the plate.",
    price: "₱200",
    image: {
      src: "/stock/dish-sisig.jpg",
      alt: "Stock photo: pork sisig on a hot cast-iron plate with a raw egg and calamansi.",
      isStock: true,
    },
  },
  {
    id: "lengua",
    name: "Lengua Asado",
    blurb: "Ox tongue braised low and slow in a rich brown gravy.",
    price: "₱200",
    image: {
      src: "/stock/dish-lengua.jpg",
      alt: "Stock photo: sliced lengua asado in brown gravy on a serving dish.",
      isStock: true,
    },
  },
  {
    id: "pancit",
    name: "Pancit by the Bilao",
    blurb: "Noodles tossed and packed on a woven bilao — small for 3–4, XL for 11–15.",
    price: "₱350 – ₱850",
    image: {
      src: "/stock/dish-pancit.jpg",
      alt: "Stock photo: pancit arranged on a round woven bilao with lemon wedges.",
      isStock: true,
    },
  },
];
```

- [ ] **Step 4: Create `web/content/press.ts`**

```ts
import type { ImageSlot } from "@/content/dishes";

export interface TvFeature {
  network: string;
  show: string;
  year: string;
  confirmed: boolean;
}

export interface Vlogger {
  name: string;
  url: string;
  platform: string;
  poster: ImageSlot;
}

export interface FacebookProof {
  ratingLabel: string;
  tagHandle: string;
  confirmed: boolean;
}

export interface Press {
  tvFeature: TvFeature;
  vloggers: Vlogger[];
  facebook: FacebookProof;
}

/**
 * Social-proof content. ALL PLACEHOLDER until James supplies real values
 * (spec §10). SocialProof renders a visible "content pending" state while
 * `confirmed` is false. Per spec §9.4 decision (a), vloggers render as
 * thumbnail cards that link out — never as embeds.
 */
export const press: Press = {
  tvFeature: {
    network: "[network]",
    show: "[show name]",
    year: "[year]",
    confirmed: false,
  },
  vloggers: [],
  facebook: {
    ratingLabel: "[rating] on Facebook",
    tagHandle: "@alingnenetumbatumba",
    confirmed: false,
  },
};
```

- [ ] **Step 5: Create `web/content/story.ts`** (paragraphs and questions verbatim from the `site/index.html` story comment + copy)

```ts
export interface Story {
  confirmed: boolean;
  questionsForFamily: string[];
  paragraphs: string[];
}

/**
 * PLACEHOLDER COPY — nothing here is confirmed (spec §5.6). Keep it visibly
 * flagged until the family answers. Do not invent replacement copy.
 */
export const story: Story = {
  confirmed: false,
  questionsForFamily: [
    "Aling Nene's full name, and what people call her",
    'Where "Tumba Tumba" comes from (the rocking chair? a spot? a nickname?)',
    "The year the kitchen started, and on what — was it the crispy pata first?",
    "Who runs it now (which generation, whose recipes)",
    "One detail only the family would know (a regular's order, a fiesta, the vat)",
  ],
  paragraphs: [
    "[Placeholder — to be replaced with the family's own account.] Aling Nene started cooking for the neighbourhood out of a small kitchen on General Kalentong. The crispy pata was the dish people came back for, and word carried down the street from there.",
    "The name Tumba Tumba comes from [the rocking chair / the story you'll tell us]. Three [or however many] generations later, the same recipes are still cooked to order — the pata scored and simmered before it ever hits the oil, the pancit tossed in a pan wide enough to feed a fiesta.",
    "Today the kitchen is run by [names, roles]. Call ahead, pull up a chair, and stay a while.",
  ],
};
```

- [ ] **Step 6: Run to verify all three pass**

Run: `cd web && npx vitest run content/`
Expected: PASS — all content tests green.

- [ ] **Step 7: Commit**

```bash
git add web/content/dishes.ts web/content/press.ts web/content/story.ts web/content/dishes.test.ts web/content/press.test.ts web/content/story.test.ts
git commit -m "feat(web): add dishes, press, and story content modules"
```

---

### Task 6: `lib/openNow.ts` (pure Asia/Manila open/closed logic)

**Files:**

- Create: `web/lib/openNow.ts`, `web/lib/openNow.test.ts`

**Interfaces:**

- Consumes: `Hours` shape (`{ open: "HH:MM"; close: "HH:MM"; tz: string; days: string }`) — structurally identical to `content/restaurant.ts`'s `Hours`; `openNow.ts` declares its own local `Hours` type to stay dependency-free.
- Produces:

  ```ts
  export interface Hours {
    open: string;
    close: string;
    tz: string;
    days: string;
  }
  export interface OpenNowResult {
    open: boolean;
    label: string;
  }
  export function openNow(hours: Hours, now: Date): OpenNowResult;
  ```

  Pure and deterministic — `now` is always passed in. `OpenNowBadge` (Task 12) calls `openNow(restaurant.hours, new Date())`.

- [ ] **Step 1: Write the failing test — `web/lib/openNow.test.ts`**

```ts
import { describe, expect, it } from "vitest";
import { openNow, type Hours } from "@/lib/openNow";

const HOURS: Hours = { open: "09:00", close: "22:00", tz: "Asia/Manila", days: "daily" };

describe("openNow", () => {
  it("is open at 13:00 Manila and names the closing time", () => {
    // 2026-09-01 05:00 UTC = 13:00 Asia/Manila (UTC+8, no DST)
    const r = openNow(HOURS, new Date("2026-09-01T05:00:00Z"));
    expect(r.open).toBe(true);
    expect(r.label).toBe("Open now · closes 10 PM");
  });

  it("is closed at 23:00 Manila and names the next opening time", () => {
    const r = openNow(HOURS, new Date("2026-09-01T15:00:00Z")); // 23:00 Manila
    expect(r.open).toBe(false);
    expect(r.label).toBe("Closed · opens 9 AM");
  });

  it("is open exactly at the 09:00 boundary", () => {
    const r = openNow(HOURS, new Date("2026-09-01T01:00:00Z")); // 09:00 Manila
    expect(r.open).toBe(true);
  });

  it("is closed exactly at the 22:00 boundary", () => {
    const r = openNow(HOURS, new Date("2026-09-01T14:00:00Z")); // 22:00 Manila
    expect(r.open).toBe(false);
  });

  it("uses Manila time, not the Date's UTC hours", () => {
    // 20:00 UTC would be "open" in UTC but is 04:00 next day in Manila → closed
    const r = openNow(HOURS, new Date("2026-09-01T20:00:00Z"));
    expect(r.open).toBe(false);
  });
});
```

- [ ] **Step 2: Run to verify it fails**

Run: `cd web && npx vitest run lib/openNow.test.ts`
Expected: FAIL — cannot resolve `@/lib/openNow`.

- [ ] **Step 3: Create `web/lib/openNow.ts`**

```ts
export interface Hours {
  open: string; // "HH:MM", 24-hour
  close: string; // "HH:MM", 24-hour
  tz: string; // IANA timezone, e.g. "Asia/Manila"
  days: string;
}

export interface OpenNowResult {
  open: boolean;
  label: string;
}

function minutesInZone(now: Date, tz: string): number {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: tz,
    hour12: false,
    hour: "2-digit",
    minute: "2-digit",
  }).formatToParts(now);
  const hour = Number(parts.find((p) => p.type === "hour")?.value ?? "0") % 24;
  const minute = Number(parts.find((p) => p.type === "minute")?.value ?? "0");
  return hour * 60 + minute;
}

function toMinutes(hhmm: string): number {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
}

function formatClock(totalMinutes: number): string {
  const h = Math.floor(totalMinutes / 60);
  const m = totalMinutes % 60;
  const ampm = h < 12 ? "AM" : "PM";
  const h12 = ((h + 11) % 12) + 1;
  return m === 0 ? `${h12} ${ampm}` : `${h12}:${String(m).padStart(2, "0")} ${ampm}`;
}

/**
 * Given the restaurant's hours and a moment in time, decide whether it is
 * currently open — evaluated in the restaurant's timezone, not the visitor's.
 * Pure: `now` is always supplied by the caller. Assumes open/close fall within
 * the same calendar day (true for the confirmed 09:00–22:00).
 */
export function openNow(hours: Hours, now: Date): OpenNowResult {
  const current = minutesInZone(now, hours.tz);
  const openAt = toMinutes(hours.open);
  const closeAt = toMinutes(hours.close);
  const isOpen = current >= openAt && current < closeAt;
  return isOpen
    ? { open: true, label: `Open now · closes ${formatClock(closeAt)}` }
    : { open: false, label: `Closed · opens ${formatClock(openAt)}` };
}
```

- [ ] **Step 4: Run to verify it passes**

Run: `cd web && npx vitest run lib/openNow.test.ts`
Expected: PASS — 5 passed.

- [ ] **Step 5: Commit**

```bash
git add web/lib/openNow.ts web/lib/openNow.test.ts
git commit -m "feat(web): add Asia/Manila open-now logic"
```

---

### Task 7: CI job for `web/**` + stock-photo guard

**Files:**

- Create: `web/scripts/check-no-stock.mjs`
- Modify: `.github/workflows/ci.yml`

**Interfaces:**

- Consumes: `web/out/**` (the static export from `next build`).
- Produces: `node scripts/check-no-stock.mjs` — prints every built file that still references `/stock/`; exits 0 by default, exits 1 with `--strict` (used pre-launch, spec §12).

- [ ] **Step 1: Create `web/scripts/check-no-stock.mjs`**

```js
// Fails (with --strict) if the static export still references /stock/ assets.
// Run non-strict in CI as a visible reminder; run --strict in the pre-launch gate.
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

const OUT_DIR = new URL("../out/", import.meta.url).pathname;
const strict = process.argv.includes("--strict");

function walk(dir) {
  const files = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) files.push(...walk(full));
    else files.push(full);
  }
  return files;
}

let hits = [];
try {
  hits = walk(OUT_DIR)
    .filter((f) => /\.(html|js|css|txt|xml)$/.test(f))
    .filter((f) => readFileSync(f, "utf8").includes("/stock/"));
} catch (err) {
  console.error(`check-no-stock: could not read ${OUT_DIR} — run \`next build\` first.`);
  process.exit(strict ? 1 : 0);
}

if (hits.length === 0) {
  console.log("check-no-stock: no /stock/ references in build output. ✅");
  process.exit(0);
}

console.warn("check-no-stock: build output still references stock assets:");
for (const f of hits) console.warn(`  - ${f.replace(OUT_DIR, "out/")}`);
console.warn(
  strict
    ? "check-no-stock: --strict → failing. Swap in real photos before launch."
    : "check-no-stock: reminder only (non-strict). These must not ship.",
);
process.exit(strict ? 1 : 0);
```

- [ ] **Step 2: Add the `web` job to `.github/workflows/ci.yml`**

Add this job alongside the existing `lint` and `links` jobs (keep those unchanged — they still guard `site/` until cutover):

```yaml
web:
  name: web — typecheck + lint + test + build
  runs-on: ubuntu-latest
  defaults:
    run:
      working-directory: web
  steps:
    - uses: actions/checkout@v4

    - uses: actions/setup-node@v4
      with:
        node-version: 20
        cache: npm
        cache-dependency-path: web/package-lock.json

    - run: npm ci

    - name: Typecheck
      run: npx tsc --noEmit

    - name: Lint
      run: npx next lint

    - name: Unit tests
      run: npx vitest run

    - name: Build (static export)
      run: npx next build

    - name: Stock-photo reminder
      run: node scripts/check-no-stock.mjs
```

Note: the repo-root `lint` job's `npx prettier --check .` already covers `web/` because Prettier reads the repo-root `.prettierignore` (updated in Task 1 to skip `web/.next/` and `web/out/`). No change needed to that job.

- [ ] **Step 3: Verify the guard script locally**

Run:

```bash
cd web && npm run build && node scripts/check-no-stock.mjs
```

Expected: build succeeds; script prints either "no /stock/ references" (current placeholder page has none) or a reminder list — either way exits 0.

- [ ] **Step 4: Verify the workflow file parses**

Run: `node -e "require('js-yaml')" 2>/dev/null || npx --yes js-yaml .github/workflows/ci.yml >/dev/null && echo "yaml ok"`
Expected: `yaml ok` (or, if `js-yaml` unavailable offline, visually confirm indentation matches the existing jobs).

- [ ] **Step 5: Commit**

```bash
git add web/scripts/check-no-stock.mjs .github/workflows/ci.yml
git commit -m "ci: add web typecheck/lint/test/build job and stock-photo guard"
```

---

## Phase 2 — Theme system & shared primitives

### Task 8: `theme/tokens.ts` + `theme/carinderia.ts` + `theme/heritage.ts`

**Files:**

- Create: `web/theme/tokens.ts`, `web/theme/carinderia.ts`, `web/theme/heritage.ts`, `web/theme/theme.test.ts`

**Interfaces:**

- Produces:

  ```ts
  export type ThemeName = "carinderia" | "heritage";
  export interface ThemeLayout {
    sectionPaddingY: string; // Tailwind arbitrary value, e.g. "py-20"
    heroAlign: "center" | "start";
    menuTreatment: "board" | "editorial";
    sectionEntryAnimation: boolean;
  }
  export interface Theme {
    name: ThemeName;
    cssVars: Record<string, string>; // keys WITHOUT the --t- prefix
    layout: ThemeLayout;
    motion: "full" | "minimal";
  }
  export const carinderia: Theme;
  export const heritage: Theme;
  ```

  `ThemeProvider` (Task 10) emits each `cssVars` key as `--t-<key>`. `globals.css` `@theme inline` (Task 1) already maps `--t-canvas → --color-canvas`, etc. `cssVars` MUST define every key the `@theme inline` block references: `canvas`, `surface-1`, `surface-2`, `ink`, `ink-invert`, `accent`, `accent-strong`, `gold`, `sage`, `font-display`, `font-body`, `radius`, plus `motion-fast`, `motion-slide` (used via arbitrary values in components).

- [ ] **Step 1: Write the failing test — `web/theme/theme.test.ts`**

```ts
import { describe, expect, it } from "vitest";
import { carinderia } from "@/theme/carinderia";
import { heritage } from "@/theme/heritage";
import type { Theme } from "@/theme/tokens";

const REQUIRED_VARS = [
  "canvas",
  "surface-1",
  "surface-2",
  "ink",
  "ink-invert",
  "accent",
  "accent-strong",
  "gold",
  "sage",
  "font-display",
  "font-body",
  "radius",
  "motion-fast",
  "motion-slide",
];

function check(theme: Theme) {
  for (const key of REQUIRED_VARS) {
    expect(theme.cssVars[key], `${theme.name} missing --t-${key}`).toBeTruthy();
  }
}

describe("theme tokens", () => {
  it("carinderia defines every required CSS var and identifies itself", () => {
    expect(carinderia.name).toBe("carinderia");
    check(carinderia);
  });

  it("heritage defines every required CSS var and identifies itself", () => {
    expect(heritage.name).toBe("heritage");
    check(heritage);
  });

  it("both derive their accent from the existing menu brick token", () => {
    expect(carinderia.cssVars.accent).toBe("#a5211a");
    expect(heritage.cssVars.accent).toBe("#a5211a");
  });

  it("carinderia runs full motion, heritage minimal", () => {
    expect(carinderia.motion).toBe("full");
    expect(heritage.motion).toBe("minimal");
  });

  it("carinderia uses the board menu treatment, heritage editorial", () => {
    expect(carinderia.layout.menuTreatment).toBe("board");
    expect(heritage.layout.menuTreatment).toBe("editorial");
  });
});
```

- [ ] **Step 2: Run to verify it fails**

Run: `cd web && npx vitest run theme/theme.test.ts`
Expected: FAIL — cannot resolve `@/theme/carinderia`.

- [ ] **Step 3: Create `web/theme/tokens.ts`**

```ts
export type ThemeName = "carinderia" | "heritage";

export interface ThemeLayout {
  /** Tailwind class for vertical section rhythm, e.g. "py-20". */
  sectionPaddingY: string;
  heroAlign: "center" | "start";
  menuTreatment: "board" | "editorial";
  /** Short fade/rise on section entry (respect prefers-reduced-motion). */
  sectionEntryAnimation: boolean;
}

export interface Theme {
  name: ThemeName;
  /** Keys WITHOUT the `--t-` prefix; ThemeProvider adds it. */
  cssVars: Record<string, string>;
  layout: ThemeLayout;
  motion: "full" | "minimal";
}
```

- [ ] **Step 4: Create `web/theme/carinderia.ts`** (spec §6 "Carinderia heat")

```ts
import type { Theme } from "@/theme/tokens";

/**
 * "Carinderia heat" (route "/"): warm, loud, appetite-first — a busy Manila
 * eatery at night. Palette is the existing menu/logo tokens inverted onto a
 * warm-charcoal ground.
 */
export const carinderia: Theme = {
  name: "carinderia",
  cssVars: {
    canvas: "#1a1512", // warm charcoal
    "surface-1": "#f6e7db", // existing --paper (blush)
    "surface-2": "#fbf3e3", // existing --paper-2 (cream)
    ink: "#241c15", // existing --ink (on light surfaces)
    "ink-invert": "#fbf3e3", // text on the charcoal canvas
    accent: "#a5211a", // existing --brick
    "accent-strong": "#d7382a", // brighter chili red for hovers
    gold: "#e0983f", // existing --gold
    sage: "#93ab72", // existing --sage
    "font-display": "var(--font-bricolage), ui-sans-serif, system-ui, sans-serif",
    "font-body": "var(--font-inter), ui-sans-serif, system-ui, sans-serif",
    radius: "0.5rem",
    "motion-fast": "150ms",
    "motion-slide": "320ms",
  },
  layout: {
    sectionPaddingY: "py-20",
    heroAlign: "center",
    menuTreatment: "board",
    sectionEntryAnimation: false,
  },
  motion: "full",
};
```

- [ ] **Step 5: Create `web/theme/heritage.ts`** (spec §6 "Heritage kitchen")

```ts
import type { Theme } from "@/theme/tokens";

/**
 * "Heritage kitchen" (route "/heritage"): editorial, premium, trust-led — a
 * decades-old institution. Bone/ivory canvas, refined existing tokens, more
 * whitespace, minimal motion.
 */
export const heritage: Theme = {
  name: "heritage",
  cssVars: {
    canvas: "#f7f0e6", // bone/ivory
    "surface-1": "#f7f0e6",
    "surface-2": "#fdf9f1", // slightly lifted panel
    ink: "#241c15", // existing --ink
    "ink-invert": "#f7f0e6", // text on the rare dark block
    accent: "#a5211a", // existing --brick
    "accent-strong": "#7c1611", // existing --brick-deep
    gold: "#e0983f",
    sage: "#93ab72", // hairline accents
    "font-display": "var(--font-fraunces), Georgia, 'Times New Roman', serif",
    "font-body": "var(--font-newsreader), Georgia, 'Times New Roman', serif",
    radius: "0.125rem",
    "motion-fast": "200ms",
    "motion-slide": "0ms",
  },
  layout: {
    sectionPaddingY: "py-28",
    heroAlign: "start",
    menuTreatment: "editorial",
    sectionEntryAnimation: true,
  },
  motion: "minimal",
};
```

- [ ] **Step 6: Run to verify it passes**

Run: `cd web && npx vitest run theme/theme.test.ts`
Expected: PASS.

- [ ] **Step 7: Commit**

```bash
git add web/theme/tokens.ts web/theme/carinderia.ts web/theme/heritage.ts web/theme/theme.test.ts
git commit -m "feat(web): add theme token objects for both directions"
```

---

### Task 9: Self-hosted fonts wired into `app/layout.tsx`

**Files:**

- Modify: `web/app/layout.tsx`
- Create: `web/lib/siteUrl.ts`

**Interfaces:**

- Consumes: `next/font/google` exports `Bricolage_Grotesque`, `Inter`, `Fraunces`, `Newsreader`.
- Produces: `<html>` carries the four font CSS-variable classes (`--font-bricolage`, `--font-inter`, `--font-fraunces`, `--font-newsreader`), which the `--t-font-*` values in the theme objects reference. `web/lib/siteUrl.ts` exports `siteUrl: string` (used by metadata, robots, sitemap in Phase 5).

- [ ] **Step 1: Create `web/lib/siteUrl.ts`**

```ts
/**
 * Absolute origin for canonical URLs, OG tags, robots and sitemap.
 * Overridable per-environment (staging Vercel project sets NEXT_PUBLIC_SITE_URL).
 * Falls back to the intended production domain (still unregistered — spec §3).
 */
export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://alingnene.com").replace(
  /\/$/,
  "",
);
```

- [ ] **Step 2: Replace `web/app/layout.tsx`**

```tsx
import "./globals.css";
import type { ReactNode } from "react";
import { Bricolage_Grotesque, Inter, Fraunces, Newsreader } from "next/font/google";

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
  variable: "--font-bricolage",
  display: "swap",
});
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});
const fraunces = Fraunces({
  subsets: ["latin"],
  axes: ["opsz", "SOFT"],
  variable: "--font-fraunces",
  display: "swap",
});
const newsreader = Newsreader({
  subsets: ["latin"],
  style: ["normal", "italic"],
  variable: "--font-newsreader",
  display: "swap",
});

const fontVars = [bricolage, inter, fraunces, newsreader].map((f) => f.variable).join(" ");

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={fontVars}>
      <body>{children}</body>
    </html>
  );
}
```

- [ ] **Step 3: Verify the build self-hosts the fonts**

Run:

```bash
cd web && npm run build
```

Expected: build succeeds. Confirm `web/out/_next/static/media/` contains `.woff2` files (fonts inlined at build time — no `fonts.googleapis.com` in output).

- [ ] **Step 4: Verify no Google Fonts reference leaked into the HTML**

Run: `grep -r "fonts.googleapis.com\|fonts.gstatic.com" web/out || echo "no google fonts refs — good"`
Expected: `no google fonts refs — good`.

- [ ] **Step 5: Commit**

```bash
git add web/app/layout.tsx web/lib/siteUrl.ts
git commit -m "feat(web): self-host Bricolage, Inter, Fraunces, Newsreader via next/font"
```

---

### Task 10: `components/ThemeProvider.tsx`

**Files:**

- Create: `web/components/ThemeProvider.tsx`, `web/components/ThemeProvider.test.tsx`

**Interfaces:**

- Consumes: `Theme` from `@/theme/tokens`.
- Produces:

  ```ts
  export function ThemeProvider(props: { theme: Theme; children: React.ReactNode }): JSX.Element;
  export function useTheme(): Theme; // throws if called outside a ThemeProvider
  ```

  Renders a wrapper `<div data-theme={theme.name} className="theme-root">` with inline style setting `--t-<key>` for every `theme.cssVars` entry. Every section component calls `useTheme()` to read `layout` / `motion` / `name`.

- [ ] **Step 1: Write the failing test — `web/components/ThemeProvider.test.tsx`**

```tsx
import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { ThemeProvider, useTheme } from "@/components/ThemeProvider";
import { carinderia } from "@/theme/carinderia";

function Probe() {
  const theme = useTheme();
  return <span>theme:{theme.name}</span>;
}

describe("ThemeProvider", () => {
  it("exposes the theme via useTheme()", () => {
    render(
      <ThemeProvider theme={carinderia}>
        <Probe />
      </ThemeProvider>,
    );
    expect(screen.getByText("theme:carinderia")).toBeInTheDocument();
  });

  it("sets every cssVar as a --t-* custom property on the wrapper", () => {
    const { container } = render(
      <ThemeProvider theme={carinderia}>
        <p>hi</p>
      </ThemeProvider>,
    );
    const root = container.querySelector(".theme-root") as HTMLElement;
    expect(root.getAttribute("data-theme")).toBe("carinderia");
    expect(root.style.getPropertyValue("--t-canvas")).toBe("#1a1512");
    expect(root.style.getPropertyValue("--t-accent")).toBe("#a5211a");
  });

  it("throws when useTheme is used with no provider", () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    expect(() => render(<Probe />)).toThrow(/useTheme must be used within/);
    spy.mockRestore();
  });
});
```

- [ ] **Step 2: Run to verify it fails**

Run: `cd web && npx vitest run components/ThemeProvider.test.tsx`
Expected: FAIL — cannot resolve `@/components/ThemeProvider`.

- [ ] **Step 3: Create `web/components/ThemeProvider.tsx`**

```tsx
"use client";

import { createContext, useContext, useMemo, type CSSProperties, type ReactNode } from "react";
import type { Theme } from "@/theme/tokens";

const ThemeContext = createContext<Theme | null>(null);

export function useTheme(): Theme {
  const theme = useContext(ThemeContext);
  if (!theme) {
    throw new Error("useTheme must be used within a <ThemeProvider>");
  }
  return theme;
}

export function ThemeProvider({ theme, children }: { theme: Theme; children: ReactNode }) {
  const style = useMemo(() => {
    const vars: Record<string, string> = {};
    for (const [key, value] of Object.entries(theme.cssVars)) {
      vars[`--t-${key}`] = value;
    }
    return vars as CSSProperties;
  }, [theme]);

  return (
    <ThemeContext.Provider value={theme}>
      <div
        data-theme={theme.name}
        className="theme-root bg-canvas text-ink font-body"
        style={style}
      >
        {children}
      </div>
    </ThemeContext.Provider>
  );
}
```

- [ ] **Step 4: Run to verify it passes**

Run: `cd web && npx vitest run components/ThemeProvider.test.tsx`
Expected: PASS — 3 passed.

- [ ] **Step 5: Commit**

```bash
git add web/components/ThemeProvider.tsx web/components/ThemeProvider.test.tsx
git commit -m "feat(web): add ThemeProvider that applies token vars and exposes useTheme"
```

---

### Task 11: `components/CtaButton.tsx`

**Files:**

- Create: `web/components/CtaButton.tsx`, `web/components/CtaButton.test.tsx`

**Interfaces:**

- Produces:

  ```ts
  export type CtaVariant = "solid" | "ghost";
  export interface CtaButtonProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
    variant?: CtaVariant; // default "solid"
    href: string; // tel: / m.me / #anchor
  }
  export function CtaButton(props: CtaButtonProps): JSX.Element;
  ```

  Renders an `<a>`. Used by `SiteHeader`, `StickyOrderBar`, `Hero`, `DishCard`, `SocialProof`, `VisitOrder`.

- [ ] **Step 1: Write the failing test — `web/components/CtaButton.test.tsx`**

```tsx
import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { CtaButton } from "@/components/CtaButton";

describe("CtaButton", () => {
  it("renders an anchor with the given href and label", () => {
    render(<CtaButton href="tel:+63285708560">Call to order</CtaButton>);
    const link = screen.getByRole("link", { name: "Call to order" });
    expect(link).toHaveAttribute("href", "tel:+63285708560");
  });

  it("defaults to the solid variant", () => {
    render(<CtaButton href="#menu">See the menu</CtaButton>);
    expect(screen.getByRole("link", { name: "See the menu" }).className).toContain("bg-accent");
  });

  it("renders a ghost variant without a solid fill", () => {
    render(
      <CtaButton href="#menu" variant="ghost">
        See the menu
      </CtaButton>,
    );
    const cls = screen.getByRole("link", { name: "See the menu" }).className;
    expect(cls).not.toContain("bg-accent ");
    expect(cls).toContain("border");
  });

  it("forwards arbitrary anchor attributes", () => {
    render(
      <CtaButton href="https://m.me/x" rel="noopener" data-testid="msg">
        Message
      </CtaButton>,
    );
    expect(screen.getByTestId("msg")).toHaveAttribute("rel", "noopener");
  });
});
```

- [ ] **Step 2: Run to verify it fails**

Run: `cd web && npx vitest run components/CtaButton.test.tsx`
Expected: FAIL — cannot resolve `@/components/CtaButton`.

- [ ] **Step 3: Create `web/components/CtaButton.tsx`**

```tsx
import type { AnchorHTMLAttributes } from "react";

export type CtaVariant = "solid" | "ghost";

export interface CtaButtonProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  variant?: CtaVariant;
  href: string;
}

const BASE =
  "inline-flex items-center justify-center rounded-theme px-5 py-3 text-base font-semibold " +
  "transition-transform duration-[var(--t-motion-fast)] motion-safe:active:scale-[0.97] " +
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent";

const VARIANTS: Record<CtaVariant, string> = {
  solid: "bg-accent text-ink-invert hover:bg-accent-strong",
  ghost: "border border-current text-accent hover:bg-accent/10",
};

export function CtaButton({
  variant = "solid",
  href,
  className = "",
  children,
  ...rest
}: CtaButtonProps) {
  return (
    <a href={href} className={`${BASE} ${VARIANTS[variant]} ${className}`} {...rest}>
      {children}
    </a>
  );
}
```

- [ ] **Step 4: Run to verify it passes**

Run: `cd web && npx vitest run components/CtaButton.test.tsx`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add web/components/CtaButton.tsx web/components/CtaButton.test.tsx
git commit -m "feat(web): add shared CtaButton primitive"
```

---

### Task 12: `components/OpenNowBadge.tsx`

**Files:**

- Create: `web/components/OpenNowBadge.tsx`, `web/components/OpenNowBadge.test.tsx`

**Interfaces:**

- Consumes: `openNow` + `Hours` from `@/lib/openNow`.
- Produces:

  ```ts
  export function OpenNowBadge(props: { hours: Hours; className?: string }): JSX.Element;
  ```

  Client component. Computes state on mount from `new Date()`, re-computes every 60 s. Renders a status dot + `openNow().label`; the dot pulses (motion-safe) only when open. Sets `data-open` for styling/tests. Used by `Hero`.

- [ ] **Step 1: Write the failing test — `web/components/OpenNowBadge.test.tsx`**

```tsx
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { OpenNowBadge } from "@/components/OpenNowBadge";
import type { Hours } from "@/lib/openNow";

const HOURS: Hours = { open: "09:00", close: "22:00", tz: "Asia/Manila", days: "daily" };

describe("OpenNowBadge", () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it("shows the open label when open in Manila", () => {
    vi.setSystemTime(new Date("2026-09-01T05:00:00Z")); // 13:00 Manila
    render(<OpenNowBadge hours={HOURS} />);
    expect(screen.getByText(/Open now · closes 10 PM/)).toBeInTheDocument();
    expect(screen.getByText(/Open now/).closest("[data-open]")).toHaveAttribute(
      "data-open",
      "true",
    );
  });

  it("shows the closed label when closed in Manila", () => {
    vi.setSystemTime(new Date("2026-09-01T15:00:00Z")); // 23:00 Manila
    render(<OpenNowBadge hours={HOURS} />);
    expect(screen.getByText(/Closed · opens 9 AM/)).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run to verify it fails**

Run: `cd web && npx vitest run components/OpenNowBadge.test.tsx`
Expected: FAIL — cannot resolve `@/components/OpenNowBadge`.

- [ ] **Step 3: Create `web/components/OpenNowBadge.tsx`**

```tsx
"use client";

import { useEffect, useState } from "react";
import { openNow, type Hours, type OpenNowResult } from "@/lib/openNow";

export function OpenNowBadge({ hours, className = "" }: { hours: Hours; className?: string }) {
  const [state, setState] = useState<OpenNowResult>(() => openNow(hours, new Date()));

  useEffect(() => {
    const tick = () => setState(openNow(hours, new Date()));
    tick();
    const id = setInterval(tick, 60_000);
    return () => clearInterval(id);
  }, [hours]);

  return (
    <span
      data-open={state.open}
      className={
        "inline-flex items-center gap-2 rounded-full border border-current px-3 py-1 " +
        "text-sm font-medium " +
        className
      }
    >
      <span
        aria-hidden="true"
        className={
          "h-2 w-2 rounded-full " + (state.open ? "bg-sage motion-safe:animate-pulse" : "bg-ink/40")
        }
      />
      {state.label}
    </span>
  );
}
```

- [ ] **Step 4: Run to verify it passes**

Run: `cd web && npx vitest run components/OpenNowBadge.test.tsx`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add web/components/OpenNowBadge.tsx web/components/OpenNowBadge.test.tsx
git commit -m "feat(web): add OpenNowBadge client component"
```

---

### Task 13: `components/SiteHeader.tsx`

**Files:**

- Create: `web/components/SiteHeader.tsx`, `web/components/SiteHeader.test.tsx`

**Interfaces:**

- Consumes: `restaurant` from `@/content/restaurant`; `useTheme` from `@/components/ThemeProvider`; `CtaButton`.
- Produces:

  ```ts
  export function SiteHeader(): JSX.Element;
  ```

  Client component. Sticky header: logo (`/logo.jpg`) + wordmark, primary nav (Menu `#menu`, Story `#story`, Visit `#visit`), a "Call to order" `CtaButton` (`restaurant.phone.landlineHref`), and a mobile nav toggle button. Toggle owns `open` state, sets `aria-expanded`, `aria-controls="site-nav"`; closes on link click and on `Escape` (port of `site/js/main.js` behavior).

- [ ] **Step 1: Write the failing test — `web/components/SiteHeader.test.tsx`**

```tsx
import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SiteHeader } from "@/components/SiteHeader";
import { ThemeProvider } from "@/components/ThemeProvider";
import { carinderia } from "@/theme/carinderia";

function mount() {
  return render(
    <ThemeProvider theme={carinderia}>
      <SiteHeader />
    </ThemeProvider>,
  );
}

describe("SiteHeader", () => {
  it("renders the three primary nav links", () => {
    mount();
    expect(screen.getByRole("link", { name: /menu/i })).toHaveAttribute("href", "#menu");
    expect(screen.getByRole("link", { name: /story/i })).toHaveAttribute("href", "#story");
    expect(screen.getByRole("link", { name: /visit/i })).toHaveAttribute("href", "#visit");
  });

  it("renders a call-to-order CTA to the landline", () => {
    mount();
    expect(screen.getByRole("link", { name: /call to order/i })).toHaveAttribute(
      "href",
      "tel:+63285708560",
    );
  });

  it("toggles the mobile nav's aria-expanded", async () => {
    const user = userEvent.setup();
    mount();
    const toggle = screen.getByRole("button", { name: /menu/i });
    expect(toggle).toHaveAttribute("aria-expanded", "false");
    await user.click(toggle);
    expect(toggle).toHaveAttribute("aria-expanded", "true");
    await user.keyboard("{Escape}");
    expect(toggle).toHaveAttribute("aria-expanded", "false");
  });
});
```

- [ ] **Step 2: Run to verify it fails**

Run: `cd web && npx vitest run components/SiteHeader.test.tsx`
Expected: FAIL — cannot resolve `@/components/SiteHeader`.

- [ ] **Step 3: Create `web/components/SiteHeader.tsx`**

```tsx
"use client";

import { useEffect, useState } from "react";
import { restaurant } from "@/content/restaurant";
import { CtaButton } from "@/components/CtaButton";

const NAV = [
  { href: "#menu", label: "Menu" },
  { href: "#story", label: "Story" },
  { href: "#visit", label: "Visit" },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header className="sticky top-0 z-40 border-b border-ink/10 bg-canvas/90 backdrop-blur">
      <div className="mx-auto flex w-[min(100%-2.5rem,70rem)] items-center justify-between gap-4 py-3">
        <a href="#top" className="flex items-center gap-3" aria-label={`${restaurant.name} — home`}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.jpg" alt="" width={44} height={44} className="rounded-full" />
          <span className="font-display text-lg font-bold leading-none text-ink-invert">
            {restaurant.shortName}
          </span>
        </a>

        <nav aria-label="Primary" className="flex items-center gap-4">
          <button
            type="button"
            className="rounded-theme border border-current px-3 py-2 text-sm text-ink-invert md:hidden"
            aria-expanded={open}
            aria-controls="site-nav"
            onClick={() => setOpen((v) => !v)}
          >
            Menu
          </button>

          <ul
            id="site-nav"
            className={
              "absolute inset-x-0 top-full flex-col gap-1 border-b border-ink/10 bg-canvas p-4 " +
              "md:static md:flex md:flex-row md:items-center md:gap-5 md:border-0 md:bg-transparent md:p-0 " +
              (open ? "flex" : "hidden md:flex")
            }
            onClick={(e) => {
              if ((e.target as HTMLElement).closest("a")) setOpen(false);
            }}
          >
            {NAV.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  className="block py-2 text-ink-invert hover:text-accent-strong md:py-0"
                >
                  {item.label}
                </a>
              </li>
            ))}
            <li>
              <CtaButton href={restaurant.phone.landlineHref} className="w-full md:w-auto">
                Call to order
              </CtaButton>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
```

- [ ] **Step 4: Run to verify it passes**

Run: `cd web && npx vitest run components/SiteHeader.test.tsx`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add web/components/SiteHeader.tsx web/components/SiteHeader.test.tsx
git commit -m "feat(web): add SiteHeader with accessible mobile nav toggle"
```

---

### Task 14: `components/StickyOrderBar.tsx`

**Files:**

- Create: `web/components/StickyOrderBar.tsx`, `web/components/StickyOrderBar.test.tsx`

**Interfaces:**

- Consumes: `restaurant` from `@/content/restaurant`.
- Produces:

  ```ts
  export function StickyOrderBar(): JSX.Element;
  ```

  Client component, `position: fixed` bottom bar with two actions: "Call to order — {landlineDisplay}" (`landlineHref`) and "Message on Facebook" (`socials.messenger`, `rel="noopener"`). On viewports `< md` it is always visible. On `>= md` it starts hidden (`translate-y-full`) and slides in once an element with `id="hero-end"` (rendered by `Hero`) has scrolled out of view, tracked via `IntersectionObserver`. Respects `prefers-reduced-motion` (no transition when reduced).

- [ ] **Step 1: Write the failing test — `web/components/StickyOrderBar.test.tsx`**

```tsx
import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { StickyOrderBar } from "@/components/StickyOrderBar";

// jsdom lacks IntersectionObserver; stub it so the component mounts.
beforeAll(() => {
  vi.stubGlobal(
    "IntersectionObserver",
    class {
      observe() {}
      disconnect() {}
      unobserve() {}
    },
  );
});

describe("StickyOrderBar", () => {
  it("renders a call action to the landline", () => {
    render(<StickyOrderBar />);
    expect(screen.getByRole("link", { name: /call to order/i })).toHaveAttribute(
      "href",
      "tel:+63285708560",
    );
  });

  it("renders a Messenger action with rel=noopener", () => {
    render(<StickyOrderBar />);
    const msg = screen.getByRole("link", { name: /message on facebook/i });
    expect(msg).toHaveAttribute("href", "https://m.me/alingnenetumbatumba");
    expect(msg).toHaveAttribute("rel", expect.stringContaining("noopener"));
  });
});
```

- [ ] **Step 2: Run to verify it fails**

Run: `cd web && npx vitest run components/StickyOrderBar.test.tsx`
Expected: FAIL — cannot resolve `@/components/StickyOrderBar`.

- [ ] **Step 3: Create `web/components/StickyOrderBar.tsx`**

```tsx
"use client";

import { useEffect, useState } from "react";
import { restaurant } from "@/content/restaurant";

export function StickyOrderBar() {
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const sentinel = document.getElementById("hero-end");
    if (!sentinel || typeof IntersectionObserver === "undefined") {
      setRevealed(true);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => setRevealed(!entry.isIntersecting && entry.boundingClientRect.top < 0),
      { threshold: 0 },
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      className={
        "fixed inset-x-0 bottom-0 z-50 flex gap-2 border-t border-ink/10 bg-canvas/95 p-3 " +
        "backdrop-blur motion-safe:transition-transform motion-safe:duration-[var(--t-motion-slide)] " +
        "translate-y-0 md:" +
        (revealed ? "translate-y-0" : "translate-y-full")
      }
    >
      <a
        href={restaurant.phone.landlineHref}
        className="flex-1 rounded-theme bg-accent px-4 py-3 text-center font-semibold text-ink-invert hover:bg-accent-strong"
      >
        Call to order — {restaurant.phone.landlineDisplay}
      </a>
      <a
        href={restaurant.socials.messenger}
        rel="noopener"
        className="rounded-theme border border-current px-4 py-3 text-center font-semibold text-ink-invert hover:text-accent-strong"
      >
        Message on Facebook
      </a>
    </div>
  );
}
```

Note for the implementer: Tailwind cannot compose a dynamic `md:` prefix by string concatenation (`"md:" + cond`). Replace the `className` expression with a static conditional instead:

```tsx
className={[
  "fixed inset-x-0 bottom-0 z-50 flex gap-2 border-t border-ink/10 bg-canvas/95 p-3",
  "backdrop-blur translate-y-0",
  "motion-safe:transition-transform motion-safe:duration-[var(--t-motion-slide)]",
  revealed ? "md:translate-y-0" : "md:translate-y-full",
].join(" ")}
```

- [ ] **Step 4: Run to verify it passes**

Run: `cd web && npx vitest run components/StickyOrderBar.test.tsx`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add web/components/StickyOrderBar.tsx web/components/StickyOrderBar.test.tsx
git commit -m "feat(web): add StickyOrderBar (always-on mobile, scroll-in desktop)"
```

---

### Task 15: `components/SiteFooter.tsx`

**Files:**

- Create: `web/components/SiteFooter.tsx`, `web/components/SiteFooter.test.tsx`

**Interfaces:**

- Consumes: `restaurant` from `@/content/restaurant`.
- Produces:

  ```ts
  export function SiteFooter(): JSX.Element;
  ```

  Renders: restaurant name, one-line address, landline link, Facebook link (`rel="noopener"`), `© {year} … Site by the family.` where `year = new Date().getFullYear()`.

- [ ] **Step 1: Write the failing test — `web/components/SiteFooter.test.tsx`**

```tsx
import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { SiteFooter } from "@/components/SiteFooter";

describe("SiteFooter", () => {
  it("shows the restaurant name and address", () => {
    render(<SiteFooter />);
    expect(screen.getByText(/Aling Nene's Tumba Tumba Crispy Pata/)).toBeInTheDocument();
    expect(screen.getByText(/823 General Kalentong Street/)).toBeInTheDocument();
  });

  it("links the landline and Facebook", () => {
    render(<SiteFooter />);
    expect(screen.getByRole("link", { name: /8570 8560/ })).toHaveAttribute(
      "href",
      "tel:+63285708560",
    );
    expect(screen.getByRole("link", { name: /facebook/i })).toHaveAttribute(
      "href",
      "https://www.facebook.com/alingnenetumbatumba",
    );
  });

  it("shows the current year and the family credit", () => {
    render(<SiteFooter />);
    const year = String(new Date().getFullYear());
    expect(screen.getByText(new RegExp(`© ${year}`))).toBeInTheDocument();
    expect(screen.getByText(/Site by the family/)).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run to verify it fails**

Run: `cd web && npx vitest run components/SiteFooter.test.tsx`
Expected: FAIL — cannot resolve `@/components/SiteFooter`.

- [ ] **Step 3: Create `web/components/SiteFooter.tsx`**

```tsx
import { restaurant } from "@/content/restaurant";

export function SiteFooter() {
  const year = new Date().getFullYear();
  const { address } = restaurant;

  return (
    <footer className="border-t border-ink/10 bg-canvas py-12 text-center text-ink-invert">
      <div className="mx-auto w-[min(100%-2.5rem,70rem)] space-y-2">
        <p className="font-display text-lg font-bold">{restaurant.name}</p>
        <p className="text-sm opacity-90">
          {address.street}, {address.locality} &nbsp;·&nbsp;
          <a href={restaurant.phone.landlineHref} className="underline">
            {restaurant.phone.landlineDisplay}
          </a>{" "}
          &nbsp;·&nbsp;
          <a href={restaurant.socials.facebook} rel="noopener" className="underline">
            Facebook
          </a>
        </p>
        <p className="text-sm opacity-70">
          © {year} {restaurant.shortName}. Site by the family.
        </p>
      </div>
    </footer>
  );
}
```

- [ ] **Step 4: Run to verify it passes**

Run: `cd web && npx vitest run components/SiteFooter.test.tsx`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add web/components/SiteFooter.tsx web/components/SiteFooter.test.tsx
git commit -m "feat(web): add SiteFooter"
```

---

## Phase 3 — Section components

Every section component in this phase:

- is a server component unless it needs browser APIs;
- reads its copy from a `content/` module (never inline business data);
- calls `useTheme()` only if it varies by `theme.layout` / `theme.motion`;
- wraps its content in `<section id="…" className={\`${theme.layout.sectionPaddingY} …\`}>` so the route layout variant (Task 23) takes effect.

### Task 16: `components/Hero.tsx`

**Files:**

- Create: `web/components/Hero.tsx`, `web/components/Hero.test.tsx`

**Interfaces:**

- Consumes: `restaurant`, `useTheme`, `CtaButton`, `OpenNowBadge`.
- Produces:

  ```ts
  export function Hero(): JSX.Element;
  ```

  Renders `<section id="top">` containing: kicker "Aling Nene's", `<h1>` "Tumba Tumba Crispy Pata", one-line subhead, `<OpenNowBadge hours={restaurant.hours} />`, primary `CtaButton` "Call to order" (`landlineHref`), secondary ghost `CtaButton` "Message on Facebook" (`socials.messenger`, `rel="noopener"`), an address + hours line, a stock hero image (`/stock/hero-pata.jpg`, visibly marked), and a zero-height `<div id="hero-end" aria-hidden="true" />` at the end (the `StickyOrderBar` sentinel). Alignment follows `theme.layout.heroAlign`.

- [ ] **Step 1: Write the failing test — `web/components/Hero.test.tsx`**

```tsx
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { Hero } from "@/components/Hero";
import { ThemeProvider } from "@/components/ThemeProvider";
import { carinderia } from "@/theme/carinderia";

function mount() {
  return render(
    <ThemeProvider theme={carinderia}>
      <Hero />
    </ThemeProvider>,
  );
}

describe("Hero", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-09-01T05:00:00Z"));
  });
  afterEach(() => vi.useRealTimers());

  it("renders the headline", () => {
    mount();
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(/Tumba Tumba/);
  });

  it("renders both CTAs with the confirmed hrefs", () => {
    mount();
    expect(screen.getByRole("link", { name: /call to order/i })).toHaveAttribute(
      "href",
      "tel:+63285708560",
    );
    expect(screen.getByRole("link", { name: /message on facebook/i })).toHaveAttribute(
      "href",
      "https://m.me/alingnenetumbatumba",
    );
  });

  it("shows the open-now badge", () => {
    mount();
    expect(screen.getByText(/Open now|Closed/)).toBeInTheDocument();
  });

  it("renders the sticky-bar sentinel and marks the stock photo", () => {
    const { container } = mount();
    expect(container.querySelector("#hero-end")).toBeTruthy();
    expect(screen.getByRole("img")).toHaveAttribute("alt", expect.stringMatching(/stock/i));
  });
});
```

- [ ] **Step 2: Run to verify it fails**

Run: `cd web && npx vitest run components/Hero.test.tsx`
Expected: FAIL — cannot resolve `@/components/Hero`.

- [ ] **Step 3: Create `web/components/Hero.tsx`**

```tsx
import Image from "next/image";
import { restaurant } from "@/content/restaurant";
import { useTheme } from "@/components/ThemeProvider";
import { CtaButton } from "@/components/CtaButton";
import { OpenNowBadge } from "@/components/OpenNowBadge";

const HERO_IMAGE = {
  src: "/stock/hero-pata.jpg",
  alt: "Stock photo (placeholder — swap for the family's own): a whole crispy pata, skin blistered and golden, on a white platter.",
};

export function Hero() {
  const theme = useTheme();
  const align = theme.layout.heroAlign === "center" ? "items-center text-center" : "items-start";

  return (
    <section id="top" className={`${theme.layout.sectionPaddingY} bg-canvas text-ink-invert`}>
      <div className={`mx-auto flex w-[min(100%-2.5rem,70rem)] flex-col gap-6 ${align}`}>
        <p className="font-display text-sm uppercase tracking-widest text-gold">
          {restaurant.shortName.replace(" Tumba Tumba", "")}
        </p>
        <h1 className="font-display text-4xl font-extrabold leading-tight sm:text-6xl">
          Tumba Tumba <span className="text-accent-strong">Crispy Pata</span>
        </h1>
        <p className="max-w-2xl text-lg opacity-90">
          A family kitchen on General Kalentong Street. We fry the pata till the skin cracks, ladle
          the sisig hot off the plate, and pack the pancit by the bilao.
        </p>

        <OpenNowBadge hours={restaurant.hours} />

        <div className="flex flex-wrap gap-3">
          <CtaButton href={restaurant.phone.landlineHref}>
            Call to order — {restaurant.phone.landlineDisplay}
          </CtaButton>
          <CtaButton href={restaurant.socials.messenger} rel="noopener" variant="ghost">
            Message on Facebook
          </CtaButton>
        </div>

        <p className="text-sm opacity-80">
          {restaurant.address.street}, {restaurant.address.locality} · Open {restaurant.hours.days},
          9 AM – 10 PM
        </p>

        <figure className="relative mt-4 w-full overflow-hidden rounded-theme">
          <Image
            src={HERO_IMAGE.src}
            alt={HERO_IMAGE.alt}
            width={1600}
            height={900}
            priority
            className="h-auto w-full object-cover"
          />
          <figcaption className="absolute left-2 top-2 rounded bg-ink/70 px-2 py-1 text-xs text-ink-invert">
            stock photo — replace before launch
          </figcaption>
        </figure>
      </div>

      <div id="hero-end" aria-hidden="true" className="h-0" />
    </section>
  );
}
```

- [ ] **Step 4: Run to verify it passes**

Run: `cd web && npx vitest run components/Hero.test.tsx`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add web/components/Hero.tsx web/components/Hero.test.tsx
git commit -m "feat(web): add Hero section"
```

---

### Task 17: `components/SignatureDishes.tsx` (+ `DishCard`)

**Files:**

- Create: `web/components/SignatureDishes.tsx`, `web/components/SignatureDishes.test.tsx`

**Interfaces:**

- Consumes: `dishes` from `@/content/dishes`; `restaurant`; `useTheme`; `CtaButton`.
- Produces:

  ```ts
  export function SignatureDishes(): JSX.Element;
  ```

  `<section id="dishes">` with a heading and a responsive grid of 4 `DishCard`s. `DishCard` (same file, not exported) renders: stock `Image`, `<h3>` name, blurb, price, and an "Order this" `CtaButton` → `restaurant.phone.landlineHref`. Card lifts on hover only when `theme.motion === "full"`.

- [ ] **Step 1: Write the failing test — `web/components/SignatureDishes.test.tsx`**

```tsx
import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { SignatureDishes } from "@/components/SignatureDishes";
import { ThemeProvider } from "@/components/ThemeProvider";
import { carinderia } from "@/theme/carinderia";
import { dishes } from "@/content/dishes";

function mount() {
  return render(
    <ThemeProvider theme={carinderia}>
      <SignatureDishes />
    </ThemeProvider>,
  );
}

describe("SignatureDishes", () => {
  it("renders a card per signature dish", () => {
    mount();
    for (const d of dishes) {
      expect(screen.getByRole("heading", { name: d.name, level: 3 })).toBeInTheDocument();
    }
  });

  it("every card has an Order this CTA to the landline", () => {
    mount();
    const ctas = screen.getAllByRole("link", { name: /order this/i });
    expect(ctas).toHaveLength(dishes.length);
    for (const cta of ctas) expect(cta).toHaveAttribute("href", "tel:+63285708560");
  });

  it("marks each dish image as stock", () => {
    mount();
    for (const img of screen.getAllByRole("img")) {
      expect(img.getAttribute("alt") ?? "").toMatch(/stock/i);
    }
  });
});
```

- [ ] **Step 2: Run to verify it fails**

Run: `cd web && npx vitest run components/SignatureDishes.test.tsx`
Expected: FAIL — cannot resolve `@/components/SignatureDishes`.

- [ ] **Step 3: Create `web/components/SignatureDishes.tsx`**

```tsx
import Image from "next/image";
import { dishes, type Dish } from "@/content/dishes";
import { restaurant } from "@/content/restaurant";
import { useTheme } from "@/components/ThemeProvider";
import { CtaButton } from "@/components/CtaButton";

function DishCard({ dish, lift }: { dish: Dish; lift: boolean }) {
  return (
    <article
      className={
        "flex flex-col overflow-hidden rounded-theme border border-ink/10 bg-surface-2 text-ink " +
        (lift ? "transition-transform duration-[var(--t-motion-fast)] hover:-translate-y-1" : "")
      }
    >
      <Image
        src={dish.image.src}
        alt={dish.image.alt}
        width={640}
        height={480}
        className="h-44 w-full object-cover"
      />
      <div className="flex flex-1 flex-col gap-2 p-4">
        <h3 className="font-display text-xl font-bold">{dish.name}</h3>
        <p className="flex-1 text-sm text-ink/80">{dish.blurb}</p>
        <p className="font-semibold text-accent">{dish.price}</p>
        <CtaButton href={restaurant.phone.landlineHref} className="mt-2 w-full text-sm">
          Order this
        </CtaButton>
      </div>
    </article>
  );
}

export function SignatureDishes() {
  const theme = useTheme();
  return (
    <section id="dishes" className={`${theme.layout.sectionPaddingY} bg-surface-1 text-ink`}>
      <div className="mx-auto w-[min(100%-2.5rem,70rem)]">
        <h2 className="mb-8 font-display text-3xl font-bold">What people come back for</h2>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {dishes.map((dish) => (
            <DishCard key={dish.id} dish={dish} lift={theme.motion === "full"} />
          ))}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 4: Run to verify it passes**

Run: `cd web && npx vitest run components/SignatureDishes.test.tsx`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add web/components/SignatureDishes.tsx web/components/SignatureDishes.test.tsx
git commit -m "feat(web): add SignatureDishes strip"
```

---

### Task 18: `components/SocialProof.tsx` (link-out cards, placeholder-aware)

**Files:**

- Create: `web/components/SocialProof.tsx`, `web/components/SocialProof.test.tsx`

**Interfaces:**

- Consumes: `press` from `@/content/press`; `useTheme`.
- Produces:

  ```ts
  export function SocialProof(): JSX.Element;
  ```

  `<section id="press">`. Per spec §9.4 decision (a): **no embeds**. Renders:
  - TV feature: if `press.tvFeature.confirmed` → "As seen on {network} — {show} ({year})"; else a visibly-flagged "TV feature — content pending from the family" note.
  - Vloggers: `press.vloggers` as thumbnail cards (`<a>` with poster `Image` + name + platform, `target="_blank"`, `rel="noopener noreferrer"`). Empty array → a "vlogger features — pending" note.
  - Facebook: rating label + "Tag us {tagHandle}" callout; flagged when `!press.facebook.confirmed`.

- [ ] **Step 1: Write the failing test — `web/components/SocialProof.test.tsx`**

```tsx
import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { SocialProof } from "@/components/SocialProof";
import { ThemeProvider } from "@/components/ThemeProvider";
import { carinderia } from "@/theme/carinderia";

function mount() {
  return render(
    <ThemeProvider theme={carinderia}>
      <SocialProof />
    </ThemeProvider>,
  );
}

describe("SocialProof", () => {
  it("shows the Facebook tag handle", () => {
    mount();
    expect(screen.getByText(/@alingnenetumbatumba/)).toBeInTheDocument();
  });

  it("flags the unconfirmed press content instead of inventing it", () => {
    mount();
    expect(screen.getAllByText(/pending|content pending|to be supplied/i).length).toBeGreaterThan(
      0,
    );
  });

  it("renders no iframes (link-out only, spec §9.4a)", () => {
    const { container } = mount();
    expect(container.querySelector("iframe")).toBeNull();
  });
});
```

- [ ] **Step 2: Run to verify it fails**

Run: `cd web && npx vitest run components/SocialProof.test.tsx`
Expected: FAIL — cannot resolve `@/components/SocialProof`.

- [ ] **Step 3: Create `web/components/SocialProof.tsx`**

```tsx
import Image from "next/image";
import { press } from "@/content/press";
import { useTheme } from "@/components/ThemeProvider";

function PendingNote({ label }: { label: string }) {
  return (
    <p className="rounded-theme border border-dashed border-accent/50 bg-accent/5 p-3 text-sm text-ink/70">
      ⚠ {label} — content pending from the family (spec §10). Not for launch.
    </p>
  );
}

export function SocialProof() {
  const theme = useTheme();
  const { tvFeature, vloggers, facebook } = press;

  return (
    <section id="press" className={`${theme.layout.sectionPaddingY} bg-surface-2 text-ink`}>
      <div className="mx-auto grid w-[min(100%-2.5rem,70rem)] gap-8">
        <h2 className="font-display text-3xl font-bold">People are talking</h2>

        {tvFeature.confirmed ? (
          <p className="text-lg">
            As seen on <strong>{tvFeature.network}</strong> — {tvFeature.show} ({tvFeature.year})
          </p>
        ) : (
          <PendingNote label="National TV feature" />
        )}

        {vloggers.length > 0 ? (
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {vloggers.map((v) => (
              <li key={v.url}>
                <a
                  href={v.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col overflow-hidden rounded-theme border border-ink/10 hover:border-accent"
                >
                  <Image
                    src={v.poster.src}
                    alt={v.poster.alt}
                    width={480}
                    height={270}
                    className="h-40 w-full object-cover"
                  />
                  <span className="p-3 text-sm">
                    <strong>{v.name}</strong> · {v.platform} ↗
                  </span>
                </a>
              </li>
            ))}
          </ul>
        ) : (
          <PendingNote label="Vlogger features" />
        )}

        <p
          className={
            "rounded-theme border border-sage bg-surface-1 p-4 " +
            (facebook.confirmed ? "" : "border-dashed")
          }
        >
          {facebook.ratingLabel} · Tag us <strong>{facebook.tagHandle}</strong>
          {!facebook.confirmed && " — rating unconfirmed"}
        </p>
      </div>
    </section>
  );
}
```

- [ ] **Step 4: Run to verify it passes**

Run: `cd web && npx vitest run components/SocialProof.test.tsx`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add web/components/SocialProof.tsx web/components/SocialProof.test.tsx
git commit -m "feat(web): add SocialProof (link-out cards, placeholder-aware)"
```

---

### Task 19: `components/MenuBoard.tsx`

**Files:**

- Create: `web/components/MenuBoard.tsx`, `web/components/MenuBoard.test.tsx`

**Interfaces:**

- Consumes: `menuGroups`, `printedMenuHref` from `@/content/menu`; `useTheme`.
- Produces:

  ```ts
  export function MenuBoard(): JSX.Element;
  ```

  `<section id="menu">`. Renders all four groups as `<dl>` price lists with `dt` (name + optional `qualifier`) and `dd` (price, `tabular-nums`). The pancit group shows its `note`. A "View the printed menu →" link to `printedMenuHref`. When `theme.layout.menuTreatment === "board"`: dark lit-panel styling (`bg-canvas text-ink-invert`, gold rule). When `"editorial"`: light, generous leading, hairline rules.

- [ ] **Step 1: Write the failing test — `web/components/MenuBoard.test.tsx`**

```tsx
import { describe, expect, it } from "vitest";
import { render, screen, within } from "@testing-library/react";
import { MenuBoard } from "@/components/MenuBoard";
import { ThemeProvider } from "@/components/ThemeProvider";
import { carinderia } from "@/theme/carinderia";
import { heritage } from "@/theme/heritage";

function mount(theme = carinderia) {
  return render(
    <ThemeProvider theme={theme}>
      <MenuBoard />
    </ThemeProvider>,
  );
}

describe("MenuBoard", () => {
  it("renders all four group headings", () => {
    mount();
    for (const label of ["Pork", "Must Try", "Pancit by the Bilao", "Extras"]) {
      expect(screen.getByRole("heading", { name: label })).toBeInTheDocument();
    }
  });

  it("shows Crispy Pata with its dual price", () => {
    mount();
    expect(screen.getByText("Crispy Pata")).toBeInTheDocument();
    expect(screen.getByText("870 XL · 900 Jumbo")).toBeInTheDocument();
  });

  it("shows the pancit +₱50 note", () => {
    mount();
    expect(screen.getByText(/Add ₱50 for sotanghon or canton/)).toBeInTheDocument();
  });

  it("links the printed menu photo", () => {
    mount();
    expect(screen.getByRole("link", { name: /printed menu/i })).toHaveAttribute(
      "href",
      "/menu.jpg",
    );
  });

  it("renders under both menu treatments without error", () => {
    mount(heritage);
    expect(screen.getByRole("heading", { name: "Pork" })).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run to verify it fails**

Run: `cd web && npx vitest run components/MenuBoard.test.tsx`
Expected: FAIL — cannot resolve `@/components/MenuBoard`.

- [ ] **Step 3: Create `web/components/MenuBoard.tsx`**

```tsx
import { menuGroups, printedMenuHref } from "@/content/menu";
import { useTheme } from "@/components/ThemeProvider";

export function MenuBoard() {
  const theme = useTheme();
  const board = theme.layout.menuTreatment === "board";

  return (
    <section
      id="menu"
      className={`${theme.layout.sectionPaddingY} ${
        board ? "bg-canvas text-ink-invert" : "bg-surface-1 text-ink"
      }`}
    >
      <div className="mx-auto w-[min(100%-2.5rem,70rem)]">
        <h2 className="mb-2 font-display text-3xl font-bold">The Food</h2>
        <p className="mb-8 text-sm opacity-80">
          Prices in pesos. Bilao and platters are made to order — please call ahead so it&apos;s hot
          when you arrive.
        </p>

        <div className="grid gap-x-10 gap-y-8 md:grid-cols-2">
          {menuGroups.map((group) => (
            <div key={group.id} className={group.wide ? "md:col-span-2" : ""}>
              <h3
                className={`font-display text-xl font-bold ${board ? "text-gold" : "text-accent"}`}
              >
                {group.label}
              </h3>
              {group.note && <p className="mt-1 text-sm italic opacity-80">{group.note}</p>}
              <dl className="mt-3 divide-y divide-current/15">
                {group.items.map((item, i) => (
                  <div key={`${item.name}-${i}`} className="flex justify-between gap-4 py-2">
                    <dt>
                      {item.name}
                      {item.qualifier && (
                        <span className="ml-2 text-sm opacity-70">{item.qualifier}</span>
                      )}
                    </dt>
                    <dd className="whitespace-nowrap font-semibold tabular-nums">{item.price}</dd>
                  </div>
                ))}
              </dl>
            </div>
          ))}
        </div>

        <p className="mt-8">
          <a href={printedMenuHref} className="underline hover:text-accent">
            View the printed menu →
          </a>
        </p>
      </div>
    </section>
  );
}
```

- [ ] **Step 4: Run to verify it passes**

Run: `cd web && npx vitest run components/MenuBoard.test.tsx`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add web/components/MenuBoard.tsx web/components/MenuBoard.test.tsx
git commit -m "feat(web): add MenuBoard with board/editorial treatments"
```

---

### Task 20: `components/OurStory.tsx` (placeholder-aware)

**Files:**

- Create: `web/components/OurStory.tsx`, `web/components/OurStory.test.tsx`

**Interfaces:**

- Consumes: `story` from `@/content/story`; `useTheme`.
- Produces:

  ```ts
  export function OurStory(): JSX.Element;
  ```

  `<section id="story">`. Renders the heading, each `story.paragraphs` entry as a `<p>`, a stock photo slot (`/stock/story.jpg`, marked). When `!story.confirmed`: a visible banner ("Placeholder — the family's own words are still to come") and the `story.questionsForFamily` list rendered as a `<ul>` **inside an HTML comment-equivalent visible dev note** (keep it visible and flagged — do not hide it).

- [ ] **Step 1: Write the failing test — `web/components/OurStory.test.tsx`**

```tsx
import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { OurStory } from "@/components/OurStory";
import { ThemeProvider } from "@/components/ThemeProvider";
import { carinderia } from "@/theme/carinderia";
import { story } from "@/content/story";

function mount() {
  return render(
    <ThemeProvider theme={carinderia}>
      <OurStory />
    </ThemeProvider>,
  );
}

describe("OurStory", () => {
  it("renders every story paragraph", () => {
    mount();
    expect(
      screen.getByText(/Aling Nene started cooking for the neighbourhood/),
    ).toBeInTheDocument();
    expect(screen.getByText(/Today the kitchen is run by/)).toBeInTheDocument();
  });

  it("shows a visible placeholder banner while unconfirmed", () => {
    mount();
    expect(screen.getByText(/placeholder/i)).toBeInTheDocument();
  });

  it("lists all questions for the family", () => {
    mount();
    for (const q of story.questionsForFamily) {
      expect(screen.getByText(q)).toBeInTheDocument();
    }
  });
});
```

- [ ] **Step 2: Run to verify it fails**

Run: `cd web && npx vitest run components/OurStory.test.tsx`
Expected: FAIL — cannot resolve `@/components/OurStory`.

- [ ] **Step 3: Create `web/components/OurStory.tsx`**

```tsx
import Image from "next/image";
import { story } from "@/content/story";
import { useTheme } from "@/components/ThemeProvider";

export function OurStory() {
  const theme = useTheme();

  return (
    <section id="story" className={`${theme.layout.sectionPaddingY} bg-surface-1 text-ink`}>
      <div className="mx-auto grid w-[min(100%-2.5rem,46rem)] gap-6">
        <h2 className="font-display text-3xl font-bold">Our Story</h2>

        {!story.confirmed && (
          <p className="rounded-theme border border-dashed border-accent/50 bg-accent/5 p-3 text-sm">
            ⚠ Placeholder — nothing here is confirmed. This becomes the family&apos;s own words once
            they answer the questions below (spec §5.6). Do not launch with this copy.
          </p>
        )}

        {story.paragraphs.map((p, i) => (
          <p key={i} className="leading-relaxed">
            {p}
          </p>
        ))}

        <figure className="relative overflow-hidden rounded-theme">
          <Image
            src="/stock/story.jpg"
            alt="Stock photo (placeholder — swap for a real photo of the family or the kitchen)."
            width={1200}
            height={800}
            className="h-auto w-full object-cover"
          />
          <figcaption className="absolute left-2 top-2 rounded bg-ink/70 px-2 py-1 text-xs text-ink-invert">
            stock photo — replace before launch
          </figcaption>
        </figure>

        {!story.confirmed && (
          <aside className="rounded-theme border border-ink/15 bg-surface-2 p-4 text-sm">
            <p className="mb-2 font-semibold">Questions for the family:</p>
            <ul className="list-disc space-y-1 pl-5">
              {story.questionsForFamily.map((q) => (
                <li key={q}>{q}</li>
              ))}
            </ul>
          </aside>
        )}
      </div>
    </section>
  );
}
```

- [ ] **Step 4: Run to verify it passes**

Run: `cd web && npx vitest run components/OurStory.test.tsx`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add web/components/OurStory.tsx web/components/OurStory.test.tsx
git commit -m "feat(web): add OurStory section (placeholder-aware)"
```

---

### Task 21: `components/VisitOrder.tsx`

**Files:**

- Create: `web/components/VisitOrder.tsx`, `web/components/VisitOrder.test.tsx`

**Interfaces:**

- Consumes: `restaurant` from `@/content/restaurant`; `useTheme`; `CtaButton`.
- Produces:

  ```ts
  export function VisitOrder(): JSX.Element;
  ```

  `<section id="visit">`. Renders: `<address>` (street / locality, region), an hours table (`daily 9:00 AM – 10:00 PM`), a contacts list — Landline (`landlineHref`/`landlineDisplay`), Mobile (`mobileHref`/`mobileDisplay`), **GCash `{gcash.number}` ({gcash.name})** shown right here at the decision point, Facebook link — `restaurant.reservationNote`, a plain Google Maps link (`mapsUrl`, not an embed), and two large `CtaButton`s (call + Messenger).

- [ ] **Step 1: Write the failing test — `web/components/VisitOrder.test.tsx`**

```tsx
import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { VisitOrder } from "@/components/VisitOrder";
import { ThemeProvider } from "@/components/ThemeProvider";
import { carinderia } from "@/theme/carinderia";

function mount() {
  return render(
    <ThemeProvider theme={carinderia}>
      <VisitOrder />
    </ThemeProvider>,
  );
}

describe("VisitOrder", () => {
  it("shows the address and hours", () => {
    mount();
    expect(screen.getByText(/823 General Kalentong Street/)).toBeInTheDocument();
    expect(screen.getByText(/9:00\s*AM\s*–\s*10:00\s*PM/)).toBeInTheDocument();
  });

  it("shows GCash number and account name at the decision point", () => {
    mount();
    expect(screen.getByText(/GCash/)).toBeInTheDocument();
    expect(screen.getByText(/0932 514 7741/)).toBeInTheDocument();
    expect(screen.getByText(/Cristina D\./)).toBeInTheDocument();
  });

  it("links landline, mobile, Facebook, and Maps (plain link)", () => {
    const { container } = mount();
    expect(screen.getByRole("link", { name: /8570 8560/ })).toHaveAttribute(
      "href",
      "tel:+63285708560",
    );
    expect(screen.getByRole("link", { name: /maps/i })).toHaveAttribute(
      "href",
      expect.stringContaining("google.com/maps"),
    );
    expect(container.querySelector("iframe")).toBeNull();
  });

  it("has two primary order CTAs", () => {
    mount();
    expect(screen.getByRole("link", { name: /call to order/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /message on facebook/i })).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run to verify it fails**

Run: `cd web && npx vitest run components/VisitOrder.test.tsx`
Expected: FAIL — cannot resolve `@/components/VisitOrder`.

- [ ] **Step 3: Create `web/components/VisitOrder.tsx`**

```tsx
import { restaurant } from "@/content/restaurant";
import { useTheme } from "@/components/ThemeProvider";
import { CtaButton } from "@/components/CtaButton";

export function VisitOrder() {
  const theme = useTheme();
  const { address, phone, gcash, socials, hours } = restaurant;

  return (
    <section id="visit" className={`${theme.layout.sectionPaddingY} bg-surface-2 text-ink`}>
      <div className="mx-auto grid w-[min(100%-2.5rem,70rem)] gap-10 md:grid-cols-2">
        <div className="space-y-4">
          <h2 className="font-display text-3xl font-bold">Visit &amp; order</h2>
          <address className="not-italic">
            {address.street}
            <br />
            {address.locality}, {address.region}
          </address>
          <table className="text-sm">
            <tbody>
              <tr>
                <th scope="row" className="pr-4 text-left font-semibold capitalize">
                  {hours.days}
                </th>
                <td>9:00 AM – 10:00 PM</td>
              </tr>
            </tbody>
          </table>
          <p>
            <a href={restaurant.mapsUrl} rel="noopener" className="underline hover:text-accent">
              Open in Google Maps →
            </a>
          </p>
        </div>

        <div className="space-y-4">
          <h3 className="font-display text-xl font-bold">Reservations &amp; orders</h3>
          <p className="text-sm text-ink/80">{restaurant.reservationNote}</p>
          <ul className="space-y-2 text-sm">
            <li>
              <span className="inline-block w-20 font-semibold">Landline</span>
              <a href={phone.landlineHref} className="underline">
                {phone.landlineDisplay}
              </a>
            </li>
            <li>
              <span className="inline-block w-20 font-semibold">Mobile</span>
              <a href={phone.mobileHref} className="underline">
                {phone.mobileDisplay}
              </a>
            </li>
            <li>
              <span className="inline-block w-20 font-semibold">GCash</span>
              {gcash.number} <span className="text-ink/70">({gcash.name})</span>
            </li>
            <li>
              <span className="inline-block w-20 font-semibold">Facebook</span>
              <a href={socials.facebook} rel="noopener" className="underline">
                @alingnenetumbatumba
              </a>
            </li>
          </ul>
          <div className="flex flex-wrap gap-3 pt-2">
            <CtaButton href={phone.landlineHref}>Call to order</CtaButton>
            <CtaButton href={socials.messenger} rel="noopener" variant="ghost">
              Message on Facebook
            </CtaButton>
          </div>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 4: Run to verify it passes**

Run: `cd web && npx vitest run components/VisitOrder.test.tsx`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add web/components/VisitOrder.tsx web/components/VisitOrder.test.tsx
git commit -m "feat(web): add VisitOrder section with GCash at the decision point"
```

---

### Task 22: Compose `LandingPage` and wire `/` to the Carinderia theme

**Files:**

- Create: `web/components/LandingPage.tsx`, `web/components/LandingPage.test.tsx`, `web/public/stock/README.md`, `web/public/stock/hero-pata.jpg`, `web/public/stock/dish-pata.jpg`, `web/public/stock/dish-sisig.jpg`, `web/public/stock/dish-lengua.jpg`, `web/public/stock/dish-pancit.jpg`, `web/public/stock/story.jpg`
- Modify: `web/app/page.tsx`
- Copy: `site/img/logo.jpg` → `web/public/logo.jpg`; `site/img/menu.jpg` → `web/public/menu.jpg`

**Interfaces:**

- Consumes: `ThemeProvider`, all Phase 2–3 components, `Theme`.
- Produces:

  ```ts
  export function LandingPage(props: { theme: Theme }): JSX.Element;
  ```

  Both routes render only `<LandingPage theme={…} />`, so section order and composition live in one file. Order (spec §5): `SiteHeader`, `<main>` [`Hero`, `SignatureDishes`, `SocialProof`, `MenuBoard`, `OurStory`, `VisitOrder`], `SiteFooter`, `StickyOrderBar` — all inside one `ThemeProvider`.

- [ ] **Step 1: Create placeholder stock assets**

Run (from repo root):

```bash
mkdir -p web/public/stock
cp site/img/logo.jpg web/public/logo.jpg
cp site/img/menu.jpg web/public/menu.jpg
# 1x1 grey JPEGs as stand-ins; real dimensions come with the family's shoot.
for f in hero-pata dish-pata dish-sisig dish-lengua dish-pancit story; do
  printf '\xff\xd8\xff\xe0\x00\x10JFIF\x00\x01\x01\x00\x00\x01\x00\x01\x00\x00\xff\xdb\x00\x43\x00\x08\x06\x06\x07\x06\x05\x08\x07\x07\x07\x09\x09\x08\x0a\x0c\x14\x0d\x0c\x0b\x0b\x0c\x19\x12\x13\x0f\x14\x1d\x1a\x1f\x1e\x1d\x1a\x1c\x1c\x20\x24\x2e\x27\x20\x22\x2c\x23\x1c\x1c\x28\x37\x29\x2c\x30\x31\x34\x34\x34\x1f\x27\x39\x3d\x38\x32\x3c\x2e\x33\x34\x32\xff\xc0\x00\x0b\x08\x00\x01\x00\x01\x01\x01\x11\x00\xff\xc4\x00\x14\x00\x01\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x09\xff\xc4\x00\x14\x10\x01\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\xff\xda\x00\x08\x01\x01\x00\x00\x3f\x00\xd2\xcf\x20\xff\xd9' > "web/public/stock/$f.jpg"
done
```

- [ ] **Step 2: Create `web/public/stock/README.md`**

```markdown
# Stock placeholders — DO NOT SHIP

Every file here is a dev-only stand-in. Replace each with the family's own
photo before launch and flip the matching `isStock` flag / caption in
`web/content/dishes.ts`, `web/components/Hero.tsx`, `web/components/OurStory.tsx`.

`npm run check:stock` (in `web/`) lists any `/stock/` reference still present
in the built output.

Shot list (spec §10): hero pata, the 4 signature dishes, kitchen/family, storefront.
```

- [ ] **Step 3: Write the failing test — `web/components/LandingPage.test.tsx`**

```tsx
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { LandingPage } from "@/components/LandingPage";
import { carinderia } from "@/theme/carinderia";
import { heritage } from "@/theme/heritage";

beforeEach(() => {
  vi.useFakeTimers();
  vi.setSystemTime(new Date("2026-09-01T05:00:00Z"));
  vi.stubGlobal(
    "IntersectionObserver",
    class {
      observe() {}
      disconnect() {}
      unobserve() {}
    },
  );
});
afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllGlobals();
});

describe.each([
  ["carinderia", carinderia],
  ["heritage", heritage],
])("LandingPage — %s theme", (_name, theme) => {
  it("renders every section in order", () => {
    const { container } = render(<LandingPage theme={theme} />);
    const ids = [...container.querySelectorAll("section[id]")].map((s) => s.id);
    expect(ids).toEqual(["top", "dishes", "press", "menu", "story", "visit"]);
  });

  it("renders exactly one h1", () => {
    render(<LandingPage theme={theme} />);
    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
  });

  it("exposes the primary order CTA", () => {
    render(<LandingPage theme={theme} />);
    expect(screen.getAllByRole("link", { name: /call to order/i }).length).toBeGreaterThan(0);
  });
});
```

- [ ] **Step 4: Run to verify it fails**

Run: `cd web && npx vitest run components/LandingPage.test.tsx`
Expected: FAIL — cannot resolve `@/components/LandingPage`.

- [ ] **Step 5: Create `web/components/LandingPage.tsx`**

```tsx
import type { Theme } from "@/theme/tokens";
import { ThemeProvider } from "@/components/ThemeProvider";
import { SiteHeader } from "@/components/SiteHeader";
import { Hero } from "@/components/Hero";
import { SignatureDishes } from "@/components/SignatureDishes";
import { SocialProof } from "@/components/SocialProof";
import { MenuBoard } from "@/components/MenuBoard";
import { OurStory } from "@/components/OurStory";
import { VisitOrder } from "@/components/VisitOrder";
import { SiteFooter } from "@/components/SiteFooter";
import { StickyOrderBar } from "@/components/StickyOrderBar";

export function LandingPage({ theme }: { theme: Theme }) {
  return (
    <ThemeProvider theme={theme}>
      <a
        href="#menu"
        className="sr-only focus:not-sr-only focus:absolute focus:left-2 focus:top-2 focus:z-50 focus:rounded focus:bg-ink focus:px-3 focus:py-2 focus:text-ink-invert"
      >
        Skip to the menu
      </a>
      <SiteHeader />
      <main>
        <Hero />
        <SignatureDishes />
        <SocialProof />
        <MenuBoard />
        <OurStory />
        <VisitOrder />
      </main>
      <SiteFooter />
      <StickyOrderBar />
    </ThemeProvider>
  );
}
```

- [ ] **Step 6: Replace `web/app/page.tsx`**

```tsx
import { LandingPage } from "@/components/LandingPage";
import { carinderia } from "@/theme/carinderia";

export default function Page() {
  return <LandingPage theme={carinderia} />;
}
```

- [ ] **Step 7: Run tests + build**

Run:

```bash
cd web && npx vitest run && npm run build
```

Expected: all tests PASS; build succeeds; `web/out/index.html` contains "Tumba Tumba" and the four menu group labels.

- [ ] **Step 8: Commit**

```bash
git add web/components/LandingPage.tsx web/components/LandingPage.test.tsx web/app/page.tsx web/public
git commit -m "feat(web): compose LandingPage and wire / to the Carinderia theme"
```

---

## Phase 4 — Heritage route

### Task 23: `/heritage` route + verify one component set serves both directions

**Files:**

- Create: `web/app/heritage/page.tsx`, `web/app/heritage/heritage-route.test.tsx`

**Interfaces:**

- Consumes: `LandingPage`, `heritage` theme.
- Produces: route `/heritage` rendering `<LandingPage theme={heritage} />`. No new components — this task proves the theme mechanism: switching the token object reskins every section, and `theme.layout` drives the per-direction layout differences already branched in Tasks 16/19 (`heroAlign`, `menuTreatment`, `sectionPaddingY`).

- [ ] **Step 1: Write the failing test — `web/app/heritage/heritage-route.test.tsx`**

```tsx
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import HeritagePage from "@/app/heritage/page";

beforeEach(() => {
  vi.useFakeTimers();
  vi.setSystemTime(new Date("2026-09-01T05:00:00Z"));
  vi.stubGlobal(
    "IntersectionObserver",
    class {
      observe() {}
      disconnect() {}
      unobserve() {}
    },
  );
});
afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllGlobals();
});

describe("/heritage route", () => {
  it("renders the shared landing page under the heritage theme", () => {
    const { container } = render(<HeritagePage />);
    expect(container.querySelector('.theme-root[data-theme="heritage"]')).toBeTruthy();
  });

  it("still renders every section from the same components", () => {
    const { container } = render(<HeritagePage />);
    const ids = [...container.querySelectorAll("section[id]")].map((s) => s.id);
    expect(ids).toEqual(["top", "dishes", "press", "menu", "story", "visit"]);
  });

  it("applies the editorial menu treatment (no board-only gold heading class)", () => {
    render(<HeritagePage />);
    const porkHeading = screen.getByRole("heading", { name: "Pork" });
    expect(porkHeading.className).toContain("text-accent");
  });
});
```

- [ ] **Step 2: Run to verify it fails**

Run: `cd web && npx vitest run app/heritage/heritage-route.test.tsx`
Expected: FAIL — cannot resolve `@/app/heritage/page`.

- [ ] **Step 3: Create `web/app/heritage/page.tsx`**

```tsx
import { LandingPage } from "@/components/LandingPage";
import { heritage } from "@/theme/heritage";

export default function HeritagePage() {
  return <LandingPage theme={heritage} />;
}
```

- [ ] **Step 4: Run to verify it passes**

Run: `cd web && npx vitest run app/heritage/heritage-route.test.tsx`
Expected: PASS.

- [ ] **Step 5: Build and confirm both routes export**

Run:

```bash
cd web && npm run build
```

Expected: build succeeds; both `web/out/index.html` and `web/out/heritage.html` (or `web/out/heritage/index.html`) exist.

- [ ] **Step 6: Commit**

```bash
git add web/app/heritage
git commit -m "feat(web): add /heritage route reusing the shared component set"
```

---

## Phase 5 — SEO, security headers, a11y & performance

### Task 24: `app/robots.ts` + `app/sitemap.ts`

**Files:**

- Create: `web/app/robots.ts`, `web/app/sitemap.ts`, `web/app/seo.test.ts`

**Interfaces:**

- Consumes: `siteUrl` from `@/lib/siteUrl`.
- Produces: `robots.ts` default export → `MetadataRoute.Robots` (allow all, `sitemap: ${siteUrl}/sitemap.xml`). `sitemap.ts` default export → `MetadataRoute.Sitemap` listing `/` and `/heritage` (both routes stay in the sitemap during the preview phase; the losing one is dropped at cutover per spec §4.4). Static export emits `web/out/robots.txt` and `web/out/sitemap.xml`.

- [ ] **Step 1: Write the failing test — `web/app/seo.test.ts`**

```ts
import { describe, expect, it } from "vitest";
import robots from "@/app/robots";
import sitemap from "@/app/sitemap";
import { siteUrl } from "@/lib/siteUrl";

describe("robots", () => {
  it("allows all and points at the sitemap", () => {
    const r = robots();
    expect(r.rules).toEqual({ userAgent: "*", allow: "/" });
    expect(r.sitemap).toBe(`${siteUrl}/sitemap.xml`);
  });
});

describe("sitemap", () => {
  it("lists both directions while previewing", () => {
    const urls = sitemap().map((e) => e.url);
    expect(urls).toEqual([`${siteUrl}/`, `${siteUrl}/heritage`]);
  });
});
```

- [ ] **Step 2: Run to verify it fails**

Run: `cd web && npx vitest run app/seo.test.ts`
Expected: FAIL — cannot resolve `@/app/robots`.

- [ ] **Step 3: Create `web/app/robots.ts`**

```ts
import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/siteUrl";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
```

- [ ] **Step 4: Create `web/app/sitemap.ts`**

```ts
import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/siteUrl";

// Both directions stay listed while James previews. At cutover (spec §4.4)
// drop the losing route.
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date("2026-09-01");
  return [
    { url: `${siteUrl}/`, lastModified, changeFrequency: "monthly", priority: 1 },
    { url: `${siteUrl}/heritage`, lastModified, changeFrequency: "monthly", priority: 0.5 },
  ];
}
```

- [ ] **Step 5: Run to verify it passes; build to confirm files emit**

Run:

```bash
cd web && npx vitest run app/seo.test.ts && npm run build && ls out/robots.txt out/sitemap.xml
```

Expected: tests PASS; `out/robots.txt` and `out/sitemap.xml` listed.

- [ ] **Step 6: Commit**

```bash
git add web/app/robots.ts web/app/sitemap.ts web/app/seo.test.ts
git commit -m "feat(web): add robots and sitemap routes"
```

---

### Task 25: Metadata + `metadataBase` + `RestaurantSchema` JSON-LD

**Files:**

- Create: `web/components/RestaurantSchema.tsx`, `web/components/RestaurantSchema.test.tsx`
- Modify: `web/app/layout.tsx`, `web/app/page.tsx`, `web/app/heritage/page.tsx`

**Interfaces:**

- Consumes: `restaurant`, `siteUrl`.
- Produces:

  ```ts
  export function RestaurantSchema(): JSX.Element; // <script type="application/ld+json">
  ```

  `layout.tsx` gains `export const metadata: Metadata` with `metadataBase: new URL(siteUrl)`, title, description, and OpenGraph (`og:image` → `/logo.jpg`, a real asset). Each route adds its own `export const metadata` with a route-specific `title` and `alternates.canonical`. `RestaurantSchema` is rendered once in `layout.tsx` `<body>`; its JSON-LD mirrors the `Restaurant` schema from `site/index.html` (name, cuisine, url, telephone `+63-2-8570-8560`, image, priceRange, PostalAddress, `openingHoursSpecification` 09:00–22:00 all week, `sameAs` Facebook).

- [ ] **Step 1: Write the failing test — `web/components/RestaurantSchema.test.tsx`**

```tsx
import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import { RestaurantSchema } from "@/components/RestaurantSchema";

describe("RestaurantSchema", () => {
  it("emits valid Restaurant JSON-LD with the confirmed data", () => {
    const { container } = render(<RestaurantSchema />);
    const script = container.querySelector('script[type="application/ld+json"]')!;
    const data = JSON.parse(script.textContent!);
    expect(data["@type"]).toBe("Restaurant");
    expect(data.name).toBe("Aling Nene's Tumba Tumba Crispy Pata");
    expect(data.telephone).toBe("+63-2-8570-8560");
    expect(data.address.streetAddress).toBe("823 General Kalentong Street");
    expect(data.openingHoursSpecification[0].opens).toBe("09:00");
    expect(data.openingHoursSpecification[0].closes).toBe("22:00");
    expect(data.sameAs).toContain("https://www.facebook.com/alingnenetumbatumba");
  });
});
```

- [ ] **Step 2: Run to verify it fails**

Run: `cd web && npx vitest run components/RestaurantSchema.test.tsx`
Expected: FAIL — cannot resolve `@/components/RestaurantSchema`.

- [ ] **Step 3: Create `web/components/RestaurantSchema.tsx`**

```tsx
import { restaurant } from "@/content/restaurant";
import { siteUrl } from "@/lib/siteUrl";

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

export function RestaurantSchema() {
  const data = {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    name: restaurant.name,
    servesCuisine: restaurant.cuisine,
    url: `${siteUrl}/`,
    telephone: "+63-2-8570-8560",
    image: `${siteUrl}/logo.jpg`,
    priceRange: restaurant.priceRange,
    address: {
      "@type": "PostalAddress",
      streetAddress: restaurant.address.street,
      addressLocality: restaurant.address.locality,
      addressRegion: restaurant.address.region,
      addressCountry: restaurant.address.country,
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: DAYS,
        opens: restaurant.hours.open,
        closes: restaurant.hours.close,
      },
    ],
    sameAs: [restaurant.socials.facebook],
  };

  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />
  );
}
```

- [ ] **Step 4: Update `web/app/layout.tsx`** — add metadata export and render the schema

Add near the top (after imports):

```tsx
import type { Metadata } from "next";
import { siteUrl } from "@/lib/siteUrl";
import { RestaurantSchema } from "@/components/RestaurantSchema";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Aling Nene's Tumba Tumba Crispy Pata — Mandaluyong",
    template: "%s · Aling Nene's Tumba Tumba",
  },
  description:
    "Crispy pata, sisig, lengua asado, and pancit by the bilao. A family kitchen on General Kalentong Street, Mandaluyong. Open daily 9 AM – 10 PM. Call to order — 8570-8560.",
  openGraph: {
    type: "website",
    siteName: "Aling Nene's Tumba Tumba Crispy Pata",
    images: [{ url: "/logo.jpg", width: 512, height: 512 }],
  },
  twitter: { card: "summary" },
  icons: { icon: "/logo.jpg", apple: "/logo.jpg" },
  themeColor: "#a5211a",
};
```

Then render `<RestaurantSchema />` as the first child of `<body>`:

```tsx
<body>
  <RestaurantSchema />
  {children}
</body>
```

- [ ] **Step 5: Add per-route metadata**

`web/app/page.tsx` — add above the component:

```tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Crispy pata & pancit by the bilao in Mandaluyong",
  alternates: { canonical: "/" },
};
```

`web/app/heritage/page.tsx` — add above the component:

```tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "A Mandaluyong institution — crispy pata since the neighbourhood knew her",
  alternates: { canonical: "/heritage" },
};
```

- [ ] **Step 6: Run tests + build; confirm JSON-LD in output**

Run:

```bash
cd web && npx vitest run && npm run build && grep -l "application/ld+json" out/index.html out/heritage*/index.html out/heritage.html 2>/dev/null
```

Expected: tests PASS; build succeeds; `index.html` contains the JSON-LD block.

- [ ] **Step 7: Commit**

```bash
git add web/components/RestaurantSchema.tsx web/components/RestaurantSchema.test.tsx web/app/layout.tsx web/app/page.tsx web/app/heritage/page.tsx
git commit -m "feat(web): add metadata, metadataBase, and Restaurant JSON-LD"
```

---

### Task 26: Security headers via `web/vercel.json`

**Files:**

- Create: `web/vercel.json`

**Interfaces:**

- Produces: Vercel serves the static export from `web/out/` with security headers ported from `site/vercel.json` and adjusted per spec §9.3. `next.config.ts` `headers()` is intentionally **not** used — it is a no-op under `output: 'export'`.

- [ ] **Step 1: Create `web/vercel.json`**

```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "cleanUrls": true,
  "trailingSlash": false,
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        { "key": "X-Content-Type-Options", "value": "nosniff" },
        { "key": "X-Frame-Options", "value": "DENY" },
        { "key": "Referrer-Policy", "value": "strict-origin-when-cross-origin" },
        {
          "key": "Permissions-Policy",
          "value": "geolocation=(), camera=(), microphone=()"
        },
        {
          "key": "Strict-Transport-Security",
          "value": "max-age=31536000; includeSubDomains"
        },
        {
          "key": "Content-Security-Policy",
          "value": "default-src 'self'; img-src 'self' data:; style-src 'self' 'unsafe-inline'; font-src 'self'; script-src 'self' 'unsafe-inline'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'; object-src 'none'"
        }
      ]
    },
    {
      "source": "/_next/static/(.*)",
      "headers": [{ "key": "Cache-Control", "value": "public, max-age=31536000, immutable" }]
    },
    {
      "source": "/stock/(.*)",
      "headers": [{ "key": "Cache-Control", "value": "public, max-age=3600" }]
    }
  ]
}
```

Rationale (spec §9.3, §12): `font-src 'self'` (fonts self-hosted, no Google Fonts). `style-src`/`script-src` keep `'unsafe-inline'` because a static Next export ships inline bootstrap `<script>` and Tailwind/Next may inject `<style>`; static export has no nonce mechanism. This is the documented, accepted tradeoff — do not attempt per-build hashes here. No `frame-src` (link-out cards only, §9.4a).

- [ ] **Step 2: Verify the JSON is well-formed and the export still builds**

Run:

```bash
cd web && node -e "JSON.parse(require('fs').readFileSync('vercel.json','utf8')); console.log('vercel.json ok')" && npm run build
```

Expected: `vercel.json ok`; build succeeds.

- [ ] **Step 3: Verify the export contains no external `src`/`href` that the CSP would block**

Run: `grep -rEo 'https?://[a-zA-Z0-9./-]+' web/out/*.html | grep -v 'schema.org\|alingnene.com\|facebook.com\|m.me\|google.com/maps' || echo "no unexpected external refs"`
Expected: `no unexpected external refs` (schema.org appears only inside JSON-LD text, not as a fetched resource; facebook/m.me/maps are user-facing links, allowed).

- [ ] **Step 4: Commit**

```bash
git add web/vercel.json
git commit -m "feat(web): port security headers into web/vercel.json for static export"
```

---

### Task 27: Accessibility & performance pass

**Files:**

- Create: `web/components/a11y.test.tsx`
- Modify: whichever component files the checklist below turns up issues in

**Interfaces:**

- Consumes: `LandingPage` under both themes.
- Produces: an automated smoke check that each rendered direction has exactly one `<h1>`, a landmark `<main>`, a `<header>` and `<footer>`, and no image without `alt`. Plus a manual checklist (run against the staging URL in Task 28, or `npx serve web/out` locally) that must pass before James's review.

- [ ] **Step 1: Write the test — `web/components/a11y.test.tsx`**

```tsx
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { render } from "@testing-library/react";
import { LandingPage } from "@/components/LandingPage";
import { carinderia } from "@/theme/carinderia";
import { heritage } from "@/theme/heritage";

beforeEach(() => {
  vi.useFakeTimers();
  vi.setSystemTime(new Date("2026-09-01T05:00:00Z"));
  vi.stubGlobal(
    "IntersectionObserver",
    class {
      observe() {}
      disconnect() {}
      unobserve() {}
    },
  );
});
afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllGlobals();
});

describe.each([
  ["carinderia", carinderia],
  ["heritage", heritage],
])("a11y smoke — %s", (_n, theme) => {
  it("has one h1, and landmark header/main/footer", () => {
    const { container } = render(<LandingPage theme={theme} />);
    expect(container.querySelectorAll("h1")).toHaveLength(1);
    expect(container.querySelector("header")).toBeTruthy();
    expect(container.querySelector("main")).toBeTruthy();
    expect(container.querySelector("footer")).toBeTruthy();
  });

  it("has no image missing an alt attribute", () => {
    const { container } = render(<LandingPage theme={theme} />);
    for (const img of container.querySelectorAll("img")) {
      expect(img.hasAttribute("alt")).toBe(true);
    }
  });

  it("heading levels never skip (h1 → h2 → h3 only)", () => {
    const { container } = render(<LandingPage theme={theme} />);
    const levels = [...container.querySelectorAll("h1,h2,h3,h4")].map((h) => Number(h.tagName[1]));
    for (let i = 1; i < levels.length; i++) {
      expect(levels[i] - Math.max(...levels.slice(0, i))).toBeLessThanOrEqual(1);
    }
  });
});
```

- [ ] **Step 2: Run it; fix any failure at its source**

Run: `cd web && npx vitest run components/a11y.test.tsx`
Expected: PASS. If the heading-skip test fails, adjust the offending component's heading level (do not add `aria` bandaids).

- [ ] **Step 3: Manual checklist (record results in the PR description)**

Serve the build: `cd web && npx --yes serve out` → open `http://localhost:3000/` and `/heritage`.

- [ ] Keyboard-only: Tab reaches skip link → nav toggle → every nav link → header CTA → all in-page CTAs → sticky bar actions → footer links. Focus ring visible on each (theme `accent` outline).
- [ ] Mobile nav toggle: `Enter`/`Space` opens, `Escape` closes and returns focus to the toggle.
- [ ] `prefers-reduced-motion: reduce` (DevTools rendering pane): no dish-card lift, no badge pulse, no sticky-bar slide transition.
- [ ] Run axe DevTools on both routes → 0 serious/critical issues.
- [ ] Lighthouse (mobile, incognito) on both routes → perf / a11y / SEO / best-practices each ≥ 95. If perf < 95, check hero image dimensions and `priority` usage first.
- [ ] Tap targets on a 375px viewport: every CTA ≥ 44×44 px.

- [ ] **Step 4: Commit**

```bash
git add web/components/a11y.test.tsx
git commit -m "test(web): add a11y smoke checks for both directions"
```

---

## Phase 6 — Staging deployment docs

### Task 28: Document the staging Vercel project

**Files:**

- Modify: `DEPLOYMENT.md`

**Interfaces:**

- Produces: a "Staging (redesign)" section giving James the exact click-path to stand up the second Vercel project (spec §4.3). No code, no touching the production project.

- [ ] **Step 1: Add a "Staging (redesign)" section to `DEPLOYMENT.md`**

Append (adjust heading depth to match the file's existing structure):

```markdown
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
   - `/` → "Carinderia heat"
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
```

- [ ] **Step 2: Verify links and formatting**

Run: `npx --yes prettier --check DEPLOYMENT.md && npx --yes markdownlint DEPLOYMENT.md 2>/dev/null || true`
Expected: Prettier reports the file formatted (or fix with `--write`).

- [ ] **Step 3: Commit**

```bash
git add DEPLOYMENT.md
git commit -m "docs: add Staging (redesign) setup to DEPLOYMENT.md"
```

---

## Final verification (run before opening the PR)

- [ ] `cd web && npm ci && npx tsc --noEmit && npx next lint && npx vitest run && npm run build` — all green.
- [ ] `node web/scripts/check-no-stock.mjs` — prints the stock references still present (expected while photos are placeholders); exits 0.
- [ ] From repo root: `npx prettier --check .` — clean (covers `web/` minus build output).
- [ ] `git status` — only `web/`, `.gitignore`, `.prettierignore`, `.github/workflows/ci.yml`, `DEPLOYMENT.md`, and `docs/superpowers/plans/` changed. **`site/` untouched.**
- [ ] Manual (Task 27 checklist) on `npx serve web/out` for `/` and `/heritage`.
- [ ] Open PR `redesign` → `redesign` is the working branch; push it and let James create the staging Vercel project (Task 28). Do **not** merge to `main` (that is cutover, spec §4.4, out of scope).

---

## Self-Review

**1. Spec coverage**

| Spec section                        | Covered by                                                                                                                                    |
| ----------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| §4.1 layout (`web/` tree)           | Tasks 1, 3–6, 8–23 (File Structure map)                                                                                                       |
| §4.2 branch strategy                | Working on `redesign`; Final verification note (no merge to `main`)                                                                           |
| §4.3 staging Vercel                 | Task 28                                                                                                                                       |
| §4.4 cutover                        | Explicitly out of scope — noted in Global Constraints + Task 28                                                                               |
| §5 page structure (8 blocks)        | Header T13, Hero T16, Signature dishes T17, Social proof T18, Menu T19, Story T20, Visit T21, Footer T15; sticky order bar T14; assembled T22 |
| §6 tokens per direction + mechanism | Tasks 8 (token objects), 1+9 (`@theme inline` + fonts), 10 (ThemeProvider), 23 (layout variants)                                              |
| §7 components table                 | Tasks 10–21 (one component per task, props-driven, each with a test)                                                                          |
| §8 content modules                  | Tasks 3 (restaurant), 4 (menu), 5 (dishes/press/story)                                                                                        |
| §9.1 Next config                    | Task 1 (`output: export`, `images.unoptimized`); Task 9 (`next/font`); Task 25 (`metadataBase`)                                               |
| §9.2 CI                             | Task 7                                                                                                                                        |
| §9.3 security headers               | Task 26 (via `web/vercel.json`, with the documented CSP tradeoff)                                                                             |
| §9.4 embeds decision                | Locked to option (a) in Global Constraints; implemented T18                                                                                   |
| §9.5 open-now logic                 | Task 6 (`lib/openNow.ts`), Task 12 (`OpenNowBadge`)                                                                                           |
| §10 content required from James     | Tasks 5, 18, 20 keep placeholders visibly flagged; Task 22 stock README carries the shot list                                                 |
| §11 testing/verification            | Vitest harness T2; per-task tests; a11y smoke T27; manual + Lighthouse checklist T27; CI gate T7                                              |
| §12 risks                           | CSP tradeoff documented T26; palette-from-menu enforced in token tests T8; stock-photo guard T7/T22; staging-only, prod untouched             |
| §13 suggested phases                | This plan's Phases 1–6 map 1:1                                                                                                                |

No gaps found.

**2. Placeholder scan** — All code steps contain complete, runnable code. Business-data placeholders in `content/press.ts` and `content/story.ts` are _intentional_ (spec §10: "Do not invent copy") and are covered by tests asserting they stay flagged. The 1×1 JPEG stand-ins in Task 22 are intentional dev scaffolding with a guard script (Task 7) and README (Task 22).

**3. Type consistency** — `Hours` is defined structurally identically in `content/restaurant.ts` and `lib/openNow.ts` (openNow declares its own to stay dependency-free; the badge passes `restaurant.hours`, which is assignable). `ImageSlot` is defined once in `content/dishes.ts` and imported by `content/press.ts`. `Theme` / `ThemeLayout` from `theme/tokens.ts` are consumed unchanged by `ThemeProvider`, `LandingPage`, and every section via `useTheme()`. `cssVars` keys in Task 8 exactly match the `--t-*` names mapped in `globals.css` `@theme inline` (Task 1) — the Task 8 test enforces the full list. `CtaButton` prop name `variant` (`"solid" | "ghost"`) is used consistently in Tasks 13, 16, 17, 21. Section `id`s (`top`, `dishes`, `press`, `menu`, `story`, `visit`) are asserted as an ordered list in Tasks 22 and 23 and referenced by `SiteHeader` nav (`#menu`, `#story`, `#visit`) and the skip link (`#menu`).

---

## Execution Handoff

Plan complete and saved to `docs/superpowers/plans/2026-09-01-landing-page-redesign.md`. Two execution options:

**1. Subagent-Driven (recommended)** — I dispatch a fresh subagent per task, review between tasks, fast iteration.

**2. Inline Execution** — Execute tasks in this session using executing-plans, batch execution with checkpoints.

Which approach?
