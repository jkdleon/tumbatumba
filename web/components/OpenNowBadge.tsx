"use client";

import { useEffect, useState } from "react";
import { formatHours, openNow, type Hours, type OpenNowResult } from "@/lib/openNow";

const PILL =
  "inline-flex items-center gap-2 rounded-full border border-current px-3 py-1 text-sm font-medium ";

export function OpenNowBadge({ hours, className = "" }: { hours: Hours; className?: string }) {
  // Start from a stable, time-independent value so SSR / first client paint
  // never bake in a clock-specific label (hydration mismatch + false "Open now"
  // for crawlers/no-JS overnight). The effect below fills in the real label on
  // mount, synchronously in tests.
  const [state, setState] = useState<OpenNowResult | null>(null);

  useEffect(() => {
    const tick = () => setState(openNow(hours, new Date()));
    tick();
    const id = setInterval(tick, 60_000);
    return () => clearInterval(id);
  }, [hours]);

  if (!state) {
    return (
      <span data-open={false} aria-busy="true" className={PILL + className}>
        <span aria-hidden="true" className="h-2 w-2 rounded-full bg-ink/40" />
        {formatHours(hours)}
      </span>
    );
  }

  return (
    <span data-open={state.open} className={PILL + className}>
      <span
        aria-hidden="true"
        className={
          "h-2 w-2 rounded-full " + (state.open ? "bg-sage motion-safe:animate-pulse" : "bg-ink/40")
        }
      />
      {state.label}
    </span>
  );
}
