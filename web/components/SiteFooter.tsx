import { restaurant } from "@/content/restaurant";

export function SiteFooter() {
  const year = new Date().getFullYear();
  const { address } = restaurant;

  return (
    <footer className="border-t border-ink-invert/15 bg-ink py-12 text-center text-ink-invert">
      <div className="mx-auto w-[min(100%-2.5rem,70rem)] space-y-2">
        <p className="font-display text-lg font-bold">{restaurant.name}</p>
        <p className="text-sm opacity-90">
          {address.street}, {address.locality} &nbsp;·&nbsp;
          <a href={restaurant.phone.landlineHref} className="underline">
            {restaurant.phone.landlineDisplay}
          </a>{" "}
          &nbsp;·&nbsp;
          <a href={restaurant.socials.facebook} rel="noopener" className="underline">
            Facebook
          </a>
        </p>
        <p className="text-sm opacity-70">
          © {year} {restaurant.shortName}. Site by the family.
        </p>
      </div>
    </footer>
  );
}
