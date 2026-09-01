import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { SignatureDishes } from "@/components/SignatureDishes";
import { ThemeProvider } from "@/components/ThemeProvider";
import { carinderia } from "@/theme/carinderia";
import { dishes } from "@/content/dishes";

function mount() {
  return render(
    <ThemeProvider theme={carinderia}>
      <SignatureDishes />
    </ThemeProvider>,
  );
}

describe("SignatureDishes", () => {
  it("renders a card per signature dish", () => {
    mount();
    for (const d of dishes) {
      expect(screen.getByRole("heading", { name: d.name, level: 3 })).toBeInTheDocument();
    }
  });

  it("every card has an Order this CTA to the landline", () => {
    mount();
    const ctas = screen.getAllByRole("link", { name: /order this/i });
    expect(ctas).toHaveLength(dishes.length);
    for (const cta of ctas) expect(cta).toHaveAttribute("href", "tel:+63285708560");
  });

  it("marks each dish image as stock", () => {
    mount();
    for (const img of screen.getAllByRole("img")) {
      expect(img.getAttribute("alt") ?? "").toMatch(/stock/i);
    }
  });
});
