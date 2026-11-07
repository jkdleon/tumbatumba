"use client";

import { useRef, useState, type KeyboardEvent } from "react";
import { menuGroups, printedMenuHref } from "@/content/menu";

const ALL = "all";
const TONES: Record<string, string> = {
  pork: "bg-peach",
  "must-try": "bg-pink",
  pancit: "bg-sage",
  "pre-order": "bg-butter",
  extras: "bg-cream-2",
};

export function MenuBoard() {
  const tabs = [
    { id: ALL, label: "Everything" },
    ...menuGroups.map((g) => ({ id: g.id, label: g.label })),
  ];
  const [active, setActive] = useState(ALL);
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const shown = active === ALL ? menuGroups : menuGroups.filter((g) => g.id === active);

  const onKey = (e: KeyboardEvent, i: number) => {
    const delta = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
    if (!delta) return;
    e.preventDefault();
    const next = (i + delta + tabs.length) % tabs.length;
    setActive(tabs[next].id);
    refs.current[next]?.focus();
  };

  return (
    <section id="menu" className="border-y-2 border-ink bg-cream-2 py-20 sm:py-28">
      <div className="wrap">
        <div data-reveal className="mb-8 flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="font-script text-2xl text-chili">ang menu</p>
            <h2 className="font-display text-5xl font-extrabold uppercase leading-[0.9] tracking-tight sm:text-7xl">
              The whole spread
            </h2>
          </div>
          <a
            href={printedMenuHref}
            className="font-display font-bold underline decoration-2 underline-offset-4 hover:text-chili"
          >
            See the printed menu ↗
          </a>
        </div>

        <div
          role="tablist"
          aria-label="Menu categories"
          className="-mx-4 mb-8 flex gap-2 overflow-x-auto px-4 pb-2 [scrollbar-width:none]"
        >
          {tabs.map((t, i) => (
            <button
              key={t.id}
              ref={(el) => {
                refs.current[i] = el;
              }}
              role="tab"
              id={`tab-${t.id}`}
              aria-selected={active === t.id}
              aria-controls="menu-panel"
              tabIndex={active === t.id ? 0 : -1}
              onClick={() => setActive(t.id)}
              onKeyDown={(e) => onKey(e, i)}
              className={
                "shrink-0 rounded-full border-2 border-ink px-5 py-2.5 font-display font-bold transition-all " +
                (active === t.id
                  ? "bg-ink text-cream shadow-[3px_3px_0_0_var(--color-chili)]"
                  : "bg-cream hover:-translate-y-0.5")
              }
            >
              {t.label}
            </button>
          ))}
        </div>

        <div
          id="menu-panel"
          role="tabpanel"
          aria-labelledby={`tab-${active}`}
          className="grid gap-6 md:grid-cols-2"
        >
          {shown.map((group) => (
            <div
              key={group.id}
              className={`pop rounded-[1.75rem] bg-cream p-6 ${group.wide && active === ALL ? "md:col-span-2" : ""}`}
            >
              <div className="flex flex-wrap items-center gap-3">
                <h3
                  className={`pop rounded-full px-4 py-1 font-display text-xl font-extrabold ${TONES[group.id] ?? "bg-cream-2"}`}
                >
                  {group.label}
                </h3>
                {group.note && <p className="text-sm italic text-ink/75">{group.note}</p>}
              </div>
              <dl
                className={`mt-4 grid gap-x-10 ${group.wide && active === ALL ? "md:grid-cols-2" : ""}`}
              >
                {group.items.map((item, i) => (
                  <div
                    key={`${item.name}-${i}`}
                    className="flex items-baseline gap-3 border-b-2 border-dashed border-ink/15 py-3 last:border-0"
                  >
                    <dt className="font-semibold">
                      {item.name}
                      {item.qualifier && (
                        <span className="ml-2 text-sm font-normal text-ink/65">
                          {item.qualifier}
                        </span>
                      )}
                    </dt>
                    <span aria-hidden="true" className="flex-1" />
                    <dd className="whitespace-nowrap font-display text-lg font-extrabold tabular-nums">
                      <span className="text-sm text-ink/60">₱</span>
                      {item.price}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          ))}
        </div>
        <p className="mt-6 text-sm text-ink/70">
          Prices in pesos. Bilao and platters are made to order — please call ahead so it&apos;s hot
          when you arrive.
        </p>
      </div>
    </section>
  );
}
