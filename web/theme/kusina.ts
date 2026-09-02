import type { Theme } from "@/theme/tokens";

/**
 * "Kusina" (route "/"): warm and appetite-first — the food shot on a dark
 * ground so the fried skin carries the page. Palette is the existing
 * menu/logo tokens inverted onto a warm-charcoal ground.
 *
 * Renamed from "carinderia" 2026-09-02: the family confirmed this is a
 * restaurant with a supplier, a chiller and a reservation book, not a
 * carinderia, and the theme name was reading as a positioning claim.
 * Token VALUES are unchanged — they came from the client's printed menu and
 * logo and are pinned by docs/superpowers/specs/2026-09-01-*-design.md.
 */
export const kusina: Theme = {
  name: "kusina",
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
