import { posts } from "@/data/posts";

const BASE_URL = "https://www.tripflowy.com";
const FEED_TITLE = "Tripflowy — 여행 가이드";
const FEED_DESCRIPTION = "몇 초 만에 여행을 계획하세요. 여행지, 기간, 스타일을 알려주시면 완벽한 여행 루트를 추천해드립니다.";

/**
 * Escape a string for safe inclusion inside an XML text node.
 */
function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

/**
 * Wrap content in CDATA for fields that may contain HTML-like characters.
 */
function cdata(value: string): string {
  return `<![CDATA[${value.replace(/]]>/g, "]]]]><![CDATA[>")}]]>`;
}

export async function GET() {
  // Sort by publish date (newest first)
  const sorted = [...posts].sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
  );

  const lastBuildDate = sorted[0]
    ? new Date(sorted[0].updatedAt ?? sorted[0].publishedAt).toUTCString()
    : new Date().toUTCString();

  const items = sorted
    .map((post) => {
      // Link to the Korean version (Naver primary audience)
      const link = `${BASE_URL}/ko/posts/${post.slug}`;
      const pubDate = new Date(post.publishedAt).toUTCString();
      const title = post.title.ko;
      const description = post.excerpt.ko;
      const categories = (post.categories ?? [])
        .map((c) => `    <category>${escapeXml(c)}</category>`)
        .join("\n");

      return `  <item>
    <title>${cdata(title)}</title>
    <link>${escapeXml(link)}</link>
    <guid isPermaLink="true">${escapeXml(link)}</guid>
    <pubDate>${pubDate}</pubDate>
    <description>${cdata(description)}</description>
${categories}
  </item>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
<channel>
  <title>${escapeXml(FEED_TITLE)}</title>
  <link>${BASE_URL}/ko</link>
  <description>${escapeXml(FEED_DESCRIPTION)}</description>
  <language>ko-kr</language>
  <lastBuildDate>${lastBuildDate}</lastBuildDate>
  <atom:link href="${BASE_URL}/rss.xml" rel="self" type="application/rss+xml" />
${items}
</channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=7200",
    },
  });
}
