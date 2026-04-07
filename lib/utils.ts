import type { Itinerary, Hotel, Tour, Locale, LocaleString, PlannerInput, TravelerType, TravelStyle } from "@/types";
import { itineraries } from "@/data/itineraries";

export function t(str: LocaleString, locale: Locale = "en"): string {
  return str[locale] ?? str.en;
}

export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(" ");
}

export function filterItineraries(input: Partial<PlannerInput>): Itinerary[] {
  return itineraries.filter((itin) => {
    if (input.destination && itin.destination !== input.destination) return false;
    if (input.duration && itin.duration !== Number(input.duration)) return false;
    if (input.travelerType && !itin.travelerType.includes(input.travelerType as TravelerType)) return false;
    if (input.style && itin.style !== input.style) return false;
    return true;
  });
}

export function getItineraryBySlug(slug: string): Itinerary | undefined {
  return itineraries.find((i) => i.slug === slug);
}

export function getFeaturedItineraries(): Itinerary[] {
  return itineraries.filter((i) => i.featured);
}

export function durationLabel(nights: number, locale: Locale = "en"): string {
  const days = nights + 1;
  if (locale === "ko") return `${nights}박 ${days}일`;
  return `${nights} nights / ${days} days`;
}

export function styleLabel(style: TravelStyle, locale: Locale = "en"): string {
  const map: Record<TravelStyle, LocaleString> = {
    relaxed: { en: "Relaxed", ko: "여유 여행" },
    efficient: { en: "Efficient", ko: "알찬 여행" },
    "activity-focused": { en: "Activity-Focused", ko: "액티비티 중심" },
    "hotel-focused": { en: "Hotel-Focused", ko: "숙소 중심" },
  };
  return map[style][locale] ?? map[style].en;
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
