"use client";

import { createContext, useContext, useMemo, type CSSProperties, type ReactNode } from "react";
import type { Theme } from "@/theme/tokens";

const ThemeContext = createContext<Theme | null>(null);

export function useTheme(): Theme {
  const theme = useContext(ThemeContext);
  if (!theme) {
    throw new Error("useTheme must be used within a <ThemeProvider>");
  }
  return theme;
}

export function ThemeProvider({ theme, children }: { theme: Theme; children: ReactNode }) {
  const style = useMemo(() => {
    const vars: Record<string, string> = {};
    for (const [key, value] of Object.entries(theme.cssVars)) {
      vars[`--t-${key}`] = value;
    }
    return vars as CSSProperties;
  }, [theme]);

  return (
    <ThemeContext.Provider value={theme}>
      <div
        data-theme={theme.name}
        className="theme-root bg-canvas text-ink font-body"
        style={style}
      >
        {children}
      </div>
    </ThemeContext.Provider>
  );
}
