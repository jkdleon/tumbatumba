import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SiteHeader } from "@/components/SiteHeader";
import { ThemeProvider } from "@/components/ThemeProvider";
import { carinderia } from "@/theme/carinderia";

function mount() {
  return render(
    <ThemeProvider theme={carinderia}>
      <SiteHeader />
    </ThemeProvider>,
  );
}

describe("SiteHeader", () => {
  it("renders the three primary nav links", () => {
    mount();
    expect(screen.getByRole("link", { name: /menu/i })).toHaveAttribute("href", "#menu");
    expect(screen.getByRole("link", { name: /story/i })).toHaveAttribute("href", "#story");
    expect(screen.getByRole("link", { name: /visit/i })).toHaveAttribute("href", "#visit");
  });

  it("renders a call-to-order CTA to the landline", () => {
    mount();
    expect(screen.getByRole("link", { name: /call to order/i })).toHaveAttribute(
      "href",
      "tel:+63285708560",
    );
  });

  it("toggles the mobile nav's aria-expanded", async () => {
    const user = userEvent.setup();
    mount();
    const toggle = screen.getByRole("button", { name: /menu/i });
    expect(toggle).toHaveAttribute("aria-expanded", "false");
    await user.click(toggle);
    expect(toggle).toHaveAttribute("aria-expanded", "true");
    await user.keyboard("{Escape}");
    expect(toggle).toHaveAttribute("aria-expanded", "false");
  });
});
