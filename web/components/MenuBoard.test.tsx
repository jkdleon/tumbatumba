import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { MenuBoard } from "@/components/MenuBoard";
import { ThemeProvider } from "@/components/ThemeProvider";
import { kusina } from "@/theme/kusina";
import { heritage } from "@/theme/heritage";

function mount(theme = kusina) {
  return render(
    <ThemeProvider theme={theme}>
      <MenuBoard />
    </ThemeProvider>,
  );
}

describe("MenuBoard", () => {
  it("renders all four group headings", () => {
    mount();
    for (const label of ["Pork", "Must Try", "Pancit by the Bilao", "Extras"]) {
      expect(screen.getByRole("heading", { name: label })).toBeInTheDocument();
    }
  });

  it("shows Crispy Pata with its dual price", () => {
    mount();
    expect(screen.getByText("Crispy Pata")).toBeInTheDocument();
    expect(screen.getByText("870 XL · 900 Jumbo")).toBeInTheDocument();
  });

  it("shows the pancit +₱50 note", () => {
    mount();
    expect(screen.getByText(/Add ₱50 for sotanghon or canton/)).toBeInTheDocument();
  });

  it("links the printed menu photo", () => {
    mount();
    expect(screen.getByRole("link", { name: /printed menu/i })).toHaveAttribute(
      "href",
      "/menu.jpg",
    );
  });

  it("renders under both menu treatments without error", () => {
    mount(heritage);
    expect(screen.getByRole("heading", { name: "Pork" })).toBeInTheDocument();
  });
});
