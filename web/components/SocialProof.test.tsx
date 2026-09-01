import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { SocialProof } from "@/components/SocialProof";
import { ThemeProvider } from "@/components/ThemeProvider";
import { carinderia } from "@/theme/carinderia";

function mount() {
  return render(
    <ThemeProvider theme={carinderia}>
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
});
