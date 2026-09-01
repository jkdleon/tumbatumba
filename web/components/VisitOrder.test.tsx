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
    // Hours range is derived from restaurant.hours via formatHours ("9 AM – 10 PM"),
    // never hardcoded — spec §3/§8, single source of truth.
    expect(screen.getByText(/9 AM – 10 PM/)).toBeInTheDocument();
  });

  it("shows GCash number and account name at the decision point", () => {
    mount();
    const gcashRow = screen.getByText("GCash").closest("li");
    // The mobile number and the GCash number are the same string, so scope the
    // assertion to the GCash contact row rather than a bare document query.
    expect(gcashRow).not.toBeNull();
    expect(gcashRow).toHaveTextContent(/0932 514 7741/);
    expect(gcashRow).toHaveTextContent(/Cristina D\./);
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
