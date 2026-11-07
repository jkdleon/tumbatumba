"use client";

import { useEffect } from "react";

/**
 * Fades/rises every `[data-reveal]` element as it scrolls into view. Only
 * elements that start BELOW the fold are hidden first, so the first paint never
 * flashes, and with JS off (or no IntersectionObserver) nothing is hidden.
 */
export function ScrollReveal() {
  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return;
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;
    const els = [...document.querySelectorAll<HTMLElement>("[data-reveal]")].filter(
      (el) => el.getBoundingClientRect().top > window.innerHeight,
    );
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          e.target.classList.remove("reveal-pending");
          io.unobserve(e.target);
        }
      },
      { rootMargin: "0px 0px -8% 0px" },
    );
    for (const el of els) {
      el.classList.add("reveal-pending");
      io.observe(el);
    }
    return () => io.disconnect();
  }, []);
  return null;
}
