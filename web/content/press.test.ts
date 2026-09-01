import { describe, expect, it } from "vitest";
import { press } from "@/content/press";

describe("press content", () => {
  it("is unconfirmed until James supplies real values", () => {
    expect(press.tvFeature.confirmed).toBe(false);
    expect(press.facebook.confirmed).toBe(false);
    expect(press.vloggersConfirmed).toBe(false);
  });

  it("keeps the Facebook tag handle", () => {
    expect(press.facebook.tagHandle).toBe("@alingnenetumbatumba");
  });

  it("lists the family's Facebook vlog links, names/thumbnails still pending", () => {
    expect(press.vloggers).toHaveLength(3);
    for (const v of press.vloggers) {
      expect(v.url).toMatch(/^https:\/\/www\.facebook\.com\/share\/v\/[\w-]+\/$/);
      expect(v.platform).toBe("Facebook");
      expect(v.name).toBeUndefined();
      expect(v.poster).toBeUndefined();
    }
  });
});
