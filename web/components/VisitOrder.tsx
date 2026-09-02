import { restaurant } from "@/content/restaurant";
import { ordering } from "@/content/ordering";
import { useTheme } from "@/components/ThemeProvider";
import { CtaButton } from "@/components/CtaButton";
import { formatHours } from "@/lib/openNow";
import { orderCta } from "@/lib/ordering";

export function VisitOrder() {
  const theme = useTheme();
  const { address, phone, gcash, socials, hours } = restaurant;
  const cta = orderCta(ordering, phone.landlineHref, phone.landlineDisplay);

  return (
    <section id="visit" className={`${theme.layout.sectionPaddingY} bg-surface-2 text-ink`}>
      <div className="mx-auto grid w-[min(100%-2.5rem,70rem)] gap-10 md:grid-cols-2">
        <div className="space-y-4">
          <h2 className="font-display text-3xl font-bold">Visit &amp; order</h2>
          <address className="not-italic">
            {address.street}
            <br />
            {address.locality}, {address.region}
          </address>
          <table className="text-sm">
            <tbody>
              <tr>
                <th scope="row" className="pr-4 text-left font-semibold capitalize">
                  {hours.days}
                </th>
                <td>{formatHours(hours)}</td>
              </tr>
            </tbody>
          </table>
          <p>
            <a href={restaurant.mapsUrl} rel="noopener" className="underline hover:text-accent">
              Open in Google Maps →
            </a>
          </p>
        </div>

        <div className="space-y-4">
          <h3 className="font-display text-xl font-bold">Reservations &amp; orders</h3>
          <p className="text-sm text-ink/80">
            {cta.external ? ordering.note : restaurant.reservationNote}
          </p>
          <ul className="space-y-2 text-sm">
            <li>
              <span className="inline-block w-20 font-semibold">Landline</span>
              <a href={phone.landlineHref} className="underline">
                {phone.landlineDisplay}
              </a>
            </li>
            <li>
              <span className="inline-block w-20 font-semibold">Mobile</span>
              <a href={phone.mobileHref} className="underline">
                {phone.mobileDisplay}
              </a>
            </li>
            <li>
              <span className="inline-block w-20 font-semibold">GCash</span>
              {gcash.number} <span className="text-ink/70">({gcash.name})</span>
            </li>
            <li>
              <span className="inline-block w-20 font-semibold">Facebook</span>
              <a href={socials.facebook} rel="noopener" className="underline">
                @alingnenetumbatumba
              </a>
            </li>
          </ul>
          <div className="flex flex-wrap gap-3 pt-2">
            <CtaButton href={cta.href} {...(cta.external ? { rel: "noopener" } : {})}>
              {cta.external ? ordering.label : "Call to order"}
            </CtaButton>
            <CtaButton href={socials.messenger} rel="noopener" variant="ghost">
              Message on Facebook
            </CtaButton>
          </div>
        </div>
      </div>
    </section>
  );
}
