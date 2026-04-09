import type { Locale, LocaleString, TravelerType, TravelStyle } from "@/types";

export function t(str: LocaleString, locale: Locale = "en"): string {
  return str[locale] ?? str.en;
}

export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(" ");
}

export function durationLabel(nights: number, locale: Locale = "en"): string {
  const days = nights + 1;
  if (locale === "ko") return `${nights}박 ${days}일`;
  return `${nights} nights / ${days} days`;
}

export function styleLabel(style: TravelStyle, locale: Locale = "en"): string {
  const map: Record<TravelStyle, LocaleString> = {
    relax: { en: "Relaxed", ko: "여유롭게" },
    efficient: { en: "Efficient", ko: "알차게" },
    activity: { en: "Activity", ko: "액티비티" },
    hotel: { en: "Hotel", ko: "숙소 중심" },
    food: { en: "Foodie", ko: "맛집 중심" },
    photo: { en: "Photo Spots", ko: "포토스팟" },
    budget: { en: "Budget", ko: "가성비" },
    culture: { en: "Culture", ko: "문화/역사" },
    nature: { en: "Nature", ko: "자연/힐링" },
    nightlife: { en: "Nightlife", ko: "나이트라이프" },
    shopping: { en: "Shopping", ko: "쇼핑" },
    local: { en: "Like a Local", ko: "현지인 코스" },
  };
  return map[style]?.[locale] ?? style;
}

export function travelerLabel(type: TravelerType, locale: Locale = "en"): string {
  const map: Record<TravelerType, LocaleString> = {
    couple: { en: "Couple", ko: "커플" },
    solo: { en: "Solo", ko: "혼자" },
    family: { en: "Family", ko: "가족" },
    friends: { en: "Friends", ko: "친구" },
  };
  return map[type][locale] ?? map[type].en;
}

export function ratingStars(rating: number): string {
  return "★".repeat(Math.floor(rating)) + (rating % 1 >= 0.5 ? "½" : "");
}

export function priceRangeLabel(range: string): string {
  const map: Record<string, string> = {
    $: "Budget",
    $$: "Moderate",
    $$$: "Upscale",
    $$$$: "Luxury",
  };
  return map[range] ?? range;
}
