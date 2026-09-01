export interface Address {
  street: string;
  locality: string;
  region: string;
  country: string;
}

export interface Phone {
  landlineDisplay: string;
  landlineHref: string;
  mobileDisplay: string;
  mobileHref: string;
}

export interface GCash {
  number: string;
  name: string;
}

export interface Hours {
  open: string; // "HH:MM", 24h
  close: string; // "HH:MM", 24h
  tz: string; // IANA timezone
  days: string; // human-readable, e.g. "daily"
}

export interface Socials {
  facebook: string;
  messenger: string;
}

export interface Restaurant {
  name: string;
  shortName: string;
  cuisine: string;
  address: Address;
  phone: Phone;
  gcash: GCash;
  hours: Hours;
  socials: Socials;
  mapsUrl: string;
  reservationNote: string;
  priceRange: string;
}

/**
 * Single source of truth for business data. Transcribed from site/index.html,
 * client-confirmed 2026-09-01. Do not let site/ and this module diverge.
 */
export const restaurant: Restaurant = {
  name: "Aling Nene's Tumba Tumba Crispy Pata",
  shortName: "Aling Nene's Tumba Tumba",
  cuisine: "Filipino",
  address: {
    street: "823 General Kalentong Street",
    locality: "Mandaluyong City",
    region: "Metro Manila",
    country: "PH",
  },
  phone: {
    landlineDisplay: "(02) 8570 8560",
    landlineHref: "tel:+63285708560",
    mobileDisplay: "0932 514 7741",
    mobileHref: "tel:+639325147741",
  },
  gcash: {
    number: "0932 514 7741",
    name: "Cristina D.",
  },
  hours: {
    open: "09:00",
    close: "22:00",
    tz: "Asia/Manila",
    days: "daily",
  },
  socials: {
    facebook: "https://www.facebook.com/alingnenetumbatumba",
    messenger: "https://m.me/alingnenetumbatumba",
  },
  mapsUrl:
    "https://www.google.com/maps/search/?api=1&query=823+General+Kalentong+Street+Mandaluyong+City",
  reservationNote:
    "Dine-in is by reservation. Call ahead for a table, or to have the pata, bilao, and platters ready for pick-up.",
  priceRange: "₱₱",
};
