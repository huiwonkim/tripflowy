import { BRAND, FOUNDER } from "@/content/brand";
import { posts } from "@/data/posts";

export const dynamic = "force-static";

const SITE = `https://www.${BRAND.domain}`;

function englishGuideLine(slug: string, titleEn: string, excerptEn: string): string {
  const summary = excerptEn.split(".")[0]?.trim() ?? "";
  return `- [${titleEn}](${SITE}/posts/${slug})${summary ? `: ${summary}` : ""}`;
}

function koreanGuideLine(slug: string, titleKo: string): string {
  return `- [${titleKo}](${SITE}/ko/posts/${slug})`;
}

export function GET(): Response {
  const tokyoPosts = posts.filter((p) => p.city === "tokyo");

  const body = [
    `# ${BRAND.name}`,
    `> Verified travel itinerary templates by ${FOUNDER.nameEn} (${FOUNDER.nameKo}),`,
    `> a Korean travel creator covering Asia since 2007.`,
    ``,
    `## Cities`,
    `- [Tokyo](${SITE}/planner?destinations=tokyo): Field-tested itinerary built from spots ${FOUNDER.nameEn} has personally walked and verified`,
    ``,
    `## Day Trips`,
    `- Kawagoe, Chichibu, Mt. Fuji day trips from Tokyo`,
    `- Nara, Himeji day trips from Osaka`,
    ``,
    `## Guides (English)`,
    ...tokyoPosts.map((p) => englishGuideLine(p.slug, p.title.en, p.excerpt.en)),
    ``,
    `## Guides (Korean)`,
    ...tokyoPosts.map((p) => koreanGuideLine(p.slug, p.title.ko)),
    ``,
    `## Planner`,
    `- [Travel Planner](${SITE}/planner)`,
    `- [여행 플래너](${SITE}/ko/planner)`,
    ``,
  ].join("\n");

  return new Response(body, {
    status: 200,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
    },
  });
}
