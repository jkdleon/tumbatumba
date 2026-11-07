import { describe, expect, it } from "vitest";
import { fireEvent, render, screen, within } from "@testing-library/react";
import { SocialFeed } from "@/components/SocialFeed";
import { press } from "@/content/press";

const reels = () => screen.getAllByRole("link", { name: /^play /i });

describe("SocialFeed", () => {
  it("renders one reel per vlog, each a real link to the video as a no-JS fallback", () => {
    render(<SocialFeed />);
    expect(reels().map((l) => l.getAttribute("href"))).toEqual(press.vloggers.map((v) => v.url));
    for (const l of reels()) {
      expect(l).toHaveAttribute("rel", expect.stringContaining("noopener"));
      expect(l).toHaveAttribute("aria-haspopup", "dialog");
    }
  });

  it("loads nothing from Facebook until a reel is tapped", () => {
    const { container } = render(<SocialFeed />);
    expect(container.querySelector("iframe")).toBeNull();
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("tapping a reel opens the popup with the Facebook player for that video", () => {
    render(<SocialFeed />);
    fireEvent.click(reels()[1]);
    const dialog = screen.getByRole("dialog");
    const frame = dialog.querySelector("iframe")!;
    const src = new URL(frame.getAttribute("src")!);
    expect(src.origin + src.pathname).toBe("https://www.facebook.com/plugins/video.php");
    expect(src.searchParams.get("href")).toBe(press.vloggers[1].url);
    expect(frame).toHaveAttribute("title", expect.stringMatching(/video player/i));
    expect(within(dialog).getByRole("link", { name: /watch it on facebook/i })).toHaveAttribute(
      "href",
      press.vloggers[1].url,
    );
  });

  it("prefers embedUrl over the share link when one is set", async () => {
    const original = press.vloggers[0].embedUrl;
    press.vloggers[0].embedUrl = "https://www.facebook.com/reel/123";
    try {
      render(<SocialFeed />);
      fireEvent.click(reels()[0]);
      const src = new URL(screen.getByRole("dialog").querySelector("iframe")!.getAttribute("src")!);
      expect(src.searchParams.get("href")).toBe("https://www.facebook.com/reel/123");
    } finally {
      press.vloggers[0].embedUrl = original;
    }
  });

  it("moves focus into the popup, closes on Esc and the close button, and restores focus", () => {
    render(<SocialFeed />);
    const card = reels()[0];
    card.focus();
    fireEvent.click(card);
    expect(screen.getByRole("button", { name: /close video/i })).toHaveFocus();
    expect(document.body.style.overflow).toBe("hidden");

    fireEvent.keyDown(document, { key: "Escape" });
    expect(screen.queryByRole("dialog")).toBeNull();
    expect(card).toHaveFocus();
    expect(document.body.style.overflow).toBe("");

    fireEvent.click(reels()[2]);
    fireEvent.click(screen.getByRole("button", { name: /close video/i }));
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("lets ctrl/cmd-click open the video in a new tab instead of the popup", () => {
    render(<SocialFeed />);
    fireEvent.click(reels()[0], { ctrlKey: true });
    expect(screen.queryByRole("dialog")).toBeNull();
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
