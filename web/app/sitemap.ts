import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/siteUrl";

export const dynamic = "force-static";

// Both directions stay listed while James previews. At cutover (spec §4.4)
// drop the losing route.
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date("2026-09-01");
  return [
    { url: `${siteUrl}/`, lastModified, changeFrequency: "monthly", priority: 1 },
    { url: `${siteUrl}/heritage`, lastModified, changeFrequency: "monthly", priority: 0.5 },
  ];
}
