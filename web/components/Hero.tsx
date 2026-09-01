import Image from "next/image";
import { restaurant } from "@/content/restaurant";
import { useTheme } from "@/components/ThemeProvider";
import { CtaButton } from "@/components/CtaButton";
import { OpenNowBadge } from "@/components/OpenNowBadge";
import { formatHours } from "@/lib/openNow";

const HERO_IMAGE = {
  src: "/stock/hero-pata.jpg",
  alt: "Stock photo (placeholder — swap for the family's own): a whole crispy pata, skin blistered and golden, on a white platter.",
};

export function Hero() {
  const theme = useTheme();
  const align =
    theme.layout.heroAlign === "center" ? "items-center text-center" : "items-start";

  return (
    <section id="top" className={`${theme.layout.sectionPaddingY} bg-canvas text-ink-invert`}>
      <div className={`mx-auto flex w-[min(100%-2.5rem,70rem)] flex-col gap-6 ${align}`}>
        <p className="font-display text-sm uppercase tracking-widest text-gold">
          {restaurant.shortName.replace(" Tumba Tumba", "")}
        </p>
        <h1 className="font-display text-4xl font-extrabold leading-tight sm:text-6xl">
          Tumba Tumba <span className="text-accent-strong">Crispy Pata</span>
        </h1>
        <p className="max-w-2xl text-lg opacity-90">
          A family kitchen on General Kalentong Street. We fry the pata till the skin
          cracks, ladle the sisig hot off the plate, and pack the pancit by the bilao.
        </p>

        <OpenNowBadge hours={restaurant.hours} />

        <div className="flex flex-wrap gap-3">
          <CtaButton href={restaurant.phone.landlineHref}>
            Call to order — {restaurant.phone.landlineDisplay}
          </CtaButton>
          <CtaButton href={restaurant.socials.messenger} rel="noopener" variant="ghost">
            Message on Facebook
          </CtaButton>
        </div>

        <p className="text-sm opacity-80">
          {restaurant.address.street}, {restaurant.address.locality} · Open{" "}
          {restaurant.hours.days}, {formatHours(restaurant.hours)}
        </p>

        <figure className="relative mt-4 w-full overflow-hidden rounded-theme">
          <Image
            src={HERO_IMAGE.src}
            alt={HERO_IMAGE.alt}
            width={1600}
            height={900}
            priority
            className="h-auto w-full object-cover"
          />
          <figcaption className="absolute left-2 top-2 rounded bg-ink/70 px-2 py-1 text-xs text-ink-invert">
            stock photo — replace before launch
          </figcaption>
        </figure>
      </div>

      <div id="hero-end" aria-hidden="true" className="h-0" />
    </section>
  );
}
