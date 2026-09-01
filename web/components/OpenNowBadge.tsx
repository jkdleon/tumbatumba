"use client";

import { useEffect, useState } from "react";
import { openNow, type Hours, type OpenNowResult } from "@/lib/openNow";

export function OpenNowBadge({ hours, className = "" }: { hours: Hours; className?: string }) {
  const [state, setState] = useState<OpenNowResult>(() => openNow(hours, new Date()));

  useEffect(() => {
    const tick = () => setState(openNow(hours, new Date()));
    tick();
    const id = setInterval(tick, 60_000);
    return () => clearInterval(id);
  }, [hours]);

  return (
    <span
      data-open={state.open}
      className={
        "inline-flex items-center gap-2 rounded-full border border-current px-3 py-1 " +
        "text-sm font-medium " +
        className
      }
    >
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
