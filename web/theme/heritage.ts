import type { Theme } from "@/theme/tokens";

/**
 * "Heritage kitchen" (route "/heritage"): editorial, premium, trust-led — a
 * decades-old institution. Bone/ivory canvas, refined existing tokens, more
 * whitespace, minimal motion.
 */
export const heritage: Theme = {
  name: "heritage",
  cssVars: {
    canvas: "#f7f0e6", // bone/ivory
    "surface-1": "#f7f0e6",
    "surface-2": "#fdf9f1", // slightly lifted panel
    ink: "#241c15", // existing --ink
    "ink-invert": "#f7f0e6", // text on the rare dark block
    accent: "#a5211a", // existing --brick
    "accent-strong": "#7c1611", // existing --brick-deep
    gold: "#e0983f",
    sage: "#93ab72", // hairline accents
    "font-display": "var(--font-fraunces), Georgia, 'Times New Roman', serif",
    "font-body": "var(--font-newsreader), Georgia, 'Times New Roman', serif",
    radius: "0.125rem",
    "motion-fast": "200ms",
    "motion-slide": "0ms",
  },
  layout: {
    sectionPaddingY: "py-28",
    heroAlign: "start",
    menuTreatment: "editorial",
    sectionEntryAnimation: true,
  },
  motion: "minimal",
};
