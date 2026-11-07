import Image from "next/image";
import { restaurant } from "@/content/restaurant";
import { CtaButton } from "@/components/CtaButton";
import { OpenNowBadge } from "@/components/OpenNowBadge";

const HERO_IMAGE = {
  src: "/photos/hero-pata.jpg",
  alt: "A whole crispy pata fresh from the fryer, skin blistered and deep golden-brown, plated whole.",
};

/** Circular rotating sticker text, drawn as SVG so it scales crisply. */
function SpinBadge() {
  return (
    <div
      aria-hidden="true"
      className="pop absolute -left-6 -top-8 grid h-28 w-28 place-items-center rounded-full bg-yellow sm:-left-10 sm:h-36 sm:w-36"
    >
      <svg
        viewBox="0 0 100 100"
        className="absolute inset-0 h-full w-full motion-safe:animate-spin-slow"
      >
        <defs>
          <path id="spin-circle" d="M50,50 m-37,0 a37,37 0 1,1 74,0 a37,37 0 1,1 -74,0" />
        </defs>
        <text className="fill-on-bright font-display text-[10.5px] font-bold uppercase tracking-[0.18em]">
          <textPath href="#spin-circle">Hot · Crispy · Cooked to order ·</textPath>
        </text>
      </svg>
      <span className="font-script text-3xl text-on-bright sm:text-4xl">!</span>
    </div>
  );
}

export function Hero() {
  return (
    <section id="top" className="relative overflow-hidden pb-16 pt-10 sm:pb-24 sm:pt-14">
      {/* soft colour blobs */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -left-24 top-10 h-72 w-72 rounded-full bg-pink/60 blur-3xl" />
        <div className="absolute right-0 top-1/3 h-96 w-96 rounded-full bg-orange/50 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-64 w-64 rounded-full bg-lime/50 blur-3xl" />
      </div>

      <div className="wrap grid items-center gap-14 lg:grid-cols-[1.1fr_1fr] lg:gap-10">
        <div className="flex flex-col items-start gap-6">
          <div className="flex flex-wrap items-center gap-2">
            <OpenNowBadge hours={restaurant.hours} />
            <span className="pop rounded-full bg-lime px-4 py-1.5 font-display text-sm font-bold text-on-bright">
              📍 Kalentong, Mandaluyong
            </span>
          </div>

          <h1 className="font-display font-extrabold leading-[0.88] tracking-[-0.04em]">
            <span className="block text-[clamp(3.4rem,12vw,7.5rem)] uppercase">Crispy</span>
            <span className="block text-[clamp(3.4rem,12vw,7.5rem)] uppercase">
              Pata<span className="text-hot">.</span>
            </span>
            <span className="mt-3 block font-script text-[clamp(1.9rem,5.4vw,3.4rem)] font-normal leading-tight tracking-normal text-hot">
              rinig mo ang lutong.
            </span>
          </h1>

          <p className="max-w-xl text-lg text-fg/85 sm:text-xl">
            Hear-the-crunch crispy pata, sizzling sisig, and pancit by the bilao — cooked to order
            in our family kitchen on General Kalentong Street.
          </p>

          <div className="flex flex-wrap gap-3">
            <CtaButton href={restaurant.phone.landlineHref}>
              Call to order — {restaurant.phone.landlineDisplay}
            </CtaButton>
            <CtaButton href="#planner" variant="outline">
              Plan a barkada order →
            </CtaButton>
          </div>

          <dl className="grid w-full max-w-xl grid-cols-3 gap-3 pt-2">
            {[
              ["₱870", "XL crispy pata"],
              ["3–15", "pax per bilao"],
              ["GCash", "accepted"],
            ].map(([big, small]) => (
              <div key={small} className="rounded-2xl border-2 border-fg/15 bg-night/60 p-3">
                <dt className="sr-only">{small}</dt>
                <dd className="font-display text-2xl font-extrabold leading-none sm:text-3xl">
                  {big}
                </dd>
                <dd className="mt-1 text-xs font-medium text-fg/70 sm:text-sm">{small}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="relative mx-auto w-full max-w-xl lg:ml-auto">
          <figure className="pop-lg relative rotate-2 overflow-hidden rounded-[2.25rem] bg-night-2 motion-safe:transition-transform motion-safe:duration-500 motion-safe:hover:rotate-0">
            <Image
              src={HERO_IMAGE.src}
              alt={HERO_IMAGE.alt}
              width={1280}
              height={960}
              priority
              className="aspect-[4/4.4] h-auto w-full object-cover object-[45%_center] sm:aspect-[4/4]"
            />
          </figure>

          <SpinBadge />

          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logo.jpg"
            alt=""
            width={140}
            height={140}
            className="pop absolute -right-3 -top-10 h-24 w-24 rounded-full motion-safe:animate-wiggle sm:-right-8 sm:h-32 sm:w-32"
          />

          <div className="pop absolute -bottom-6 left-4 -rotate-3 rounded-2xl bg-hot px-5 py-3 text-on-bright sm:-bottom-8 sm:left-8">
            <p className="font-display text-xs font-semibold uppercase tracking-widest">
              Whole leg
            </p>
            <p className="font-display text-2xl font-extrabold leading-none">
              ₱870 <span className="text-base font-bold">XL</span> · ₱900{" "}
              <span className="text-base font-bold">Jumbo</span>
            </p>
          </div>

          <div className="pop absolute -bottom-5 right-2 rotate-6 rounded-full bg-night px-4 py-2 font-display text-sm font-bold motion-safe:animate-float sm:right-6">
            🔥 Fresh from the fryer
          </div>
        </div>
      </div>

      <div id="hero-end" aria-hidden="true" className="h-0" />
    </section>
  );
}
