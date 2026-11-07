"use client";

import { useEffect, useState } from "react";
import { restaurant } from "@/content/restaurant";
import { CtaButton } from "@/components/CtaButton";
import { NAV } from "@/content/nav";

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header
      className={
        "sticky top-0 z-40 bg-night/90 backdrop-blur-md transition-[border-color,box-shadow] " +
        (scrolled || open ? "border-b-2 border-fg" : "border-b-2 border-transparent")
      }
    >
      <div className="wrap flex items-center justify-between gap-4 py-3">
        <a
          href="#top"
          className="group flex items-center gap-3"
          aria-label={`${restaurant.name} — home`}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logo.jpg"
            alt=""
            width={48}
            height={48}
            className="pop h-12 w-12 rounded-full motion-safe:transition-transform motion-safe:group-hover:rotate-12"
          />
          <span className="leading-none">
            <span className="block font-display text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-lime">
              Aling Nene&apos;s
            </span>
            <span className="block font-display text-xl font-extrabold tracking-tight">
              Tumba Tumba
            </span>
          </span>
        </a>

        <nav aria-label="Primary" className="flex items-center gap-3">
          <ul
            id="site-nav"
            className={
              "absolute inset-x-0 top-full flex-col gap-1 border-b-2 border-fg bg-night p-4 " +
              "lg:static lg:flex lg:flex-row lg:items-center lg:gap-1 lg:border-0 lg:bg-transparent lg:p-0 " +
              (open ? "flex" : "hidden lg:flex")
            }
            onClick={(e) => {
              if ((e.target as HTMLElement).closest("a")) setOpen(false);
            }}
          >
            {NAV.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  className="block rounded-full px-4 py-3 font-display font-semibold hover:bg-fg hover:text-night lg:py-2"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
          <span className="hidden sm:block">
            <CtaButton href={restaurant.phone.landlineHref}>Call to order</CtaButton>
          </span>
          <button
            type="button"
            className="pop min-h-12 rounded-full bg-yellow px-5 font-display font-bold text-on-bright lg:hidden"
            aria-expanded={open}
            aria-controls="site-nav"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? "Close" : "Menu"}
          </button>
        </nav>
      </div>
    </header>
  );
}
