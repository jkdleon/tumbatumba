import { describe, expect, it } from "vitest";
import robots from "@/app/robots";
import sitemap from "@/app/sitemap";
import { siteUrl } from "@/lib/siteUrl";

describe("robots", () => {
  it("allows all and points at the sitemap", () => {
    const r = robots();
    expect(r.rules).toEqual({ userAgent: "*", allow: "/" });
    expect(r.sitemap).toBe(`${siteUrl}/sitemap.xml`);
  });
});

describe("sitemap", () => {
  it("lists the single landing page", () => {
    const urls = sitemap().map((e) => e.url);
    expect(urls).toEqual([`${siteUrl}/`]);
  });
});
