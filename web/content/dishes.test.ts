import { describe, expect, it } from "vitest";
import { dishes } from "@/content/dishes";

describe("dishes content", () => {
  it("has the four signature dishes from the spec", () => {
    expect(dishes.map((d) => d.name)).toEqual([
      "Crispy Pata",
      "Sisig",
      "Lengua Asado",
      "Pancit by the Bilao",
    ]);
  });

  it("marks dishes without the family's own photo as stock under /stock/", () => {
    const stillStock = dishes.filter((d) => d.id !== "pata");
    expect(stillStock).toHaveLength(3); // sisig, lengua, pancit — no real photos yet
    for (const d of stillStock) {
      expect(d.image.isStock).toBe(true);
      expect(d.image.src.startsWith("/stock/")).toBe(true);
      expect(d.image.alt.length).toBeGreaterThan(0);
    }
  });

  it("crispy pata has a real photo, not a stock placeholder", () => {
    const pata = dishes.find((d) => d.id === "pata")!;
    expect(pata.image.isStock).toBe(false);
    expect(pata.image.src).toBe("/photos/dish-pata.jpg");
    expect(pata.image.alt.length).toBeGreaterThan(0);
    expect(pata.image.alt).not.toMatch(/stock/i);
  });

  it("gives every dish a non-empty factual blurb and a price", () => {
    for (const d of dishes) {
      expect(d.blurb.trim().length).toBeGreaterThan(0);
      expect(d.price.trim().length).toBeGreaterThan(0);
    }
  });
});
