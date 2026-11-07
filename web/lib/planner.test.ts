import { describe, expect, it } from "vitest";
import {
  ADD_ONS,
  BILAOS,
  buildPlan,
  NOODLES,
  orderMessage,
  peso,
  recommendBilaos,
} from "@/lib/planner";
import { menuGroups } from "@/content/menu";

const ids = (g: number) => recommendBilaos(g).map((b) => b.id);

describe("planner stays in sync with the confirmed menu", () => {
  it("bilao prices and 'good for' ranges match content/menu.ts", () => {
    const pancit = menuGroups.find((g) => g.id === "pancit")!;
    expect(pancit.items.map((i) => [i.name, i.qualifier, i.price])).toEqual(
      BILAOS.map((b) => [b.label, `good for ${b.min}–${b.max}`, String(b.price)]),
    );
  });

  it("noodle surcharges match the +₱50 note", () => {
    expect(menuGroups.find((g) => g.id === "pancit")!.note).toContain(
      "Add ₱50 for sotanghon or canton",
    );
    expect(NOODLES.filter((n) => n.surcharge === 50).map((n) => n.id)).toEqual([
      "sotanghon",
      "canton",
    ]);
  });

  it("add-on prices match the menu", () => {
    const all = menuGroups.flatMap((g) => g.items);
    const price = (name: string) => all.find((i) => i.name === name)!.price;
    expect(price("Crispy Pata")).toBe("870 XL · 900 Jumbo");
    const byId = Object.fromEntries(ADD_ONS.map((a) => [a.id, a.price]));
    expect(byId["pata-xl"]).toBe(870);
    expect(byId["pata-jumbo"]).toBe(900);
    expect(String(byId.ulo)).toBe(price("Crispy Ulo"));
    expect(String(byId.sisig)).toBe(price("Sisig"));
    expect(String(byId.lengua)).toBe(price("Lengua Asado"));
    expect(String(byId.shanghai)).toBe(price("Lumpiang Shanghai"));
  });
});

describe("recommendBilaos", () => {
  it("picks the smallest single bilao that covers the group", () => {
    expect(ids(2)).toEqual(["small"]);
    expect(ids(4)).toEqual(["small"]);
    expect(ids(5)).toEqual(["medium"]);
    expect(ids(10)).toEqual(["large"]);
    expect(ids(11)).toEqual(["xl"]);
    expect(ids(15)).toEqual(["xl"]);
  });

  it("stacks XLs for big groups, then covers the remainder", () => {
    expect(ids(16)).toEqual(["xl", "small"]);
    expect(ids(25)).toEqual(["xl", "large"]);
    expect(ids(30)).toEqual(["xl", "xl"]);
    expect(ids(31)).toEqual(["xl", "xl", "small"]);
  });
});

describe("buildPlan", () => {
  it("totals bilaos, noodle surcharge and add-ons", () => {
    const plan = buildPlan(16, "canton", { "pata-xl": 2, sisig: 1 });
    expect(plan.lines).toEqual([
      { label: "XL Bilao — Canton", qty: 1, unit: 900, subtotal: 900 },
      { label: "Small Bilao — Canton", qty: 1, unit: 400, subtotal: 400 },
      { label: "Crispy Pata (XL)", qty: 2, unit: 870, subtotal: 1740 },
      { label: "Sisig", qty: 1, unit: 200, subtotal: 200 },
    ]);
    expect(plan.total).toBe(3240);
  });

  it("groups identical bilaos into one line", () => {
    const plan = buildPlan(30, "bihon", {});
    expect(plan.lines).toEqual([{ label: "XL Bilao — Bihon", qty: 2, unit: 850, subtotal: 1700 }]);
  });

  it("can skip the pancit", () => {
    expect(buildPlan(8, "bihon", { ulo: 1 }, false).total).toBe(900);
  });
});

describe("orderMessage", () => {
  it("lists every line and the estimate", () => {
    const msg = orderMessage(6, buildPlan(6, "mix", { lengua: 1 }));
    expect(msg).toContain("for 6 people");
    expect(msg).toContain("• 1 × Medium Bilao — Mix (canton–bihon) — ₱450");
    expect(msg).toContain("• 1 × Lengua Asado — ₱200");
    expect(msg).toContain(`Estimated total: ${peso(650)}`);
  });
});
