"use client";

import { useEffect, useState } from "react";
import { restaurant } from "@/content/restaurant";
import { CtaButton } from "@/components/CtaButton";

const NAV = [
  { href: "#menu", label: "Menu" },
  { href: "#story", label: "Story" },
  { href: "#visit", label: "Visit" },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header className="sticky top-0 z-40 border-b border-ink-invert/15 bg-ink/90 backdrop-blur">
      <div className="mx-auto flex w-[min(100%-2.5rem,70rem)] items-center justify-between gap-4 py-3">
        <a href="#top" className="flex items-center gap-3" aria-label={`${restaurant.name} — home`}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.jpg" alt="" width={44} height={44} className="rounded-full" />
          <span className="font-display text-lg font-bold leading-none text-ink-invert">
            {restaurant.shortName}
          </span>
        </a>

        <nav aria-label="Primary" className="flex items-center gap-4">
          <button
            type="button"
            className="min-h-11 rounded-theme border border-current px-3 py-2 text-sm text-ink-invert md:hidden"
            aria-expanded={open}
            aria-controls="site-nav"
            aria-label={open ? "Close menu" : "Menu"}
            onClick={() => setOpen((v) => !v)}
          >
            Menu
          </button>

          <ul
            id="site-nav"
            className={
              "absolute inset-x-0 top-full flex-col gap-1 border-b border-ink-invert/15 bg-ink p-4 " +
              "md:static md:flex md:flex-row md:items-center md:gap-5 md:border-0 md:bg-transparent md:p-0 " +
              (open ? "flex" : "hidden md:flex")
            }
            onClick={(e) => {
              if ((e.target as HTMLElement).closest("a")) setOpen(false);
            }}
          >
            {NAV.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  className="block py-2 text-ink-invert hover:text-accent-strong md:py-0"
                >
                  {item.label}
                </a>
              </li>
            ))}
            <li>
              <CtaButton href={restaurant.phone.landlineHref} className="w-full md:w-auto">
                Call to order
              </CtaButton>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
