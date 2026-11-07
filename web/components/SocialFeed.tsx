import { press } from "@/content/press";
import { restaurant } from "@/content/restaurant";
import { CtaButton } from "@/components/CtaButton";
import { VlogReels } from "@/components/VlogReels";

export function SocialFeed() {
  const { tvFeature, vloggers, facebook } = press;

  return (
    <section id="feed" className="overflow-hidden bg-hot py-20 text-on-bright sm:py-28">
      <div className="wrap">
        <div data-reveal className="mb-12 flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="font-script text-2xl text-on-bright">nasa feed na kami</p>
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
          <p className="max-w-sm text-on-bright/90">
            Food vloggers came for the crunch. Tap a reel to watch it right here.
          </p>
        </div>

        <VlogReels vloggers={vloggers} />

        <div
          data-reveal
          className="mt-14 flex flex-col items-start justify-between gap-6 rounded-[2rem] border-2 border-on-bright bg-yellow p-7 text-on-bright shadow-[8px_8px_0_0_var(--color-on-bright)] sm:flex-row sm:items-center"
        >
          <div>
            <p className="font-display text-3xl font-extrabold leading-tight sm:text-4xl">
              Post your crunch. Tag{" "}
              <span className="underline decoration-hot decoration-4 underline-offset-4">
                {facebook.tagHandle}
              </span>
            </p>
            <p className="mt-1 text-on-bright/80">
              {facebook.confirmed ? `${facebook.ratingLabel} · ` : ""}Your reel could be the next
              one up here.
            </p>
          </div>
          <CtaButton
            href={restaurant.socials.facebook}
            target="_blank"
            rel="noopener noreferrer"
            variant="outline"
          >
            Follow on Facebook ↗
          </CtaButton>
        </div>
      </div>
    </section>
  );
}
