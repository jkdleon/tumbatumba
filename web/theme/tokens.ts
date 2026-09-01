export type ThemeName = "carinderia" | "heritage";

export interface ThemeLayout {
  /** Tailwind class for vertical section rhythm, e.g. "py-20". */
  sectionPaddingY: string;
  heroAlign: "center" | "start";
  menuTreatment: "board" | "editorial";
  /** Short fade/rise on section entry (respect prefers-reduced-motion). */
  sectionEntryAnimation: boolean;
}

export interface Theme {
  name: ThemeName;
  /** Keys WITHOUT the `--t-` prefix; ThemeProvider adds it. */
  cssVars: Record<string, string>;
  layout: ThemeLayout;
  motion: "full" | "minimal";
}
