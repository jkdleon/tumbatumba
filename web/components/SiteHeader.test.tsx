import { describe, expect, it } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { SiteHeader } from "@/components/SiteHeader";

describe("SiteHeader", () => {
  it("toggles the mobile nav and closes it on Escape", () => {
    render(<SiteHeader />);
    const btn = screen.getByRole("button", { name: /open menu/i });
    expect(btn).toHaveAttribute("aria-expanded", "false");
    fireEvent.click(btn);
    expect(screen.getByRole("button", { name: /close menu/i })).toHaveAttribute(
      "aria-expanded",
      "true",
    );
    fireEvent.keyDown(document, { key: "Escape" });
    expect(screen.getByRole("button", { name: /open menu/i })).toHaveAttribute(
      "aria-expanded",
      "false",
    );
  });

  it("links every in-page section", () => {
    render(<SiteHeader />);
    for (const href of ["#dishes", "#menu", "#planner", "#feed", "#visit"]) {
      expect(document.querySelector(`a[href="${href}"]`)).toBeTruthy();
    }
  });
});
