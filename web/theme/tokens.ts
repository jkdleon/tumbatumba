export type ThemeName = "carinderia" | "heritage";

export interface ThemeLayout {
  /** Tailwind class for vertical section rhythm, e.g. "py-20". */
  sectionPaddingY: string;
  heroAlign: "center" | "start";
  menuTreatment: "board" | "editorial";
  // (Heritage section-entry fade/rise — spec §6 — deferred post-launch)
}

export interface Theme {
  name: ThemeName;
  /** Keys WITHOUT the `--t-` prefix; ThemeProvider adds it. */
  cssVars: Record<string, string>;
  layout: ThemeLayout;
  motion: "full" | "minimal";
}
