"use client";

import { useEffect, useState } from "react";
import { formatHours, openNow, type Hours, type OpenNowResult } from "@/lib/openNow";

const PILL =
  "pop inline-flex items-center gap-2 rounded-full bg-night px-4 py-1.5 font-display text-sm font-bold text-fg ";

export function OpenNowBadge({ hours, className = "" }: { hours: Hours; className?: string }) {
  // Stable, time-independent first paint (no hydration mismatch, no false
  // "Open now" baked into the static HTML). The effect fills in the live label.
  const [state, setState] = useState<OpenNowResult | null>(null);

  useEffect(() => {
    const tick = () => setState(openNow(hours, new Date()));
    tick();
    const id = setInterval(tick, 60_000);
    return () => clearInterval(id);
  }, [hours]);

  const open = state?.open ?? false;
  return (
    <span data-open={open} aria-busy={state ? undefined : true} className={PILL + className}>
      <span aria-hidden="true" className="relative flex h-2.5 w-2.5">
        {open && (
          <span className="absolute inline-flex h-full w-full rounded-full bg-lime opacity-60 motion-safe:animate-ping" />
        )}
        <span
          className={
            "relative inline-flex h-2.5 w-2.5 rounded-full " + (open ? "bg-lime" : "bg-hot")
          }
        />
      </span>
      {state ? state.label : `Daily ${formatHours(hours)}`}
    </span>
  );
}
