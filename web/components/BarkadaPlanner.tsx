"use client";

import { useMemo, useState } from "react";
import { restaurant } from "@/content/restaurant";
import {
  ADD_ONS,
  buildPlan,
  MAX_GUESTS,
  MIN_GUESTS,
  NOODLES,
  orderMessage,
  peso,
  type Noodle,
} from "@/lib/planner";
import { CTA_BASE, CTA_VARIANTS } from "@/components/CtaButton";

const PRESETS = [
  { n: 4, label: "Squad" },
  { n: 8, label: "Fam dinner" },
  { n: 15, label: "Barkada night" },
  { n: 30, label: "Office party" },
];

function Stepper({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
}) {
  const btn =
    "pop grid h-9 w-9 place-items-center rounded-full bg-night font-display text-lg font-bold " +
    "disabled:opacity-40 active:translate-x-0.5 active:translate-y-0.5";
  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        className={btn}
        aria-label={`Remove one ${label}`}
        disabled={value === 0}
        onClick={() => onChange(Math.max(0, value - 1))}
      >
        −
      </button>
      <span
        className="w-6 text-center font-display text-lg font-extrabold tabular-nums"
        aria-live="polite"
      >
        {value}
      </span>
      <button
        type="button"
        className={btn}
        aria-label={`Add one ${label}`}
        onClick={() => onChange(Math.min(20, value + 1))}
      >
        +
      </button>
    </div>
  );
}

export function BarkadaPlanner() {
  const [guests, setGuests] = useState(8);
  const [noodle, setNoodle] = useState<Noodle>("bihon");
  const [pancit, setPancit] = useState(true);
  const [addOns, setAddOns] = useState<Record<string, number>>({ "pata-xl": 1 });
  const [copied, setCopied] = useState(false);

  const plan = useMemo(
    () => buildPlan(guests, noodle, addOns, pancit),
    [guests, noodle, addOns, pancit],
  );
  const message = useMemo(() => orderMessage(guests, plan), [guests, plan]);
  const smsHref = `sms:${restaurant.phone.mobileHref.replace("tel:", "")}?body=${encodeURIComponent(message)}`;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(message);
      setCopied(true);
      setTimeout(() => setCopied(false), 4000);
    } catch {
      /* clipboard blocked — the order list stays on screen */
    }
  };

  return (
    <section id="planner" className="py-20 sm:py-28">
      <div className="wrap">
        <div data-reveal className="mb-10 max-w-3xl">
          <p className="font-script text-2xl text-hot">ilan kayo?</p>
          <h2 className="font-display text-5xl font-extrabold uppercase leading-[0.9] tracking-tight sm:text-7xl">
            Barkada planner
          </h2>
          <p className="mt-4 max-w-xl text-fg/80">
            Tell us the head-count, we&apos;ll size the bilao. Add the crunchy stuff, then send the
            list straight to us — no account, no app.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1.25fr_1fr]">
          {/* controls */}
          <div data-reveal className="pop-lg rounded-[2rem] bg-yellow p-6 text-on-bright sm:p-8">
            <fieldset>
              <legend className="font-display text-lg font-extrabold">How many people?</legend>
              <div className="mt-3 flex items-center gap-5">
                <output
                  htmlFor="guest-range"
                  className="font-display text-7xl font-extrabold leading-none tabular-nums sm:text-8xl"
                >
                  {guests}
                </output>
                <span className="font-script text-2xl text-on-bright">
                  {guests === 1 ? "tao" : "katao"}
                </span>
              </div>
              <label htmlFor="guest-range" className="sr-only">
                Number of people
              </label>
              <input
                id="guest-range"
                type="range"
                min={MIN_GUESTS}
                max={MAX_GUESTS}
                value={guests}
                onChange={(e) => setGuests(Number(e.target.value))}
                className="mt-4 h-3 w-full cursor-pointer"
              />
              <div className="mt-4 flex flex-wrap gap-2">
                {PRESETS.map((p) => (
                  <button
                    key={p.n}
                    type="button"
                    aria-pressed={guests === p.n}
                    onClick={() => setGuests(p.n)}
                    className={
                      "rounded-full border-2 border-on-bright px-3 py-1.5 font-display text-sm font-bold transition-colors " +
                      (guests === p.n
                        ? "bg-on-bright text-yellow"
                        : "bg-transparent hover:bg-on-bright/10")
                    }
                  >
                    {p.label} · {p.n}
                  </button>
                ))}
              </div>
            </fieldset>

            <hr className="my-7 border-t-2 border-dashed border-on-bright/30" />

            <fieldset>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <legend className="font-display text-lg font-extrabold">Pancit by the bilao</legend>
                <label className="flex cursor-pointer items-center gap-2 text-sm font-semibold">
                  <input
                    type="checkbox"
                    checked={pancit}
                    onChange={(e) => setPancit(e.target.checked)}
                    className="h-5 w-5 accent-[var(--color-hot)]"
                  />
                  Include pancit
                </label>
              </div>
              <div
                className={`mt-3 flex flex-wrap gap-2 ${pancit ? "" : "pointer-events-none opacity-40"}`}
              >
                {NOODLES.map((n) => (
                  <label
                    key={n.id}
                    className={
                      "cursor-pointer rounded-full border-2 border-on-bright px-3 py-1.5 font-display text-sm font-bold " +
                      "has-[:focus-visible]:outline has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-hot " +
                      (noodle === n.id ? "bg-on-bright text-yellow" : "bg-transparent")
                    }
                  >
                    <input
                      type="radio"
                      name="noodle"
                      value={n.id}
                      checked={noodle === n.id}
                      onChange={() => setNoodle(n.id)}
                      disabled={!pancit}
                      className="sr-only"
                    />
                    {n.label}
                    {n.surcharge > 0 && <span className="opacity-80"> +₱{n.surcharge}</span>}
                  </label>
                ))}
              </div>
            </fieldset>

            <hr className="my-7 border-t-2 border-dashed border-on-bright/30" />

            <fieldset>
              <legend className="font-display text-lg font-extrabold">Add the crunchy stuff</legend>
              <ul className="mt-3 grid gap-3 sm:grid-cols-2">
                {ADD_ONS.map((a) => (
                  <li
                    key={a.id}
                    className="flex items-center justify-between gap-3 rounded-2xl border-2 border-on-bright bg-night p-3 text-fg"
                  >
                    <span className="min-w-0">
                      <span className="block text-sm font-semibold leading-tight">{a.label}</span>
                      <span className="text-sm text-fg/70">{peso(a.price)}</span>
                    </span>
                    <Stepper
                      label={a.label}
                      value={addOns[a.id] ?? 0}
                      onChange={(v) => setAddOns((s) => ({ ...s, [a.id]: v }))}
                    />
                  </li>
                ))}
              </ul>
            </fieldset>
          </div>

          {/* receipt */}
          <aside
            data-reveal
            aria-label="Your order estimate"
            className="pop-lg relative h-fit rounded-[2rem] bg-night p-6 sm:p-8 lg:sticky lg:top-24"
          >
            <p className="font-display text-xs font-bold uppercase tracking-[0.25em] text-lime">
              Order slip
            </p>
            <h3 className="font-display text-3xl font-extrabold">Good for {guests}</h3>

            {plan.lines.length === 0 ? (
              <p className="mt-6 text-fg/70">Pick at least one item to build your slip.</p>
            ) : (
              <ul className="mt-5 divide-y-2 divide-dashed divide-fg/20 border-y-2 border-dashed border-fg/20">
                {plan.lines.map((l) => (
                  <li key={l.label} className="flex justify-between gap-4 py-3 text-sm">
                    <span>
                      <span className="font-bold tabular-nums">{l.qty}×</span> {l.label}
                    </span>
                    <span className="whitespace-nowrap font-semibold tabular-nums">
                      {peso(l.subtotal)}
                    </span>
                  </li>
                ))}
              </ul>
            )}

            <div className="mt-5 flex items-end justify-between">
              <span className="font-display text-lg font-bold">Estimated total</span>
              <span
                className="font-display text-4xl font-extrabold tabular-nums text-hot"
                aria-live="polite"
              >
                {peso(plan.total)}
              </span>
            </div>
            <p className="mt-2 text-xs text-fg/65">
              Estimate only — we confirm the final price when you order. Chicken ala Tumba and
              cheese sticks need 1 day&apos;s notice.
            </p>

            <div className="mt-6 grid gap-3">
              <a
                href={restaurant.socials.messenger}
                target="_blank"
                rel="noopener noreferrer"
                onClick={copy}
                className={`${CTA_BASE} ${CTA_VARIANTS.primary} w-full`}
              >
                Copy slip &amp; open Messenger
              </a>
              <div className="grid grid-cols-2 gap-3">
                <a
                  href={smsHref}
                  className={`${CTA_BASE} ${CTA_VARIANTS.outline} w-full px-3 text-sm`}
                >
                  Text it
                </a>
                <a
                  href={restaurant.phone.landlineHref}
                  className={`${CTA_BASE} ${CTA_VARIANTS.invert} w-full px-3 text-sm`}
                >
                  Call instead
                </a>
              </div>
            </div>
            <p role="status" className="mt-3 min-h-5 text-center text-sm font-semibold text-lime">
              {copied ? "Slip copied — paste it in the chat ✓" : ""}
            </p>
          </aside>
        </div>
      </div>
    </section>
  );
}
