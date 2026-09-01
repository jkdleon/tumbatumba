export interface MenuItem {
  name: string;
  qualifier?: string;
  price: string;
}

export interface MenuGroup {
  id: string;
  label: string;
  note?: string;
  wide?: boolean;
  items: MenuItem[];
}

/** Full price list, four groups. Verbatim from site/index.html (confirmed 2026-09-01). */
export const menuGroups: MenuGroup[] = [
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
];

export const printedMenuHref = "/menu.jpg";
