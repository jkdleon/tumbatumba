import { restaurant } from "@/content/restaurant";
import { CtaButton } from "@/components/CtaButton";
import { CopyButton } from "@/components/CopyButton";
import { OpenNowBadge } from "@/components/OpenNowBadge";
import { formatHours } from "@/lib/openNow";

export function VisitOrder() {
  const { address, phone, gcash, socials, hours } = restaurant;

  const steps = [
    {
      n: "1",
      title: "Call or message",
      body: (
        <>
          Landline{" "}
          <a
            href={phone.landlineHref}
            className="font-bold underline decoration-2 underline-offset-2"
          >
            {phone.landlineDisplay}
          </a>
          , mobile{" "}
          <a
            href={phone.mobileHref}
            className="font-bold underline decoration-2 underline-offset-2"
          >
            {phone.mobileDisplay}
          </a>
          , or Messenger.
        </>
      ),
    },
    {
      n: "2",
      title: "Pay with GCash",
      body: (
        <span className="flex flex-wrap items-center gap-2">
          <span>
            <span className="font-bold tabular-nums">{gcash.number}</span>{" "}
            <span className="text-ink/70">({gcash.name})</span>
          </span>
          <CopyButton value={gcash.number.replace(/\s/g, "")} label="GCash number" />
        </span>
      ),
    },
    { n: "3", title: "Pick up or dine in", body: restaurant.reservationNote },
  ];

  return (
    <section id="visit" className="bg-sage py-20 sm:py-28">
      <div className="wrap">
        <div data-reveal className="mb-10">
          <p className="font-script text-2xl text-ink">tara, kain!</p>
          <h2 className="font-display text-5xl font-extrabold uppercase leading-[0.9] tracking-tight sm:text-7xl">
            Order in 3 steps
          </h2>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1.3fr_1fr]">
          <ol className="grid gap-5">
            {steps.map((s, i) => (
              <li
                key={s.n}
                data-reveal
                style={{ "--reveal-delay": `${i * 100}ms` } as React.CSSProperties}
                className="pop flex gap-5 rounded-[1.75rem] bg-cream p-5 sm:p-6"
              >
                <span className="pop grid h-14 w-14 shrink-0 place-items-center rounded-full bg-chili font-display text-2xl font-extrabold text-cream">
                  {s.n}
                </span>
                <div className="min-w-0">
                  <h3 className="font-display text-2xl font-extrabold leading-tight">{s.title}</h3>
                  <div className="mt-1 text-ink/85">{s.body}</div>
                </div>
              </li>
            ))}
            <li className="flex flex-wrap gap-3 pt-2">
              <CtaButton href={phone.landlineHref}>Call to order</CtaButton>
              <CtaButton
                href={socials.messenger}
                target="_blank"
                rel="noopener noreferrer"
                variant="cream"
              >
                Message on Facebook
              </CtaButton>
            </li>
          </ol>

          <div
            data-reveal
            className="pop-lg flex flex-col gap-5 rounded-[2rem] bg-ink p-7 text-cream"
          >
            <OpenNowBadge hours={hours} className="w-fit" />
            <div>
              <p className="font-display text-xs font-bold uppercase tracking-[0.25em] text-butter">
                Find us
              </p>
              <address className="mt-2 font-display text-3xl font-extrabold not-italic leading-tight">
                {address.street}
                <span className="block text-xl font-semibold text-cream/80">
                  {address.locality}, {address.region}
                </span>
              </address>
            </div>
            <div>
              <p className="font-display text-xs font-bold uppercase tracking-[0.25em] text-butter">
                Hours
              </p>
              <p className="mt-2 text-lg">
                <span className="capitalize">{hours.days}</span>, {formatHours(hours)}
              </p>
            </div>
            <div className="mt-auto pt-2">
              <CtaButton
                href={restaurant.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                variant="butter"
                className="w-full"
              >
                Open in Google Maps ↗
              </CtaButton>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
