import Image from "next/image";
import { press } from "@/content/press";
import { restaurant } from "@/content/restaurant";
import { CtaButton } from "@/components/CtaButton";

/** Decorative backdrops for the reel cards (the family's own food photos). */
const BACKDROPS = [
  { src: "/photos/hero-pata.jpg", pos: "object-[40%_30%]", tilt: "-rotate-2" },
  { src: "/photos/dish-ulo.jpg", pos: "object-center", tilt: "rotate-1" },
  { src: "/photos/dish-pata.jpg", pos: "object-[60%_center]", tilt: "-rotate-1" },
];

export function SocialFeed() {
  const { tvFeature, vloggers, facebook } = press;

  return (
    <section id="feed" className="overflow-hidden bg-chili py-20 text-cream sm:py-28">
      <div className="wrap">
        <div data-reveal className="mb-12 flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="font-script text-2xl text-butter">nasa feed na kami</p>
            <h2 className="font-display text-5xl font-extrabold uppercase leading-[0.9] tracking-tight sm:text-7xl">
              Spotted on your feed
            </h2>
            {tvFeature.confirmed && (
              <p className="mt-4 text-lg">
                As seen on <strong>{tvFeature.network}</strong> — {tvFeature.show} ({tvFeature.year}
                )
              </p>
            )}
          </div>
          <p className="max-w-sm text-cream/90">
            Food vloggers came for the crunch. Tap a reel to watch it on Facebook.
          </p>
        </div>

        <ul className="grid grid-cols-1 gap-8 sm:grid-cols-3">
          {vloggers.map((v, i) => {
            const bg = BACKDROPS[i % BACKDROPS.length];
            const label = v.name
              ? `${v.name} on ${v.platform}`
              : `Food vlog ${i + 1} on ${v.platform}`;
            return (
              <li
                key={v.url}
                data-reveal
                style={{ "--reveal-delay": `${i * 120}ms` } as React.CSSProperties}
              >
                <a
                  href={v.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Watch ${label} (opens Facebook)`}
                  className={`group relative block aspect-[9/14] overflow-hidden rounded-[2rem] border-2 border-ink bg-ink shadow-[8px_8px_0_0_var(--color-ink)] transition-transform duration-300 hover:rotate-0 hover:-translate-y-1 ${bg.tilt}`}
                >
                  <Image
                    src={v.poster?.src ?? bg.src}
                    alt=""
                    fill
                    sizes="(min-width: 640px) 33vw, 100vw"
                    className={`object-cover opacity-80 motion-safe:transition-transform motion-safe:duration-700 motion-safe:group-hover:scale-110 ${bg.pos}`}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/20 to-transparent" />
                  <div className="absolute inset-x-0 top-0 flex items-center gap-2 p-4">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src="/logo.jpg"
                      alt=""
                      width={32}
                      height={32}
                      className="h-8 w-8 rounded-full border-2 border-cream"
                    />
                    <span className="font-display text-sm font-bold">{v.name ?? "Food vlog"}</span>
                    <span className="ml-auto rounded-full bg-cream/20 px-2 py-0.5 text-xs font-semibold backdrop-blur">
                      {v.platform}
                    </span>
                  </div>
                  <span
                    aria-hidden="true"
                    className="absolute left-1/2 top-1/2 grid h-20 w-20 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border-2 border-ink bg-butter text-ink shadow-[4px_4px_0_0_var(--color-ink)] transition-transform group-hover:scale-110"
                  >
                    <svg viewBox="0 0 24 24" className="ml-1 h-8 w-8 fill-current">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </span>
                  <div className="absolute inset-x-0 bottom-0 p-5">
                    <p className="font-display text-2xl font-extrabold leading-tight">
                      Crunch check #{i + 1}
                    </p>
                    <p className="mt-1 text-sm text-cream/85">Watch on {v.platform} ↗</p>
                  </div>
                </a>
              </li>
            );
          })}
        </ul>

        <div
          data-reveal
          className="mt-14 flex flex-col items-start justify-between gap-6 rounded-[2rem] border-2 border-ink bg-butter p-7 text-ink shadow-[8px_8px_0_0_var(--color-ink)] sm:flex-row sm:items-center"
        >
          <div>
            <p className="font-display text-3xl font-extrabold leading-tight sm:text-4xl">
              Post your crunch. Tag <span className="text-chili">{facebook.tagHandle}</span>
            </p>
            <p className="mt-1 text-ink/80">
              {facebook.confirmed ? `${facebook.ratingLabel} · ` : ""}Your reel could be the next
              one up here.
            </p>
          </div>
          <CtaButton
            href={restaurant.socials.facebook}
            target="_blank"
            rel="noopener noreferrer"
            variant="ink"
          >
            Follow on Facebook ↗
          </CtaButton>
        </div>
      </div>
    </section>
  );
}
