import { describe, expect, it } from "vitest";
import { dishes } from "@/content/dishes";

describe("dishes content", () => {
  it("has the four signature dishes", () => {
    expect(dishes.map((d) => d.name)).toEqual([
      "Crispy Pata",
      "Crispy Ulo",
      "Sisig",
      "Pancit by the Bilao",
    ]);
  });

  it("never points at a stock placeholder", () => {
    for (const d of dishes) {
      if (d.image) expect(d.image.src.startsWith("/photos/")).toBe(true);
    }
  });

  it("crispy pata and crispy ulo have the family's own photos", () => {
    for (const id of ["pata", "ulo"]) {
      const dish = dishes.find((d) => d.id === id)!;
      expect(dish.image?.src).toBe(`/photos/dish-${id}.jpg`);
      expect(dish.image?.alt.length).toBeGreaterThan(0);
    }
  });

  it("sisig and pancit render as photo-less tiles until real photos arrive", () => {
    expect(dishes.find((d) => d.id === "sisig")!.image).toBeUndefined();
    expect(dishes.find((d) => d.id === "pancit")!.image).toBeUndefined();
  });

  it("gives every dish a tag, a factual blurb and a price", () => {
    for (const d of dishes) {
      expect(d.tag.trim().length).toBeGreaterThan(0);
      expect(d.blurb.trim().length).toBeGreaterThan(0);
      expect(d.price.trim().length).toBeGreaterThan(0);
    }
  });
});
