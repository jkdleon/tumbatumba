"use client";

import { useEffect, useState } from "react";
import { restaurant } from "@/content/restaurant";

export function StickyOrderBar() {
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const sentinel = document.getElementById("hero-end");
    if (!sentinel || typeof IntersectionObserver === "undefined") {
      setRevealed(true);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => setRevealed(!entry.isIntersecting && entry.boundingClientRect.top < 0),
      { threshold: 0 },
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      className={[
        "fixed inset-x-0 bottom-0 z-50 flex gap-2 border-t border-ink-invert/15 bg-ink/95 p-3",
        "backdrop-blur translate-y-0",
        "motion-safe:transition-transform motion-safe:duration-[var(--t-motion-slide)]",
        // Desktop-only: when hidden below the fold, drop it from the tab order and
        // AT tree too. `md:invisible` scopes this to >=md; mobile (base, no `md:`)
        // stays visible and interactive since the bar never leaves the screen there.
        revealed ? "md:translate-y-0" : "md:translate-y-full md:invisible md:pointer-events-none",
      ].join(" ")}
    >
      <a
        href={restaurant.phone.landlineHref}
        className="flex-1 rounded-theme bg-accent px-4 py-3 text-center font-semibold text-ink-invert hover:bg-accent-strong"
      >
        Call to order — {restaurant.phone.landlineDisplay}
      </a>
      <a
        href={restaurant.socials.messenger}
        rel="noopener"
        className="rounded-theme border border-current px-4 py-3 text-center font-semibold text-ink-invert hover:text-accent-strong"
      >
        Message on Facebook
      </a>
    </div>
  );
}
