import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { CtaButton } from "@/components/CtaButton";

describe("CtaButton", () => {
  it("renders an anchor with the given href and label", () => {
    render(<CtaButton href="tel:+63285708560">Call to order</CtaButton>);
    const link = screen.getByRole("link", { name: "Call to order" });
    expect(link).toHaveAttribute("href", "tel:+63285708560");
  });

  it("defaults to the solid variant", () => {
    render(<CtaButton href="#menu">See the menu</CtaButton>);
    expect(screen.getByRole("link", { name: "See the menu" }).className).toContain("bg-accent");
  });

  it("renders a ghost variant without a solid fill", () => {
    render(
      <CtaButton href="#menu" variant="ghost">
        See the menu
      </CtaButton>,
    );
    const cls = screen.getByRole("link", { name: "See the menu" }).className;
    expect(cls).not.toContain("bg-accent ");
    expect(cls).toContain("border");
  });

  it("forwards arbitrary anchor attributes", () => {
    render(
      <CtaButton href="https://m.me/x" rel="noopener" data-testid="msg">
        Message
      </CtaButton>,
    );
    expect(screen.getByTestId("msg")).toHaveAttribute("rel", "noopener");
  });
});
