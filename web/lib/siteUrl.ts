/**
 * Absolute origin for canonical URLs, OG tags, robots and sitemap.
 * Overridable per-environment (staging Vercel project sets NEXT_PUBLIC_SITE_URL).
 * Falls back to the intended production domain (still unregistered — spec §3).
 */
export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://alingnene.com").replace(
  /\/$/,
  "",
);
