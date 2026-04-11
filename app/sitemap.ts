import type { MetadataRoute } from "next";
import { dayCourses } from "@/data/day-courses";
import { posts } from "@/data/posts";

const BASE_URL = "https://www.tripflowy.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages = [
    { path: "", priority: 1.0 },
    { path: "/planner", priority: 0.9 },
    { path: "/posts", priority: 0.8 },
    { path: "/tours", priority: 0.7 },
    { path: "/hotels", priority: 0.7 },
    { path: "/courses", priority: 0.6 },
    { path: "/itineraries", priority: 0.6 },
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

  const postEntries: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${BASE_URL}/posts/${post.slug}`,
    lastModified: new Date(post.updatedAt ?? post.publishedAt),
    changeFrequency: "monthly" as const,
    priority: 0.8,
    alternates: {
      languages: {
        en: `${BASE_URL}/posts/${post.slug}`,
        ko: `${BASE_URL}/ko/posts/${post.slug}`,
      },
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

  return [...staticEntries, ...postEntries, ...courseEntries];
}
