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
});
