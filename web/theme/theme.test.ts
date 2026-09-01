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
