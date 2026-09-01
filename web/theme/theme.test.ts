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

  it("carinderia matches the full spec-§6 token set exactly", () => {
    expect(carinderia).toEqual({
      name: "carinderia",
      cssVars: {
        canvas: "#1a1512",
        "surface-1": "#f6e7db",
        "surface-2": "#fbf3e3",
        ink: "#241c15",
        "ink-invert": "#fbf3e3",
        accent: "#a5211a",
        "accent-strong": "#d7382a",
        gold: "#e0983f",
        sage: "#93ab72",
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
    });
  });

  it("heritage matches the full spec-§6 token set exactly", () => {
    expect(heritage).toEqual({
      name: "heritage",
      cssVars: {
        canvas: "#f7f0e6",
        "surface-1": "#f7f0e6",
        "surface-2": "#fdf9f1",
        ink: "#241c15",
        "ink-invert": "#f7f0e6",
        accent: "#a5211a",
        "accent-strong": "#7c1611",
        gold: "#e0983f",
        sage: "#93ab72",
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
    });
  });
});
