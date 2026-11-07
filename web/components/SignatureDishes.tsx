import Image from "next/image";
import { dishes, type Dish } from "@/content/dishes";
import { restaurant } from "@/content/restaurant";

const LAYOUT: Record<string, { span: string; tile: string }> = {
  pata: { span: "sm:col-span-2 lg:row-span-2", tile: "bg-peach" },
  ulo: { span: "sm:col-span-2", tile: "bg-pink" },
  sisig: { span: "", tile: "bg-chili text-cream" },
  pancit: { span: "", tile: "bg-sage" },
};

function OrderLink({ dish, light }: { dish: Dish; light?: boolean }) {
  return (
    <a
      href={restaurant.phone.landlineHref}
      aria-label={`Order ${dish.name} — call ${restaurant.phone.landlineDisplay}`}
      className={
        "pop inline-flex min-h-11 items-center gap-2 rounded-full px-4 font-display text-sm font-bold " +
        "transition-transform hover:-translate-y-0.5 " +
        (light ? "bg-cream text-ink" : "bg-ink text-cream")
      }
    >
      Order this <span aria-hidden="true">→</span>
    </a>
  );
}

function PhotoCard({ dish }: { dish: Dish }) {
  const { span, tile } = LAYOUT[dish.id];
  const big = dish.id === "pata";
  return (
    <article
      data-reveal
      className={`pop-lg group relative flex min-h-[22rem] flex-col overflow-hidden rounded-[2rem] ${tile} ${span}`}
    >
      <div
        className={`relative w-full flex-1 overflow-hidden ${big ? "min-h-[18rem]" : "min-h-[12rem]"}`}
      >
        <Image
          src={dish.image!.src}
          alt={dish.image!.alt}
          fill
          sizes={big ? "(min-width: 1024px) 50vw, 100vw" : "(min-width: 640px) 50vw, 100vw"}
          className="object-cover motion-safe:transition-transform motion-safe:duration-700 motion-safe:group-hover:scale-105"
        />
        <span className="pop absolute left-4 top-4 -rotate-3 rounded-full bg-butter px-3 py-1 font-display text-xs font-bold uppercase tracking-wider">
          {dish.tag}
        </span>
      </div>
      <div className="flex flex-wrap items-end justify-between gap-3 border-t-2 border-ink bg-cream p-5">
        <div className="min-w-0 flex-1">
          <h3
            className={`font-display font-extrabold leading-none tracking-tight ${big ? "text-4xl" : "text-3xl"}`}
          >
            {dish.name}
          </h3>
          <p className="mt-2 max-w-md text-sm text-ink/80">{dish.blurb}</p>
          <p className="mt-2 font-display text-lg font-extrabold text-chili">{dish.price}</p>
        </div>
        <OrderLink dish={dish} />
      </div>
    </article>
  );
}

function TypeCard({ dish }: { dish: Dish }) {
  const { span, tile } = LAYOUT[dish.id];
  const dark = dish.id === "sisig";
  return (
    <article
      data-reveal
      style={{ "--reveal-delay": "120ms" } as React.CSSProperties}
      className={`pop-lg group relative flex min-h-[22rem] flex-col justify-between overflow-hidden rounded-[2rem] p-6 ${tile} ${span}`}
    >
      <div
        aria-hidden="true"
        className={`absolute inset-0 ${dark ? "dots opacity-60" : "weave"}`}
      />
      {dish.id === "pancit" && (
        <div
          aria-hidden="true"
          className="weave absolute -bottom-16 -right-16 h-56 w-56 rounded-full border-[6px] border-ink/70 bg-butter motion-safe:transition-transform motion-safe:duration-700 motion-safe:group-hover:rotate-45"
        />
      )}
      {dish.id === "sisig" && (
        <div aria-hidden="true" className="absolute right-5 top-5 flex gap-1.5">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="block h-10 w-1.5 rounded-full bg-butter motion-safe:animate-float"
              style={{ animationDelay: `${i * 300}ms` }}
            />
          ))}
        </div>
      )}
      <span
        className={`pop relative w-fit -rotate-3 rounded-full px-3 py-1 font-display text-xs font-bold uppercase tracking-wider ${dark ? "bg-butter text-ink" : "bg-cream"}`}
      >
        {dish.tag}
      </span>
      <div className="relative">
        <h3 className="font-display text-4xl font-extrabold uppercase leading-[0.9] tracking-tight">
          {dish.name}
        </h3>
        <p className={`mt-3 text-sm ${dark ? "text-cream/90" : "text-ink/80"}`}>{dish.blurb}</p>
        <p className="mt-3 font-display text-xl font-extrabold">{dish.price}</p>
        <div className="mt-4">
          <OrderLink dish={dish} light={dark} />
        </div>
      </div>
    </article>
  );
}

export function SignatureDishes() {
  return (
    <section id="dishes" className="py-20 sm:py-28">
      <div className="wrap">
        <div data-reveal className="mb-10 flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="font-script text-2xl text-chili">ang mga bida</p>
            <h2 className="font-display text-5xl font-extrabold uppercase leading-[0.9] tracking-tight sm:text-7xl">
              Main characters
            </h2>
          </div>
          <p className="max-w-sm text-ink/80">
            The ones people come back for. Bilao and platters are made to order — call ahead so
            it&apos;s hot when you arrive.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:grid-rows-[auto_auto]">
          {dishes.map((d) =>
            d.image ? <PhotoCard key={d.id} dish={d} /> : <TypeCard key={d.id} dish={d} />,
          )}
        </div>
      </div>
    </section>
  );
}
