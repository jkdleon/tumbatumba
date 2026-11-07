import { restaurant } from "@/content/restaurant";
import { NAV } from "@/content/nav";

export function SiteFooter() {
  const year = new Date().getFullYear();
  const { address, phone, socials } = restaurant;

  return (
    <footer className="overflow-hidden bg-deep pb-28 pt-16 text-fg md:pb-12">
      <div className="wrap">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr]">
          <div className="flex items-start gap-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo.jpg"
              alt=""
              width={72}
              height={72}
              className="h-18 w-18 rounded-full border-2 border-fg"
            />
            <div>
              <p className="font-display text-xl font-extrabold">{restaurant.name}</p>
              <p className="mt-1 text-sm text-fg/75">
                {address.street}, {address.locality}
              </p>
            </div>
          </div>
          <nav aria-label="Footer">
            <p className="font-display text-xs font-bold uppercase tracking-[0.25em] text-yellow">
              Explore
            </p>
            <ul className="mt-3 space-y-1.5">
              {NAV.map((n) => (
                <li key={n.href}>
                  <a href={n.href} className="hover:text-yellow">
                    {n.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <div>
            <p className="font-display text-xs font-bold uppercase tracking-[0.25em] text-yellow">
              Say hi
            </p>
            <ul className="mt-3 space-y-1.5">
              <li>
                <a href={phone.landlineHref} className="hover:text-yellow">
                  {phone.landlineDisplay}
                </a>
              </li>
              <li>
                <a href={phone.mobileHref} className="hover:text-yellow">
                  {phone.mobileDisplay}
                </a>
              </li>
              <li>
                <a
                  href={socials.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-yellow"
                >
                  Facebook ↗
                </a>
              </li>
            </ul>
          </div>
        </div>

        <p
          aria-hidden="true"
          className="mt-14 select-none whitespace-nowrap text-center font-script text-[clamp(2.25rem,11.5vw,10.5rem)] leading-none text-hot"
        >
          Tumba Tumba
        </p>
        <p className="mt-6 text-center text-sm text-fg/60">
          © {year} {restaurant.shortName}. Site by the family.
        </p>
      </div>
    </footer>
  );
}
