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
    const levels = [...container.querySelectorAll("h1,h2,h3,h4")].map((h) =>
      Number(h.tagName[1]),
    );
    for (let i = 1; i < levels.length; i++) {
      expect(levels[i] - Math.max(...levels.slice(0, i))).toBeLessThanOrEqual(1);
    }
  });
});

/**
 * Regression lock for the Heritage chrome-contrast fix (Task 27).
 *
 * Under the Heritage theme, `canvas` (#f7f0e6) and `ink-invert` (#f7f0e6) are
 * both bone/ivory, so the old `bg-canvas` + `text-ink-invert` pairing on the
 * header, footer, and sticky bar rendered near-invisible. Those three "page
 * chrome" surfaces were moved to `bg-ink` (#241c15 — dark in both themes) so
 * `text-ink-invert` stays high-contrast in both directions.
 *
 * jsdom cannot compute rendered contrast, so this is a structural guard: it
 * asserts the class swap is present and the offending `bg-canvas` utility is
 * gone from the header/footer.
 *
 * The Hero band is the mirror case: `canvas` is DARK under carinderia (its
 * intended loud, appetite-first treatment) but bone under heritage, so the
 * hero is theme-aware — `bg-canvas text-ink-invert` for carinderia,
 * `bg-surface-2 text-ink` (light editorial band) for heritage. Locked below.
 */
describe("Heritage chrome contrast — structural regression lock", () => {
  it("header and footer use bg-ink, never bg-canvas, under Heritage", () => {
    const { container } = render(<LandingPage theme={heritage} />);
    const header = container.querySelector("header");
    const footer = container.querySelector("footer");

    expect(header).toBeTruthy();
    expect(footer).toBeTruthy();

    expect(header!.className).toContain("bg-ink");
    expect(header!.className).not.toContain("bg-canvas");

    expect(footer!.className).toContain("bg-ink");
    expect(footer!.className).not.toContain("bg-canvas");
  });

  it("the Hero band is a light surface under Heritage and stays bg-canvas under Carinderia", () => {
    const heritageHero = render(<LandingPage theme={heritage} />).container.querySelector(
      "section#top",
    );
    expect(heritageHero).toBeTruthy();
    expect(heritageHero!.className).toContain("bg-surface-2");
    expect(heritageHero!.className).not.toContain("bg-canvas");

    const carinderiaHero = render(<LandingPage theme={carinderia} />).container.querySelector(
      "section#top",
    );
    expect(carinderiaHero).toBeTruthy();
    expect(carinderiaHero!.className).toContain("bg-canvas");
  });
});
