import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { LandingPage } from "@/components/LandingPage";
import { kusina } from "@/theme/kusina";
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
  ["kusina", kusina],
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
