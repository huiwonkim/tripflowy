import type { MetadataRoute } from "next";
import { dayCourses } from "@/data/day-courses";

const BASE_URL = "https://tripflowy.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages = [
    { path: "", priority: 1.0 },
    { path: "/itineraries", priority: 0.9 },
    { path: "/planner", priority: 0.8 },
    { path: "/courses", priority: 0.8 },
    { path: "/tours", priority: 0.7 },
    { path: "/hotels", priority: 0.7 },
  ];

  const staticEntries: MetadataRoute.Sitemap = staticPages.map(({ path, priority }) => ({
    url: `${BASE_URL}${path}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority,
    alternates: {
      languages: { en: `${BASE_URL}${path}`, ko: `${BASE_URL}/ko${path}` },
    },
  }));

  const courseEntries: MetadataRoute.Sitemap = dayCourses.map((course) => ({
    url: `${BASE_URL}/courses/${course.id}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.7,
    alternates: {
      languages: {
        en: `${BASE_URL}/courses/${course.id}`,
        ko: `${BASE_URL}/ko/courses/${course.id}`,
      },
    },
  }));

  return [...staticEntries, ...courseEntries];
}
