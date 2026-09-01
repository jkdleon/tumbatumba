import type { ImageSlot } from "@/content/dishes";

export interface TvFeature {
  network: string;
  show: string;
  year: string;
  confirmed: boolean;
}

export interface Vlogger {
  /** Creator / channel name. Omit until the family confirms who made it. */
  name?: string;
  url: string;
  platform: string;
  /** Link-out card thumbnail (spec §9.4a). Omit for a text-only card. */
  poster?: ImageSlot;
}

export interface FacebookProof {
  ratingLabel: string;
  tagHandle: string;
  confirmed: boolean;
}

export interface Press {
  tvFeature: TvFeature;
  vloggers: Vlogger[];
  /** True once every vlogger has a confirmed creator name (+ ideally a thumbnail). */
  vloggersConfirmed: boolean;
  facebook: FacebookProof;
}

/**
 * Social-proof content. ALL PLACEHOLDER until James supplies real values
 * (spec §10). SocialProof renders a visible "content pending" state while
 * `confirmed` is false. Per spec §9.4 decision (a), vloggers render as
 * thumbnail cards that link out — never as embeds.
 */
export const press: Press = {
  tvFeature: {
    network: "[network]",
    show: "[show name]",
    year: "[year]",
    confirmed: false,
  },
  vloggers: [
    // Facebook video posts the family shared. Real creator names + thumbnails
    // still to come — until then these render as text-only link-out cards.
    { url: "https://www.facebook.com/share/v/19SK2Senov/", platform: "Facebook" },
    { url: "https://www.facebook.com/share/v/1F6TFVxkQL/", platform: "Facebook" },
    { url: "https://www.facebook.com/share/v/1KhYRT4hFG/", platform: "Facebook" },
  ],
  vloggersConfirmed: false,
  facebook: {
    ratingLabel: "[rating] on Facebook",
    tagHandle: "@alingnenetumbatumba",
    confirmed: false,
  },
};
