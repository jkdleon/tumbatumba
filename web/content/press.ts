import type { ImageSlot } from "@/content/dishes";

export interface TvFeature {
  network: string;
  show: string;
  year: string;
  confirmed: boolean;
}

export interface Vlogger {
  name: string;
  url: string;
  platform: string;
  poster: ImageSlot;
}

export interface FacebookProof {
  ratingLabel: string;
  tagHandle: string;
  confirmed: boolean;
}

export interface Press {
  tvFeature: TvFeature;
  vloggers: Vlogger[];
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
  vloggers: [],
  facebook: {
    ratingLabel: "[rating] on Facebook",
    tagHandle: "@alingnenetumbatumba",
    confirmed: false,
  },
};
