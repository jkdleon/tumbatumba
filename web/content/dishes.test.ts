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

  it("marks every image as stock under /stock/", () => {
    for (const d of dishes) {
      expect(d.image.isStock).toBe(true);
      expect(d.image.src.startsWith("/stock/")).toBe(true);
      expect(d.image.alt.length).toBeGreaterThan(0);
    }
  });

  it("gives every dish a non-empty factual blurb and a price", () => {
    for (const d of dishes) {
      expect(d.blurb.trim().length).toBeGreaterThan(0);
      expect(d.price.trim().length).toBeGreaterThan(0);
    }
  });
});
