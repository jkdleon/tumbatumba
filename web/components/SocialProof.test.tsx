import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { SocialProof } from "@/components/SocialProof";
import { ThemeProvider } from "@/components/ThemeProvider";
import { kusina } from "@/theme/kusina";
import { press } from "@/content/press";

function mount() {
  return render(
    <ThemeProvider theme={kusina}>
      <SocialProof />
    </ThemeProvider>,
  );
}

describe("SocialProof", () => {
  it("shows the Facebook tag handle", () => {
    mount();
    expect(screen.getByText(/@alingnenetumbatumba/)).toBeInTheDocument();
  });

  it("flags the unconfirmed press content instead of inventing it", () => {
    mount();
    expect(screen.getAllByText(/pending|content pending|to be supplied/i).length).toBeGreaterThan(
      0,
    );
  });

  it("renders no iframes (link-out only, spec §9.4a)", () => {
    const { container } = mount();
    expect(container.querySelector("iframe")).toBeNull();
  });

  it("renders each vlog as an external link-out card", () => {
    mount();
    const links = screen
      .getAllByRole("link")
      .filter((a) => a.getAttribute("href")?.includes("facebook.com/share/v/"));
    expect(links).toHaveLength(press.vloggers.length);
    for (const a of links) {
      expect(a).toHaveAttribute("target", "_blank");
      expect(a).toHaveAttribute("rel", "noopener noreferrer");
    }
    expect(screen.getAllByText(/watch on facebook/i)).toHaveLength(press.vloggers.length);
  });
});
