import type { MetadataRoute } from "next";
import { registry } from "./lib/registry";

const SITE_URL = "https://cligentic.railly.dev";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
  ];

  const blockRoutes: MetadataRoute.Sitemap = registry.items.map((item) => ({
    url: `${SITE_URL}/blocks/${item.name}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  return [...staticRoutes, ...blockRoutes];
}
