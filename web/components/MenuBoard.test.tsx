import { describe, expect, it } from "vitest";
import { fireEvent, render, screen, within } from "@testing-library/react";
import { MenuBoard } from "@/components/MenuBoard";

describe("MenuBoard", () => {
  it("shows every group under 'Everything'", () => {
    render(<MenuBoard />);
    const panel = screen.getByRole("tabpanel");
    for (const label of ["Pork", "Must Try", "Pancit by the Bilao", "Pre-order", "Extras"]) {
      expect(within(panel).getByRole("heading", { name: label })).toBeInTheDocument();
    }
    expect(within(panel).getByText("870 XL · 900 Jumbo")).toBeInTheDocument();
  });

  it("filters to one group when a tab is picked", () => {
    render(<MenuBoard />);
    fireEvent.click(screen.getByRole("tab", { name: "Pre-order" }));
    const panel = screen.getByRole("tabpanel");
    expect(within(panel).getByText("Please order at least 1 day ahead.")).toBeInTheDocument();
    expect(within(panel).queryByRole("heading", { name: "Pork" })).toBeNull();
    expect(screen.getByRole("tab", { name: "Pre-order" })).toHaveAttribute("aria-selected", "true");
  });

  it("supports arrow-key navigation between tabs", () => {
    render(<MenuBoard />);
    fireEvent.keyDown(screen.getByRole("tab", { name: "Everything" }), { key: "ArrowRight" });
    expect(screen.getByRole("tab", { name: "Pork" })).toHaveAttribute("aria-selected", "true");
  });

  it("links the printed menu photo", () => {
    render(<MenuBoard />);
    expect(screen.getByRole("link", { name: /printed menu/i })).toHaveAttribute(
      "href",
      "/menu.jpg",
    );
  });
});
