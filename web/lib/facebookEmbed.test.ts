import { describe, expect, it } from "vitest";
import { facebookEmbedSrc } from "@/lib/facebookEmbed";

describe("facebookEmbedSrc", () => {
  it("builds the official video plugin URL with the video encoded as href", () => {
    const src = new URL(facebookEmbedSrc("https://www.facebook.com/share/v/19SK2Senov/", 400));
    expect(src.origin).toBe("https://www.facebook.com");
    expect(src.pathname).toBe("/plugins/video.php");
    expect(src.searchParams.get("href")).toBe("https://www.facebook.com/share/v/19SK2Senov/");
    expect(src.searchParams.get("show_text")).toBe("false");
    expect(src.searchParams.get("autoplay")).toBe("true");
    expect(src.searchParams.get("width")).toBe("400");
  });
});
