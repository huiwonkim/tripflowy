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
  return {
    name: isKo ? author.brand.nameKo : author.brand.nameEn,
    bio: isKo ? author.brand.bioKo : author.brand.bioEn,
    jobTitle: isKo ? author.brand.jobTitleKo : author.brand.jobTitleEn,
    alternateName: author.brand.alternateName,
    knowsAbout: author.brand.knowsAbout,
    sameAs: Object.values(author.brand.profiles).filter((u) => !u.includes("[TODO]")),
  };
}
