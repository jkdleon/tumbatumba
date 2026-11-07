import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { VisitOrder } from "@/components/VisitOrder";
import { setupLandingEnv } from "@/components/testUtils";

setupLandingEnv();

describe("VisitOrder", () => {
  it("shows address, both phones, GCash and the reservation note", () => {
    const { container } = render(<VisitOrder />);
    const text = container.textContent ?? "";
    expect(text).toContain("823 General Kalentong Street");
    expect(screen.getByRole("link", { name: "(02) 8570 8560" })).toHaveAttribute(
      "href",
      "tel:+63285708560",
    );
    expect(screen.getByRole("link", { name: "0932 514 7741" })).toHaveAttribute(
      "href",
      "tel:+639325147741",
    );
    expect(text).toContain("Cristina D.");
    expect(text).toContain("Dine-in is by reservation");
    expect(screen.getByRole("button", { name: /copy gcash number/i })).toBeInTheDocument();
  });

  it("links Google Maps and shows live open status", () => {
    const { container } = render(<VisitOrder />);
    expect(screen.getByRole("link", { name: /google maps/i }).getAttribute("href")).toContain(
      "google.com/maps",
    );
    expect(container.textContent).toContain("Open now · closes 10 PM");
  });
});
