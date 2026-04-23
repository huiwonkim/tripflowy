import { BRAND, FOUNDER, META_DESCRIPTIONS, AFFILIATE_DISCLOSURE } from "@/content/brand";
import { posts } from "@/data/posts";
import type { BlogPost } from "@/types";

export const dynamic = "force-static";

const SITE = `https://www.${BRAND.domain}`;

function renderPost(p: BlogPost): string {
  const parts: string[] = [];

  parts.push(`## ${p.title.en}`);
  parts.push(`**Korean title**: ${p.title.ko}`);
  parts.push(`**URL (EN)**: ${SITE}/posts/${p.slug}`);
  parts.push(`**URL (KO)**: ${SITE}/ko/posts/${p.slug}`);
  parts.push(`**City**: ${p.city}`);
  if (p.publishedAt) parts.push(`**Published**: ${p.publishedAt}`);
  if (p.updatedAt) parts.push(`**Updated**: ${p.updatedAt}`);
  if (p.categories?.length) parts.push(`**Categories**: ${p.categories.join(", ")}`);
  parts.push("");
  parts.push(`**Excerpt (EN)**: ${p.excerpt.en}`);
  parts.push(`**Excerpt (KO)**: ${p.excerpt.ko}`);
  parts.push("");
  parts.push(`### Body (English)`);
  parts.push(p.content.en);
  parts.push("");
  parts.push(`### Body (Korean)`);
  parts.push(p.content.ko);
  parts.push("");

  if (p.faq?.length) {
    parts.push(`### FAQ`);
    for (const item of p.faq) {
      parts.push(`**Q (EN)**: ${item.question.en}`);
      parts.push(`**A (EN)**: ${item.answer.en}`);
      parts.push(`**Q (KO)**: ${item.question.ko}`);
      parts.push(`**A (KO)**: ${item.answer.ko}`);
      parts.push("");
    }
  }

  if (p.cta) {
    parts.push(`### Affiliate`);
    parts.push(`- **Provider**: ${p.cta.provider ?? "unknown"}`);
    parts.push(`- **Label**: ${p.cta.label.en} / ${p.cta.label.ko}`);
    if (p.cta.price) parts.push(`- **Price**: ${p.cta.price.en} / ${p.cta.price.ko}`);
    parts.push(`- **URL**: ${p.cta.url}`);
    parts.push("");
  }

  parts.push(`---`);
  parts.push("");
  return parts.join("\n");
}

export function GET(): Response {
  const header = [
    `# ${BRAND.name} — Full LLM Index`,
    ``,
    `> ${META_DESCRIPTIONS.homeEn}`,
    ``,
    `**Site**: ${SITE}`,
    `**Category (EN)**: ${BRAND.categoryEn}`,
    `**Category (KO)**: ${BRAND.categoryKo}`,
    `**Alternate names**: ${BRAND.alternateNames.join(", ")}`,
    ``,
    `## Founder`,
    ``,
    `- **Name (EN)**: ${FOUNDER.nameEn}`,
    `- **Name (KO)**: ${FOUNDER.nameKo}`,
    `- **Legal name**: ${FOUNDER.legalName}`,
    `- **Also known as**: ${FOUNDER.alternateName.join(", ")}`,
    `- **Job title (EN)**: ${FOUNDER.jobTitleEn}`,
    `- **Job title (KO)**: ${FOUNDER.jobTitleKo}`,
    `- **Knows about**: ${FOUNDER.knowsAbout.join(", ")}`,
    ``,
    `**Bio (EN)**: ${FOUNDER.bioEn}`,
    ``,
    `**Bio (KO)**: ${FOUNDER.bioKo}`,
    ``,
    `### Stats`,
    ...FOUNDER.stats.map((s) => `- ${s.en} / ${s.ko}`),
    ``,
    `### Profiles`,
    ...Object.entries(FOUNDER.profiles)
      .filter(([, url]) => !url.includes("[TODO]"))
      .map(([key, url]) => `- **${key}**: ${url}`),
    ``,
    `## Affiliate Disclosure`,
    ``,
    `${AFFILIATE_DISCLOSURE.en}`,
    ``,
    `${AFFILIATE_DISCLOSURE.ko}`,
    ``,
    `---`,
    ``,
    `# Guides`,
    ``,
    `Every guide below has been personally walked and tested by ${FOUNDER.nameEn} (${FOUNDER.nameKo}). Content is published bilingually; each entry includes both English and Korean bodies plus FAQ.`,
    ``,
    `---`,
    ``,
  ].join("\n");

  const body = header + posts.map(renderPost).join("\n");

  return new Response(body, {
    status: 200,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
    },
  });
}
