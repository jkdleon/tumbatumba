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
    expect(porkHeading.className).not.toContain("text-gold");
  });
});
