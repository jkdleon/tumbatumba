import type { Theme } from "@/theme/tokens";

/**
 * "Carinderia heat" (route "/"): warm, loud, appetite-first — a busy Manila
 * eatery at night. Palette is the existing menu/logo tokens inverted onto a
 * warm-charcoal ground.
 */
export const carinderia: Theme = {
  name: "carinderia",
  cssVars: {
    canvas: "#1a1512", // warm charcoal
    "surface-1": "#f6e7db", // existing --paper (blush)
    "surface-2": "#fbf3e3", // existing --paper-2 (cream)
    ink: "#241c15", // existing --ink (on light surfaces)
    "ink-invert": "#fbf3e3", // text on the charcoal canvas
    accent: "#a5211a", // existing --brick
    "accent-strong": "#d7382a", // brighter chili red for hovers
    gold: "#e0983f", // existing --gold
    sage: "#93ab72", // existing --sage
    "font-display": "var(--font-bricolage), ui-sans-serif, system-ui, sans-serif",
    "font-body": "var(--font-inter), ui-sans-serif, system-ui, sans-serif",
    radius: "0.5rem",
    "motion-fast": "150ms",
    "motion-slide": "320ms",
  },
  layout: {
    sectionPaddingY: "py-20",
    heroAlign: "center",
    menuTreatment: "board",
  },
  motion: "full",
};
