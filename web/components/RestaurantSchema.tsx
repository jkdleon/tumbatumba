import { restaurant } from "@/content/restaurant";
import { siteUrl } from "@/lib/siteUrl";

const DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

export function RestaurantSchema() {
  const data = {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    name: restaurant.name,
    servesCuisine: restaurant.cuisine,
    url: `${siteUrl}/`,
    telephone: "+63-2-8570-8560",
    image: `${siteUrl}/logo.jpg`,
    priceRange: restaurant.priceRange,
    address: {
      "@type": "PostalAddress",
      streetAddress: restaurant.address.street,
      addressLocality: restaurant.address.locality,
      addressRegion: restaurant.address.region,
      addressCountry: restaurant.address.country,
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: DAYS,
        opens: restaurant.hours.open,
        closes: restaurant.hours.close,
      },
    ],
    sameAs: [restaurant.socials.facebook],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
