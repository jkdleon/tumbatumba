import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";

/**
 * The ordering CTA is resolved from the `ordering` singleton at render time, so
 * the live path can only be exercised by swapping that module. These cover the
 * flip that happens the day the Odoo shop answers — the one change nobody will
 * want to discover is broken in production.
 */
vi.mock("@/content/ordering", () => ({
  ordering: {
    shopUrl: "https://order.example.test",
    live: true,
    label: "Order or make a reservation",
    labelShort: "Order or reserve",
    note: "Pick-up today, or reserve for tomorrow. Dine-in tables by phone.",
  },
}));

beforeEach(() => {
  vi.resetModules();
});

afterEach(() => {
  cleanup();
});

describe("ordering CTA once the Odoo shop is live", () => {
  it("points the hero CTA at the shop, not the landline", async () => {
    const { Hero } = await import("@/components/Hero");
    const { ThemeProvider } = await import("@/components/ThemeProvider");
    const { kusina } = await import("@/theme/kusina");

    render(
      <ThemeProvider theme={kusina}>
        <Hero />
      </ThemeProvider>,
    );

    const cta = screen.getByRole("link", { name: "Order or make a reservation" });
    expect(cta).toHaveAttribute("href", "https://order.example.test");
    expect(cta).toHaveAttribute("rel", "noopener");
  });

  it("shows the pick-up / reservation note only on the live path", async () => {
    const { Hero } = await import("@/components/Hero");
    const { ThemeProvider } = await import("@/components/ThemeProvider");
    const { kusina } = await import("@/theme/kusina");

    render(
      <ThemeProvider theme={kusina}>
        <Hero />
      </ThemeProvider>,
    );

    expect(screen.getByText(/reserve for tomorrow/i)).toBeInTheDocument();
  });

  it("uses the short label in the sticky bar so it fits on a phone", async () => {
    const { StickyOrderBar } = await import("@/components/StickyOrderBar");

    render(<StickyOrderBar />);

    const cta = screen.getByRole("link", { name: "Order or reserve" });
    expect(cta).toHaveAttribute("href", "https://order.example.test");
  });
});
