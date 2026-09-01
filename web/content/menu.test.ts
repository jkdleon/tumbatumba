import { describe, expect, it } from "vitest";
import { menuGroups, printedMenuHref } from "@/content/menu";

describe("menu content", () => {
  it("has the four confirmed groups in order", () => {
    expect(menuGroups.map((g) => g.label)).toEqual([
      "Pork",
      "Must Try",
      "Pancit by the Bilao",
      "Extras",
    ]);
  });

  it("keeps Crispy Pata's dual price string verbatim", () => {
    const pork = menuGroups.find((g) => g.id === "pork")!;
    const pata = pork.items.find((i) => i.name === "Crispy Pata")!;
    expect(pata.price).toBe("870 XL · 900 Jumbo");
  });

  it("keeps the pancit +₱50 note", () => {
    const pancit = menuGroups.find((g) => g.id === "pancit")!;
    expect(pancit.note).toBe(
      "Choice of bihon or mix (canton–bihon). Add ₱50 for sotanghon or canton.",
    );
  });

  it("keeps the Tokwa't Baboy minimum-order qualifier", () => {
    const pork = menuGroups.find((g) => g.id === "pork")!;
    const tokwa = pork.items.find((i) => i.name === "Tokwa't Baboy")!;
    expect(tokwa.qualifier).toBe("min. 2 orders");
  });

  it("has 5 pork, 4 must-try, 4 pancit, 2 extras items", () => {
    expect(menuGroups.map((g) => g.items.length)).toEqual([5, 4, 4, 2]);
  });

  it("links the printed menu photo", () => {
    expect(printedMenuHref).toBe("/menu.jpg");
  });

  it("matches the full confirmed structure exactly", () => {
    expect(menuGroups).toEqual([
      {
        id: "pork",
        label: "Pork",
        items: [
          { name: "Crispy Pata", price: "870 XL · 900 Jumbo" },
          { name: "Crispy Ulo", price: "900" },
          { name: "Lumpiang Shanghai", qualifier: "10 pcs", price: "200" },
          { name: "Tokwa't Baboy", qualifier: "min. 2 orders", price: "200" },
          { name: "Big Siomai", qualifier: "5 pcs", price: "50" },
        ],
      },
      {
        id: "must-try",
        label: "Must Try",
        items: [
          { name: "Cheese Sticks", qualifier: "25 pcs", price: "60" },
          { name: "Cheese Sticks", qualifier: "homemade, 50 pcs", price: "120" },
          { name: "Lengua Asado", price: "200" },
          { name: "Sisig", price: "200" },
        ],
      },
      {
        id: "pancit",
        label: "Pancit by the Bilao",
        wide: true,
        note: "Choice of bihon or mix (canton–bihon). Add ₱50 for sotanghon or canton.",
        items: [
          { name: "Small Bilao", qualifier: "good for 3–4", price: "350" },
          { name: "Medium Bilao", qualifier: "good for 5–7", price: "450" },
          { name: "Large Bilao", qualifier: "good for 8–10", price: "650" },
          { name: "XL Bilao", qualifier: "good for 11–15", price: "850" },
        ],
      },
      {
        id: "extras",
        label: "Extras",
        items: [
          { name: "Suka", price: "10" },
          { name: "Sweet Chili", price: "15" },
        ],
      },
    ]);
  });
});
