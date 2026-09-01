export interface Hours {
  open: string; // "HH:MM", 24-hour
  close: string; // "HH:MM", 24-hour
  tz: string; // IANA timezone, e.g. "Asia/Manila"
  days: string;
}

export interface OpenNowResult {
  open: boolean;
  label: string;
}

function minutesInZone(now: Date, tz: string): number {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: tz,
    hour12: false,
    hour: "2-digit",
    minute: "2-digit",
  }).formatToParts(now);
  const hour = Number(parts.find((p) => p.type === "hour")?.value ?? "0") % 24;
  const minute = Number(parts.find((p) => p.type === "minute")?.value ?? "0");
  return hour * 60 + minute;
}

function toMinutes(hhmm: string): number {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
}

function formatClock(totalMinutes: number): string {
  const h = Math.floor(totalMinutes / 60);
  const m = totalMinutes % 60;
  const ampm = h < 12 ? "AM" : "PM";
  const h12 = ((h + 11) % 12) + 1;
  return m === 0 ? `${h12} ${ampm}` : `${h12}:${String(m).padStart(2, "0")} ${ampm}`;
}

/**
 * Given the restaurant's hours and a moment in time, decide whether it is
 * currently open — evaluated in the restaurant's timezone, not the visitor's.
 * Pure: `now` is always supplied by the caller. Assumes open/close fall within
 * the same calendar day (true for the confirmed 09:00–22:00).
 */
export function openNow(hours: Hours, now: Date): OpenNowResult {
  const current = minutesInZone(now, hours.tz);
  const openAt = toMinutes(hours.open);
  const closeAt = toMinutes(hours.close);
  const isOpen = current >= openAt && current < closeAt;
  return isOpen
    ? { open: true, label: `Open now · closes ${formatClock(closeAt)}` }
    : { open: false, label: `Closed · opens ${formatClock(openAt)}` };
}

/** "9 AM – 10 PM" style range from an hours config. */
export function formatHours(hours: Pick<Hours, "open" | "close">): string {
  return `${formatClock(toMinutes(hours.open))} – ${formatClock(toMinutes(hours.close))}`;
}
