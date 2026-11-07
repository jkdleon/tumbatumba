/**
 * Facebook's official video embed (the iframe behind the "Embed" option on any
 * public video). Only ever rendered after a visitor taps a reel, so no Facebook
 * code or cookies load with the page itself.
 */
export const FACEBOOK_EMBED_ORIGIN = "https://www.facebook.com";

export function facebookEmbedSrc(videoUrl: string, width = 560): string {
  const params = new URLSearchParams({
    href: videoUrl,
    show_text: "false",
    autoplay: "true",
    width: String(Math.round(width)),
  });
  return `${FACEBOOK_EMBED_ORIGIN}/plugins/video.php?${params.toString()}`;
}
