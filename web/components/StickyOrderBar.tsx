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
        "fixed inset-x-3 bottom-3 z-50 flex gap-2 rounded-full border-2 border-fg bg-night p-1.5",
        "shadow-[4px_4px_0_0_var(--color-fg)] md:inset-x-auto md:right-6 md:bottom-6",
        "motion-safe:transition-[transform,opacity] motion-safe:duration-300",
        // Desktop: hidden until the hero scrolls away (and out of the tab order).
        // Mobile: always present.
        revealed ? "md:translate-y-0" : "md:pointer-events-none md:invisible md:translate-y-[150%]",
      ].join(" ")}
    >
      <a
        href={restaurant.phone.landlineHref}
        className="flex flex-1 items-center justify-center rounded-full bg-hot px-5 py-3 text-center font-display font-bold text-on-bright hover:bg-hot-2"
      >
        <span className="sm:hidden">Call to order</span>
        <span className="hidden sm:inline">Call to order — {restaurant.phone.landlineDisplay}</span>
      </a>
      <a
        href={restaurant.socials.messenger}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Message on Facebook"
        className="flex items-center justify-center rounded-full bg-fg px-5 py-3 font-display font-bold text-night hover:bg-fg/85"
      >
        Message
      </a>
    </div>
  );
}
