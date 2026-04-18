import type { Country, Destination, LocaleString } from "@/types";

// ── MVP 활성 도시 (7개) ──────────────────────────────
// heroImage points to public/images/city-heroes/{cityId}.jpg. If the file
// is missing the planner banner falls back to the gradient-only background.
export const countries: Country[] = [
  {
    id: "japan",
    label: { en: "Japan", ko: "일본" },
    emoji: "🇯🇵",
    cities: [
      { id: "tokyo", label: { en: "Tokyo", ko: "도쿄" }, countryId: "japan", heroImage: "/images/city-heroes/tokyo.jpg",
        defaultAccommodation: { label: { en: "Shinjuku Station (default)", ko: "신주쿠역 (기본값)" }, location: { lat: 35.6896, lng: 139.7006 } } },
      { id: "osaka", label: { en: "Osaka", ko: "오사카" }, countryId: "japan", heroImage: "/images/city-heroes/osaka.jpg",
        defaultAccommodation: { label: { en: "Umeda Station (default)", ko: "우메다역 (기본값)" }, location: { lat: 34.7024, lng: 135.4959 } } },
      { id: "kyoto", label: { en: "Kyoto", ko: "교토" }, countryId: "japan", heroImage: "/images/city-heroes/kyoto.jpg",
        defaultAccommodation: { label: { en: "Kyoto Station (default)", ko: "교토역 (기본값)" }, location: { lat: 34.9859, lng: 135.7585 } } },
      { id: "fukuoka", label: { en: "Fukuoka", ko: "후쿠오카" }, countryId: "japan", heroImage: "/images/city-heroes/fukuoka.jpg",
        defaultAccommodation: { label: { en: "Hakata Station (default)", ko: "하카타역 (기본값)" }, location: { lat: 33.5902, lng: 130.4207 } } },
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
  { id: "vietnam", label: { en: "Vietnam", ko: "베트남" }, emoji: "🇻🇳" },
  { id: "china", label: { en: "China", ko: "중국" }, emoji: "🇨🇳" },
  { id: "thailand", label: { en: "Thailand", ko: "태국" }, emoji: "🇹🇭" },
  { id: "indonesia", label: { en: "Indonesia", ko: "인도네시아" }, emoji: "🇮🇩" },
  { id: "hongkong", label: { en: "Hong Kong", ko: "홍콩" }, emoji: "🇭🇰" },
  { id: "macau", label: { en: "Macau", ko: "마카오" }, emoji: "🇲🇴" },
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
  { value: "6", label: { en: "6 nights / 7 days", ko: "6박 7일" }, minCities: 1 },
  { value: "7", label: { en: "7 nights / 8 days", ko: "7박 8일" }, minCities: 2 },
  { value: "9", label: { en: "9 nights / 10 days", ko: "9박 10일" }, minCities: 2 },
];

export const travelerTypeOptions = [
  { value: "solo", label: { en: "Solo", ko: "혼자" }, emoji: "🧳" },
  { value: "friends", label: { en: "Friends", ko: "친구" }, emoji: "👯" },
  { value: "couple", label: { en: "Couple", ko: "커플" }, emoji: "💑" },
  { value: "family", label: { en: "Family", ko: "가족" }, emoji: "👨‍👩‍👧‍👦" },
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
