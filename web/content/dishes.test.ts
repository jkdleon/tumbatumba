import { describe, expect, it } from "vitest";
import { dishes } from "@/content/dishes";

describe("dishes content", () => {
  it("has the four signature dishes", () => {
    // Lengua Asado swapped for Crispy Ulo in the signature strip (still on the
    // full menu — see content/menu.ts) — both pata and ulo now have real photos.
    expect(dishes.map((d) => d.name)).toEqual([
      "Crispy Pata",
      "Sisig",
      "Crispy Ulo",
      "Pancit by the Bilao",
    ]);
  });

  it("marks dishes without the family's own photo as stock under /stock/", () => {
    const stillStock = dishes.filter((d) => d.image.isStock);
    expect(stillStock.map((d) => d.id)).toEqual(["sisig", "pancit"]);
    for (const d of stillStock) {
      expect(d.image.src.startsWith("/stock/")).toBe(true);
      expect(d.image.alt.length).toBeGreaterThan(0);
    }
  });

  it("crispy pata and crispy ulo have real photos, not stock placeholders", () => {
    for (const id of ["pata", "ulo"]) {
      const dish = dishes.find((d) => d.id === id)!;
      expect(dish.image.isStock).toBe(false);
      expect(dish.image.src).toBe(`/photos/dish-${id}.jpg`);
      expect(dish.image.alt.length).toBeGreaterThan(0);
      expect(dish.image.alt).not.toMatch(/stock/i);
    }
  });

  it("gives every dish a non-empty factual blurb and a price", () => {
    for (const d of dishes) {
      expect(d.blurb.trim().length).toBeGreaterThan(0);
      expect(d.price.trim().length).toBeGreaterThan(0);
    }
  });
});
