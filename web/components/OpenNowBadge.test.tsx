import { afterEach, describe, expect, it, vi } from "vitest";
import { render } from "@testing-library/react";
import { OpenNowBadge } from "@/components/OpenNowBadge";
import { restaurant } from "@/content/restaurant";

afterEach(() => vi.useRealTimers());

describe("OpenNowBadge", () => {
  it("says open during Manila business hours", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-09-01T05:00:00Z")); // 1 PM Manila
    const { container } = render(<OpenNowBadge hours={restaurant.hours} />);
    expect(container.textContent).toContain("Open now · closes 10 PM");
    expect(container.firstElementChild).toHaveAttribute("data-open", "true");
  });

  it("says closed overnight", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-09-01T16:00:00Z")); // midnight Manila
    const { container } = render(<OpenNowBadge hours={restaurant.hours} />);
    expect(container.textContent).toContain("Closed · opens 9 AM");
  });
});
