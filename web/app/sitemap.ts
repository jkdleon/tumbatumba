import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/siteUrl";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: `${siteUrl}/`,
      lastModified: new Date("2026-11-07"),
      changeFrequency: "monthly",
      priority: 1,
    },
  ];
}
