import type { MetadataRoute } from "next";
import { itineraries } from "@/data/itineraries";

const BASE_URL = "https://tripflowy.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages = [
    { path: "", priority: 1.0 },
    { path: "/itineraries", priority: 0.9 },
    { path: "/planner", priority: 0.8 },
    { path: "/tours", priority: 0.7 },
    { path: "/hotels", priority: 0.7 },
  ];

  const staticEntries: MetadataRoute.Sitemap = staticPages.flatMap(({ path, priority }) => [
    {
      url: `${BASE_URL}${path}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority,
      alternates: {
        languages: {
          en: `${BASE_URL}${path}`,
          ko: `${BASE_URL}/ko${path}`,
        },
      },
    },
  ]);

  const itineraryEntries: MetadataRoute.Sitemap = itineraries.map((itin) => ({
    url: `${BASE_URL}/itineraries/${itin.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
    alternates: {
      languages: {
        en: `${BASE_URL}/itineraries/${itin.slug}`,
        ko: `${BASE_URL}/ko/itineraries/${itin.slug}`,
      },
    },
  }));

  return [...staticEntries, ...itineraryEntries];
}
