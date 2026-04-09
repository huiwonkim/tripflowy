import type { Country, Destination, LocaleString } from "@/types";

// ── MVP 활성 도시 (9개) ──────────────────────────────
export const countries: Country[] = [
  {
    id: "japan",
    label: { en: "Japan", ko: "일본" },
    emoji: "🇯🇵",
    cities: [
      { id: "tokyo", label: { en: "Tokyo", ko: "도쿄" }, countryId: "japan" },
      { id: "osaka", label: { en: "Osaka", ko: "오사카" }, countryId: "japan" },
      { id: "kyoto", label: { en: "Kyoto", ko: "교토" }, countryId: "japan" },
      { id: "nagoya", label: { en: "Nagoya", ko: "나고야" }, countryId: "japan" },
      { id: "fukuoka", label: { en: "Fukuoka", ko: "후쿠오카" }, countryId: "japan" },
    ],
  },
  {
    id: "vietnam",
    label: { en: "Vietnam", ko: "베트남" },
    emoji: "🇻🇳",
    cities: [
      { id: "danang", label: { en: "Da Nang", ko: "다낭" }, countryId: "vietnam" },
      { id: "nhatrang", label: { en: "Nha Trang", ko: "나트랑" }, countryId: "vietnam" },
      { id: "hanoi", label: { en: "Hanoi", ko: "하노이" }, countryId: "vietnam" },
    ],
  },
  {
    id: "china",
    label: { en: "China", ko: "중국" },
    emoji: "🇨🇳",
    cities: [
      { id: "shanghai", label: { en: "Shanghai", ko: "상하이" }, countryId: "china" },
    ],
  },
];

// ── Coming Soon 국가 ─────────────────────────────────
export type ComingSoonCountry = {
  id: string;
  label: LocaleString;
  emoji: string;
};

export const comingSoonCountries: ComingSoonCountry[] = [
  { id: "thailand", label: { en: "Thailand", ko: "태국" }, emoji: "🇹🇭" },
  { id: "indonesia", label: { en: "Indonesia", ko: "인도네시아" }, emoji: "🇮🇩" },
  { id: "france", label: { en: "France", ko: "프랑스" }, emoji: "🇫🇷" },
  { id: "italy", label: { en: "Italy", ko: "이탈리아" }, emoji: "🇮🇹" },
  { id: "spain", label: { en: "Spain", ko: "스페인" }, emoji: "🇪🇸" },
  { id: "uk", label: { en: "United Kingdom", ko: "영국" }, emoji: "🇬🇧" },
  { id: "usa", label: { en: "United States", ko: "미국" }, emoji: "🇺🇸" },
  { id: "turkiye", label: { en: "Türkiye", ko: "튀르키예" }, emoji: "🇹🇷" },
];

/** Flat list of all active cities */
export function getAllCities(): Destination[] {
  return countries.flatMap((c) => c.cities);
}

/** Find country by city id */
export function getCountryByCity(cityId: string): Country | undefined {
  return countries.find((c) => c.cities.some((city) => city.id === cityId));
}

export const durationOptions = [
  { value: "3", label: { en: "3 nights / 4 days", ko: "3박 4일" }, minCities: 1 },
  { value: "4", label: { en: "4 nights / 5 days", ko: "4박 5일" }, minCities: 1 },
  { value: "5", label: { en: "5 nights / 6 days", ko: "5박 6일" }, minCities: 1 },
  { value: "7", label: { en: "7 nights / 8 days", ko: "7박 8일" }, minCities: 2 },
  { value: "10", label: { en: "10 nights / 11 days", ko: "10박 11일" }, minCities: 2 },
];

export const travelerTypeOptions = [
  { value: "couple", label: { en: "Couple", ko: "커플" }, emoji: "💑" },
  { value: "solo", label: { en: "Solo", ko: "혼자" }, emoji: "🧳" },
  { value: "family", label: { en: "Family", ko: "가족" }, emoji: "👨‍👩‍👧‍👦" },
  { value: "friends", label: { en: "Friends", ko: "친구" }, emoji: "👯" },
];

export const styleOptions = [
  { value: "relax", label: { en: "Relaxed", ko: "여유롭게" } },
  { value: "efficient", label: { en: "Efficient", ko: "알차게" } },
  { value: "activity", label: { en: "Activity", ko: "액티비티" } },
  { value: "hotel", label: { en: "Hotel", ko: "숙소 중심" } },
  { value: "food", label: { en: "Foodie", ko: "맛집 중심" } },
  { value: "photo", label: { en: "Photo Spots", ko: "포토스팟" } },
  { value: "budget", label: { en: "Budget", ko: "가성비" } },
  { value: "culture", label: { en: "Culture", ko: "문화/역사" } },
  { value: "nature", label: { en: "Nature", ko: "자연/힐링" } },
  { value: "nightlife", label: { en: "Nightlife", ko: "나이트라이프" } },
  { value: "shopping", label: { en: "Shopping", ko: "쇼핑" } },
  { value: "local", label: { en: "Like a Local", ko: "현지인 코스" } },
];
