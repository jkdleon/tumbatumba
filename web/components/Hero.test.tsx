import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { Hero } from "@/components/Hero";
import { setupLandingEnv } from "@/components/testUtils";

setupLandingEnv();

describe("Hero", () => {
  it("leads with Crispy Pata in the h1 and the family's own photo", () => {
    render(<Hero />);
    expect(screen.getByRole("heading", { level: 1 }).textContent).toMatch(/crispy\s*pata/i);
    expect(screen.getByAltText(/whole crispy pata/i)).toHaveAttribute(
      "src",
      "/photos/hero-pata.jpg",
    );
  });

  it("offers call and planner CTAs, and keeps the sticky-bar sentinel", () => {
    const { container } = render(<Hero />);
    expect(screen.getByRole("link", { name: /call to order/i })).toHaveAttribute(
      "href",
      "tel:+63285708560",
    );
    expect(screen.getByRole("link", { name: /barkada order/i })).toHaveAttribute(
      "href",
      "#planner",
    );
    expect(container.querySelector("#hero-end")).toBeTruthy();
  });
});
