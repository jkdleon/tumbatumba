import { beforeAll, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { StickyOrderBar } from "@/components/StickyOrderBar";

// jsdom lacks IntersectionObserver; stub it so the component mounts.
beforeAll(() => {
  vi.stubGlobal(
    "IntersectionObserver",
    class {
      observe() {}
      disconnect() {}
      unobserve() {}
    },
  );
});

describe("StickyOrderBar", () => {
  it("renders a call action to the landline", () => {
    render(<StickyOrderBar />);
    expect(screen.getByRole("link", { name: /call to order/i })).toHaveAttribute(
      "href",
      "tel:+63285708560",
    );
  });

  it("renders a Messenger action with rel=noopener", () => {
    render(<StickyOrderBar />);
    const msg = screen.getByRole("link", { name: /message on facebook/i });
    expect(msg).toHaveAttribute("href", "https://m.me/alingnenetumbatumba");
    expect(msg).toHaveAttribute("rel", expect.stringContaining("noopener"));
  });
});
