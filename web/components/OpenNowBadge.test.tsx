import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { renderToString } from "react-dom/server";
import { OpenNowBadge } from "@/components/OpenNowBadge";
import type { Hours } from "@/lib/openNow";

const HOURS: Hours = { open: "09:00", close: "22:00", tz: "Asia/Manila", days: "daily" };

describe("OpenNowBadge", () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it("shows the open label when open in Manila", () => {
    vi.setSystemTime(new Date("2026-09-01T05:00:00Z")); // 13:00 Manila
    render(<OpenNowBadge hours={HOURS} />);
    expect(screen.getByText(/Open now · closes 10 PM/)).toBeInTheDocument();
    expect(screen.getByText(/Open now/).closest("[data-open]")).toHaveAttribute(
      "data-open",
      "true",
    );
  });

  it("shows the closed label when closed in Manila", () => {
    vi.setSystemTime(new Date("2026-09-01T15:00:00Z")); // 23:00 Manila
    render(<OpenNowBadge hours={HOURS} />);
    expect(screen.getByText(/Closed · opens 9 AM/)).toBeInTheDocument();
    expect(screen.getByText(/Closed/).closest("[data-open]")).toHaveAttribute("data-open", "false");
  });

  it("server markup does not depend on the clock (no hydration mismatch)", () => {
    // Effects do not run during renderToString, so both calls render the
    // time-independent skeleton — identical bytes regardless of the wall clock.
    vi.setSystemTime(new Date("2026-09-01T05:00:00Z")); // 13:00 Manila — open
    const openMarkup = renderToString(<OpenNowBadge hours={HOURS} />);
    vi.setSystemTime(new Date("2026-09-01T15:00:00Z")); // 23:00 Manila — closed
    const closedMarkup = renderToString(<OpenNowBadge hours={HOURS} />);
    expect(openMarkup).toBe(closedMarkup);
  });
});
