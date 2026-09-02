export interface Ordering {
  /**
   * Origin of the Odoo shop. Ordering, availability and next-day reservations
   * live in Odoo — this site never talks to it, it just links across. Keeping
   * the handoff to a plain link is what lets `output: "export"` stay put and
   * leaves the CSP in vercel.json untouched.
   */
  shopUrl: string;
  /**
   * False until the Odoo shop is actually serving. While false every ordering
   * CTA falls back to the landline, which is how the restaurant takes orders
   * today — so shipping this early changes nothing on the live site.
   */
  live: boolean;
  /** Primary CTA copy once `live`. Short form is for the sticky mobile bar. */
  label: string;
  labelShort: string;
  /** Sits under the CTA so the promise matches how the kitchen actually works. */
  note: string;
}

/**
 * The website/Odoo handoff. `alingnene.com` is not registered yet (see
 * DEPLOYMENT.md), so `shopUrl` is the intended subdomain, not a live host —
 * `live: false` keeps it out of the DOM until it resolves.
 */
export const ordering: Ordering = {
  shopUrl: "https://order.alingnene.com",
  live: false,
  label: "Order or make a reservation",
  labelShort: "Order or reserve",
  note: "Pick-up today, or reserve for tomorrow. Dine-in tables by phone.",
};
