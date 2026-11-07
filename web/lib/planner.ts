/**
 * Barkada Planner — pure logic. Picks bilao sizes for a head-count and totals an
 * estimate. Prices and "good for" ranges mirror content/menu.ts (locked by
 * planner.test.ts). This is an estimate helper, not a cart: the order is still
 * placed by call, text or Messenger.
 */

export interface Bilao {
  id: "small" | "medium" | "large" | "xl";
  label: string;
  min: number;
  max: number;
  price: number;
}

export const BILAOS: Bilao[] = [
  { id: "small", label: "Small Bilao", min: 3, max: 4, price: 350 },
  { id: "medium", label: "Medium Bilao", min: 5, max: 7, price: 450 },
  { id: "large", label: "Large Bilao", min: 8, max: 10, price: 650 },
  { id: "xl", label: "XL Bilao", min: 11, max: 15, price: 850 },
];

export type Noodle = "bihon" | "mix" | "sotanghon" | "canton";

export const NOODLES: { id: Noodle; label: string; surcharge: number }[] = [
  { id: "bihon", label: "Bihon", surcharge: 0 },
  { id: "mix", label: "Mix (canton–bihon)", surcharge: 0 },
  { id: "sotanghon", label: "Sotanghon", surcharge: 50 },
  { id: "canton", label: "Canton", surcharge: 50 },
];

export interface AddOn {
  id: string;
  label: string;
  price: number;
}

export const ADD_ONS: AddOn[] = [
  { id: "pata-xl", label: "Crispy Pata (XL)", price: 870 },
  { id: "pata-jumbo", label: "Crispy Pata (Jumbo)", price: 900 },
  { id: "ulo", label: "Crispy Ulo (half head)", price: 900 },
  { id: "sisig", label: "Sisig", price: 200 },
  { id: "lengua", label: "Lengua Asado", price: 200 },
  { id: "shanghai", label: "Lumpiang Shanghai (10 pcs)", price: 200 },
];

export const MIN_GUESTS = 2;
export const MAX_GUESTS = 60;

/**
 * Fewest bilaos that cover `guests`: as many XLs as needed for the bulk, then
 * the smallest single bilao that covers the remainder.
 */
export function recommendBilaos(guests: number): Bilao[] {
  const n = Math.max(1, Math.round(guests));
  const xl = BILAOS[BILAOS.length - 1];
  const picks: Bilao[] = [];
  let remaining = n;
  while (remaining > xl.max) {
    picks.push(xl);
    remaining -= xl.max;
  }
  picks.push(BILAOS.find((b) => b.max >= remaining)!);
  return picks;
}

export interface PlanLine {
  label: string;
  qty: number;
  unit: number;
  subtotal: number;
}

export interface Plan {
  lines: PlanLine[];
  total: number;
}

export function buildPlan(
  guests: number,
  noodle: Noodle,
  addOns: Record<string, number>,
  includePancit = true,
): Plan {
  const lines: PlanLine[] = [];
  if (includePancit) {
    const surcharge = NOODLES.find((x) => x.id === noodle)!.surcharge;
    const counts = new Map<Bilao, number>();
    for (const b of recommendBilaos(guests)) counts.set(b, (counts.get(b) ?? 0) + 1);
    const noodleLabel = NOODLES.find((x) => x.id === noodle)!.label;
    for (const [b, qty] of counts) {
      const unit = b.price + surcharge;
      lines.push({ label: `${b.label} — ${noodleLabel}`, qty, unit, subtotal: unit * qty });
    }
  }
  for (const a of ADD_ONS) {
    const qty = addOns[a.id] ?? 0;
    if (qty > 0) lines.push({ label: a.label, qty, unit: a.price, subtotal: a.price * qty });
  }
  return { lines, total: lines.reduce((s, l) => s + l.subtotal, 0) };
}

export const peso = (n: number) => `₱${n.toLocaleString("en-PH")}`;

/** Plain-text order the customer can paste into Messenger or send by SMS. */
export function orderMessage(guests: number, plan: Plan): string {
  const rows = plan.lines.map((l) => `• ${l.qty} × ${l.label} — ${peso(l.subtotal)}`);
  return [
    `Hi Aling Nene's! Order inquiry for ${guests} people:`,
    ...rows,
    `Estimated total: ${peso(plan.total)}`,
    "Pick-up date/time: ",
    "Name: ",
  ].join("\n");
}
