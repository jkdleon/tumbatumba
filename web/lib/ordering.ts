import type { Ordering } from "@/content/ordering";

export interface OrderCta {
  href: string;
  label: string;
  labelShort: string;
  /** True when the CTA leaves for Odoo rather than dialling. */
  external: boolean;
}

/**
 * Resolves the primary ordering CTA.
 *
 * Until the Odoo shop is live the restaurant takes orders by phone, so the CTA
 * stays a `tel:` link and says so — a button promising online ordering that
 * dials a landline is worse than no button. Flip `ordering.live` once the shop
 * answers and every CTA on the site moves across at once.
 */
export function orderCta(ordering: Ordering, phoneHref: string, phoneDisplay: string): OrderCta {
  if (!ordering.live) {
    return {
      href: phoneHref,
      label: `Call to order — ${phoneDisplay}`,
      labelShort: `Call to order — ${phoneDisplay}`,
      external: false,
    };
  }
  return {
    href: ordering.shopUrl,
    label: ordering.label,
    labelShort: ordering.labelShort,
    external: true,
  };
}
