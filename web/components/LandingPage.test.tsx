import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { LandingPage } from "@/components/LandingPage";
import { setupLandingEnv } from "@/components/testUtils";

setupLandingEnv();

describe("LandingPage", () => {
  it("renders every customer-facing section in order (story hidden until confirmed)", () => {
    const { container } = render(<LandingPage />);
    const ids = [...container.querySelectorAll("section[id]")].map((s) => s.id);
    expect(ids).toEqual(["top", "dishes", "method", "menu", "planner", "feed", "visit"]);
  });

  it("has one h1, landmark header/main/footer, and headings that never skip a level", () => {
    const { container } = render(<LandingPage />);
    expect(container.querySelectorAll("h1")).toHaveLength(1);
    expect(container.querySelector("header")).toBeTruthy();
    expect(container.querySelector("main")).toBeTruthy();
    expect(container.querySelector("footer")).toBeTruthy();
    const levels = [...container.querySelectorAll("h1,h2,h3,h4")].map((h) => Number(h.tagName[1]));
    for (let i = 1; i < levels.length; i++) {
      expect(levels[i] - Math.max(...levels.slice(0, i))).toBeLessThanOrEqual(1);
    }
  });

  it("gives every image an alt attribute", () => {
    const { container } = render(<LandingPage />);
    for (const img of container.querySelectorAll("img")) expect(img.hasAttribute("alt")).toBe(true);
  });

  it("exposes the primary order CTA to the landline", () => {
    render(<LandingPage />);
    const calls = screen.getAllByRole("link", { name: /call to order/i });
    expect(calls.length).toBeGreaterThan(0);
    for (const a of calls) expect(a).toHaveAttribute("href", "tel:+63285708560");
  });

  it("never shows dev placeholders, pending notes or stock images to customers", () => {
    const { container } = render(<LandingPage />);
    const text = container.textContent ?? "";
    expect(text).not.toMatch(/placeholder|pending|not for launch|spec §|\[rating\]|\[network\]/i);
    expect(container.innerHTML).not.toContain("/stock/");
  });

  it("every external link opens safely", () => {
    const { container } = render(<LandingPage />);
    for (const a of container.querySelectorAll('a[target="_blank"]')) {
      expect(a.getAttribute("rel")).toContain("noopener");
    }
  });
});
