import type { Author } from "@/types";
import { FOUNDER } from "@/content/brand";

/**
 * Author registry — each entry is a thin adapter around FOUNDER in
 * /content/brand.ts. Consumers (generateArticleJsonLd, author-box UI)
 * read identity strings through `author.brand.*` so a single edit in
 * brand.ts propagates everywhere. When adding another author, give them
 * their own brand-shaped object matching `typeof FOUNDER`.
 */
export const authors: Record<string, Author> = {
  huiwon: {
    id: "huiwon",
    brand: FOUNDER,
  },
};

export const DEFAULT_AUTHOR_ID = "huiwon";

export function getAuthor(authorId?: string): Author {
  return authors[authorId ?? DEFAULT_AUTHOR_ID] ?? authors[DEFAULT_AUTHOR_ID];
}

/**
 * Resolve brand-level identity fields for a given locale. Centralizes the
 * locale ternary so consumers (JSON-LD + UI) share one projection.
 * sameAs filters [TODO] placeholders so production JSON-LD never leaks them.
 */
export function getAuthorIdentity(author: Author, locale: "ko" | "en") {
  const isKo = locale === "ko";
  const { brand } = author;
  // Bilingual display for author-box credit lines. JSON-LD Person.name stays
  // locale-primary (책킴 / Check Kim) — displayName is UI-only.
  const displayName = isKo
    ? `${brand.nameKo} (${brand.nameEn})`        // "책킴 (Check Kim)"
    : `${brand.legalName} (${brand.nameEn})`;    // "Huiwon Kim (Check Kim)"
  return {
    name: isKo ? brand.nameKo : brand.nameEn,
    displayName,
    bio: isKo ? brand.bioKo : brand.bioEn,
    jobTitle: isKo ? brand.jobTitleKo : brand.jobTitleEn,
    alternateName: brand.alternateName,
    knowsAbout: brand.knowsAbout,
    sameAs: Object.values(brand.profiles).filter((u) => !u.includes("[TODO]")),
  };
}
