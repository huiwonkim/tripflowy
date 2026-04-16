import type { Author } from "@/types";

/**
 * Author profiles referenced by BlogPost.authorId.
 * Used for bylines, author bio boxes, and schema.org Person JSON-LD.
 */
export const authors: Record<string, Author> = {
  huiwon: {
    id: "huiwon",
    name: {
      ko: "김희원",
      en: "Huiwon Kim",
    },
    nickname: {
      ko: "책킴",
      en: "Check Kim",
    },
    role: {
      ko: "tripflowy 창업자 · 여행 크리에이터",
      en: "Founder, TripFlowy · Travel Creator",
    },
    bio: {
      ko: "2007년부터 일본을 20번 넘게 다녀온 여행 크리에이터. 한국에서는 '책킴'이라는 이름으로 활동하고, 2025년 한 해 동안만 비행기를 64번 탔다. 테마파크·공항 교통·전망대 가이드를 주로 쓴다.",
      en: "Travel creator with 20+ trips to Japan since 2007. Known as '책킴 (Check Kim)' in Korea, and boarded 64 flights in 2025 alone. Writes mostly about theme parks, airport transit, and observation decks.",
    },
    expertise: [
      "Japan travel",
      "Tokyo",
      "Theme parks",
      "Airport transit",
      "Observation decks",
    ],
  },
};

export const DEFAULT_AUTHOR_ID = "huiwon";

export function getAuthor(authorId?: string): Author {
  return authors[authorId ?? DEFAULT_AUTHOR_ID] ?? authors[DEFAULT_AUTHOR_ID];
}
