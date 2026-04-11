import type { MetadataRoute } from "next";
import { posts } from "@/data/posts";

const BASE_URL = "https://www.tripflowy.com";

/**
 * "Site freshness" proxy for static pages: use the newest post's publish/update
 * date so search engines see a meaningful lastModified instead of `new Date()`,
 * which would tell crawlers every static page was modified on every fetch.
 * Falls back to a fixed site-launch date if there are no posts.
 */
const SITE_FRESHNESS: Date = (() => {
  const postDates = posts
    .map((p) => new Date(p.updatedAt ?? p.publishedAt).getTime())
    .filter((t) => Number.isFinite(t));
  if (postDates.length === 0) return new Date("2026-04-01");
  return new Date(Math.max(...postDates));
})();

export default function sitemap(): MetadataRoute.Sitemap {
  // /courses and /courses/[id] are intentionally excluded from the sitemap
  // because the day-course catalog is proprietary content; we don't want
  // search engines indexing or browsing it.
  const staticPages = [
    { path: "", priority: 1.0 },
    { path: "/planner", priority: 0.9 },
    { path: "/posts", priority: 0.8 },
    { path: "/tours", priority: 0.7 },
    { path: "/hotels", priority: 0.7 },
    { path: "/itineraries", priority: 0.6 },
  ];

  const staticEntries: MetadataRoute.Sitemap = staticPages.map(({ path, priority }) => ({
    url: `${BASE_URL}${path}`,
    lastModified: SITE_FRESHNESS,
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

  return [...staticEntries, ...postEntries];
}
