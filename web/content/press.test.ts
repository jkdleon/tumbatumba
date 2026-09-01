import { describe, expect, it } from "vitest";
import { press } from "@/content/press";

describe("press content", () => {
  it("is unconfirmed until James supplies real values", () => {
    expect(press.tvFeature.confirmed).toBe(false);
    expect(press.facebook.confirmed).toBe(false);
  });

  it("keeps the Facebook tag handle", () => {
    expect(press.facebook.tagHandle).toBe("@alingnenetumbatumba");
  });

  it("starts with no vloggers listed", () => {
    expect(press.vloggers).toEqual([]);
  });
});
