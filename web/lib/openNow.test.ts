import { describe, expect, it } from "vitest";
import { formatHours, openNow, type Hours } from "@/lib/openNow";

const HOURS: Hours = { open: "09:00", close: "22:00", tz: "Asia/Manila", days: "daily" };

describe("openNow", () => {
  it("is open at 13:00 Manila and names the closing time", () => {
    // 2026-09-01 05:00 UTC = 13:00 Asia/Manila (UTC+8, no DST)
    const r = openNow(HOURS, new Date("2026-09-01T05:00:00Z"));
    expect(r.open).toBe(true);
    expect(r.label).toBe("Open now · closes 10 PM");
  });

  it("is closed at 23:00 Manila and names the next opening time", () => {
    const r = openNow(HOURS, new Date("2026-09-01T15:00:00Z")); // 23:00 Manila
    expect(r.open).toBe(false);
    expect(r.label).toBe("Closed · opens 9 AM");
  });

  it("is open exactly at the 09:00 boundary", () => {
    const r = openNow(HOURS, new Date("2026-09-01T01:00:00Z")); // 09:00 Manila
    expect(r.open).toBe(true);
  });

  it("is closed exactly at the 22:00 boundary", () => {
    const r = openNow(HOURS, new Date("2026-09-01T14:00:00Z")); // 22:00 Manila
    expect(r.open).toBe(false);
  });

  it("uses Manila time, not the Date's UTC hours", () => {
    // 20:00 UTC would be "open" in UTC but is 04:00 next day in Manila → closed
    const r = openNow(HOURS, new Date("2026-09-01T20:00:00Z"));
    expect(r.open).toBe(false);
  });

  it("formats the open hours as a human range", () => {
    expect(formatHours({ open: "09:00", close: "22:00" })).toBe("9 AM – 10 PM");
  });
});
