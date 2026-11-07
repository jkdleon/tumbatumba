import { describe, expect, it } from "vitest";
import vercel from "@/vercel.json";

const csp = vercel.headers
  .find((h) => h.source === "/(.*)")!
  .headers.find((h) => h.key === "Content-Security-Policy")!.value;

describe("Content-Security-Policy", () => {
  it("allows exactly Facebook's player to be framed (for the vlog popup)", () => {
    expect(csp).toContain("frame-src https://www.facebook.com;");
  });

  it("still forbids anyone framing this site, and plugins", () => {
    expect(csp).toContain("frame-ancestors 'none'");
    expect(csp).toContain("object-src 'none'");
  });
});
