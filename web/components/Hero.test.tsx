import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { Hero } from "@/components/Hero";
import { ThemeProvider } from "@/components/ThemeProvider";
import { kusina } from "@/theme/kusina";

function mount() {
  return render(
    <ThemeProvider theme={kusina}>
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

  it("renders the sticky-bar sentinel", () => {
    const { container } = mount();
    expect(container.querySelector("#hero-end")).toBeTruthy();
  });

  it("renders the real hero photo (no longer a stock placeholder)", () => {
    mount();
    const img = screen.getByRole("img");
    expect(img).toHaveAttribute("src", expect.stringContaining("/photos/hero-pata.jpg"));
    expect(img.getAttribute("alt") ?? "").not.toMatch(/stock/i);
  });
});
