import Image from "next/image";
import { restaurant } from "@/content/restaurant";
import { useTheme } from "@/components/ThemeProvider";
import { CtaButton } from "@/components/CtaButton";
import { OpenNowBadge } from "@/components/OpenNowBadge";
import { formatHours } from "@/lib/openNow";

const HERO_IMAGE = {
  src: "/photos/hero-pata.jpg",
  alt: "A whole crispy pata fresh from the fryer, skin blistered and deep golden-brown, on a black plate.",
};

export function Hero() {
  const theme = useTheme();
  const align = theme.layout.heroAlign === "center" ? "items-center text-center" : "items-start";
  const heroSurface =
    theme.name === "carinderia" ? "bg-canvas text-ink-invert" : "bg-surface-2 text-ink";
  // text-gold fails AA on heritage's light band (2.29:1); text-accent clears it (7:1).
  const kickerColor = theme.name === "carinderia" ? "text-gold" : "text-accent";
  // Ghost CTA: text-accent on the charcoal canvas is 2.44:1 (fails AA). text-gold
  // is 7.5:1, and border-current follows it. Heritage keeps the default (7:1).
  const ghostCtaClass = theme.name === "carinderia" ? "text-gold" : "";

  return (
    <section id="top" className={`${theme.layout.sectionPaddingY} ${heroSurface}`}>
      <div className={`mx-auto flex w-[min(100%-2.5rem,70rem)] flex-col gap-6 ${align}`}>
        <p className={`font-display text-sm uppercase tracking-widest ${kickerColor}`}>
          {restaurant.shortName.replace(" Tumba Tumba", "")}
        </p>
        <h1 className="font-display text-4xl font-extrabold leading-tight sm:text-6xl">
          Tumba Tumba <span className="text-accent-strong">Crispy Pata</span>
        </h1>
        <p className="max-w-2xl text-lg opacity-90">
          A family kitchen on General Kalentong Street. We fry the pata till the skin cracks, ladle
          the sisig hot off the plate, and pack the pancit by the bilao.
        </p>

        <OpenNowBadge hours={restaurant.hours} />

        <div className="flex flex-wrap gap-3">
          <CtaButton href={restaurant.phone.landlineHref}>
            Call to order — {restaurant.phone.landlineDisplay}
          </CtaButton>
          <CtaButton
            href={restaurant.socials.messenger}
            rel="noopener"
            variant="ghost"
            className={ghostCtaClass}
          >
            Message on Facebook
          </CtaButton>
        </div>

        <p className="text-sm opacity-80">
          {restaurant.address.street}, {restaurant.address.locality} · Open {restaurant.hours.days},{" "}
          {formatHours(restaurant.hours)}
        </p>

        <figure className="relative mt-4 w-full overflow-hidden rounded-theme">
          <Image
            src={HERO_IMAGE.src}
            alt={HERO_IMAGE.alt}
            width={1280}
            height={720}
            priority
            className="h-auto w-full object-cover"
          />
        </figure>
      </div>

      <div id="hero-end" aria-hidden="true" className="h-0" />
    </section>
  );
}
