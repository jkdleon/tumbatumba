import { describe, expect, it } from "vitest";
import { restaurant } from "@/content/restaurant";

describe("restaurant content", () => {
  it("has the confirmed contact values", () => {
    expect(restaurant.phone.landlineHref).toBe("tel:+63285708560");
    expect(restaurant.phone.landlineDisplay).toBe("(02) 8570 8560");
    expect(restaurant.phone.mobileHref).toBe("tel:+639325147741");
    expect(restaurant.phone.mobileDisplay).toBe("0932 514 7741");
  });

  it("has GCash under Cristina D.", () => {
    expect(restaurant.gcash).toEqual({ number: "0932 514 7741", name: "Cristina D." });
  });

  it("opens 09:00 and closes 22:00 in Asia/Manila, daily", () => {
    expect(restaurant.hours).toEqual({
      open: "09:00",
      close: "22:00",
      tz: "Asia/Manila",
      days: "daily",
    });
  });

  it("links Facebook and Messenger", () => {
    expect(restaurant.socials.facebook).toBe("https://www.facebook.com/alingnenetumbatumba");
    expect(restaurant.socials.messenger).toBe("https://m.me/alingnenetumbatumba");
  });

  it("carries the full address", () => {
    expect(restaurant.address).toEqual({
      street: "823 General Kalentong Street",
      locality: "Mandaluyong City",
      region: "Metro Manila",
      country: "PH",
    });
  });
});
