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
  // Exclusions:
  // - /courses and /courses/[id]: legacy noindex catalog (A.2). Sprint 7
  //   will add /courses/[city]/[slug] with index:true; include those then.
  // - /planner: form page + unbounded /planner?destinations=... query
  //   combinations. Low SEO value; discovered via internal links instead.
  const staticPages = [
    { path: "", priority: 1.0 },
    { path: "/posts", priority: 0.8 },
    { path: "/tours", priority: 0.7 },
    { path: "/hotels", priority: 0.7 },
  ];

  const hreflang = (path: string) => ({
    en: `${BASE_URL}${path}`,
    ko: `${BASE_URL}/ko${path}`,
    "x-default": `${BASE_URL}${path}`,
  });

  const staticEntries: MetadataRoute.Sitemap = staticPages.map(({ path, priority }) => ({
    url: `${BASE_URL}${path}`,
    lastModified: SITE_FRESHNESS,
    changeFrequency: "weekly" as const,
    priority,
    alternates: { languages: hreflang(path) },
  }));

  const postEntries: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${BASE_URL}/posts/${post.slug}`,
    lastModified: new Date(post.updatedAt ?? post.publishedAt),
    changeFrequency: "monthly" as const,
    priority: 0.8,
    alternates: { languages: hreflang(`/posts/${post.slug}`) },
  }));

  return [...staticEntries, ...postEntries];
}
