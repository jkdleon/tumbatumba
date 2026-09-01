import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { ThemeProvider, useTheme } from "@/components/ThemeProvider";
import { carinderia } from "@/theme/carinderia";

function Probe() {
  const theme = useTheme();
  return <span>theme:{theme.name}</span>;
}

describe("ThemeProvider", () => {
  it("exposes the theme via useTheme()", () => {
    render(
      <ThemeProvider theme={carinderia}>
        <Probe />
      </ThemeProvider>,
    );
    expect(screen.getByText("theme:carinderia")).toBeInTheDocument();
  });

  it("sets every cssVar as a --t-* custom property on the wrapper", () => {
    const { container } = render(
      <ThemeProvider theme={carinderia}>
        <p>hi</p>
      </ThemeProvider>,
    );
    const root = container.querySelector(".theme-root") as HTMLElement;
    expect(root.getAttribute("data-theme")).toBe("carinderia");
    expect(root.style.getPropertyValue("--t-canvas")).toBe("#1a1512");
    expect(root.style.getPropertyValue("--t-accent")).toBe("#a5211a");
  });

  it("throws when useTheme is used with no provider", () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    expect(() => render(<Probe />)).toThrow(/useTheme must be used within/);
    spy.mockRestore();
  });
});
