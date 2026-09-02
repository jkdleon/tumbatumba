import { describe, expect, it } from "vitest";
import { orderCta } from "@/lib/ordering";
import { ordering } from "@/content/ordering";

const PHONE_HREF = "tel:+63285708560";
const PHONE_DISPLAY = "(02) 8570 8560";

describe("orderCta", () => {
  it("falls back to the landline while the Odoo shop is not live", () => {
    const cta = orderCta({ ...ordering, live: false }, PHONE_HREF, PHONE_DISPLAY);

    expect(cta.href).toBe(PHONE_HREF);
    expect(cta.label).toContain("Call to order");
    expect(cta.label).toContain(PHONE_DISPLAY);
    expect(cta.external).toBe(false);
  });

  it("points at the Odoo shop once live, with the reservation wording", () => {
    const cta = orderCta({ ...ordering, live: true }, PHONE_HREF, PHONE_DISPLAY);

    expect(cta.href).toBe(ordering.shopUrl);
    expect(cta.label).toBe("Order or make a reservation");
    expect(cta.labelShort).toBe("Order or reserve");
    expect(cta.external).toBe(true);
  });

  it("never promises online ordering while pointing at a tel: link", () => {
    const offline = orderCta({ ...ordering, live: false }, PHONE_HREF, PHONE_DISPLAY);

    expect(offline.href.startsWith("tel:")).toBe(true);
    expect(offline.label.toLowerCase()).not.toContain("reserv");
    expect(offline.label.toLowerCase()).not.toContain("order or");
  });
});

describe("ordering content", () => {
  it("ships dark until the Odoo shop is deployed", () => {
    // alingnene.com is not registered yet (DEPLOYMENT.md). Flipping this to
    // true before the shop resolves would put a dead link on every page.
    expect(ordering.live).toBe(false);
  });

  it("uses an https origin for the shop", () => {
    expect(ordering.shopUrl.startsWith("https://")).toBe(true);
  });

  it("keeps the short label short enough for the mobile sticky bar", () => {
    expect(ordering.labelShort.length).toBeLessThanOrEqual(24);
  });
});
