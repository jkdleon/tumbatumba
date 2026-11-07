import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { SocialFeed } from "@/components/SocialFeed";
import { press } from "@/content/press";

describe("SocialFeed", () => {
  it("renders one reel card per vlog, linking out to Facebook safely", () => {
    render(<SocialFeed />);
    const links = screen.getAllByRole("link", { name: /^watch /i });
    expect(links.map((l) => l.getAttribute("href"))).toEqual(press.vloggers.map((v) => v.url));
    for (const l of links) expect(l).toHaveAttribute("rel", expect.stringContaining("noopener"));
  });

  it("hides the unconfirmed TV feature and rating instead of showing placeholders", () => {
    const { container } = render(<SocialFeed />);
    expect(container.textContent).not.toMatch(/as seen on|\[rating\]|pending/i);
  });

  it("invites tags with the real handle", () => {
    render(<SocialFeed />);
    expect(screen.getByText(press.facebook.tagHandle)).toBeInTheDocument();
  });
});
