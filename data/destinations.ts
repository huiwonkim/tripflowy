import type { Country, Destination } from "@/types";

export const countries: Country[] = [
  {
    id: "vietnam",
    label: { en: "Vietnam", ko: "베트남" },
    emoji: "🇻🇳",
    cities: [
      { id: "danang", label: { en: "Da Nang", ko: "다낭" }, countryId: "vietnam" },
      { id: "hochiminh", label: { en: "Ho Chi Minh City", ko: "호치민" }, countryId: "vietnam" },
      { id: "hanoi", label: { en: "Hanoi", ko: "하노이" }, countryId: "vietnam" },
    ],
  },
  {
    id: "thailand",
    label: { en: "Thailand", ko: "태국" },
    emoji: "🇹🇭",
    cities: [
      { id: "bangkok", label: { en: "Bangkok", ko: "방콕" }, countryId: "thailand" },
      { id: "chiangmai", label: { en: "Chiang Mai", ko: "치앙마이" }, countryId: "thailand" },
      { id: "phuket", label: { en: "Phuket", ko: "푸켓" }, countryId: "thailand" },
    ],
  },
  {
    id: "indonesia",
    label: { en: "Indonesia", ko: "인도네시아" },
    emoji: "🇮🇩",
    cities: [
      { id: "bali", label: { en: "Bali", ko: "발리" }, countryId: "indonesia" },
      { id: "jakarta", label: { en: "Jakarta", ko: "자카르타" }, countryId: "indonesia" },
    ],
  },
  {
    id: "japan",
    label: { en: "Japan", ko: "일본" },
    emoji: "🇯🇵",
    cities: [
      { id: "tokyo", label: { en: "Tokyo", ko: "도쿄" }, countryId: "japan" },
      { id: "osaka", label: { en: "Osaka", ko: "오사카" }, countryId: "japan" },
      { id: "kyoto", label: { en: "Kyoto", ko: "교토" }, countryId: "japan" },
    ],
  },
  {
    id: "france",
    label: { en: "France", ko: "프랑스" },
    emoji: "🇫🇷",
    cities: [
      { id: "paris", label: { en: "Paris", ko: "파리" }, countryId: "france" },
    ],
  },
  {
    id: "singapore",
    label: { en: "Singapore", ko: "싱가포르" },
    emoji: "🇸🇬",
    cities: [
      { id: "singapore", label: { en: "Singapore", ko: "싱가포르" }, countryId: "singapore" },
    ],
  },
];

/** Flat list of all cities for backward compatibility */
export function getAllCities(): Destination[] {
  return countries.flatMap((c) => c.cities);
}

/** Find country by city id */
export function getCountryByCity(cityId: string): Country | undefined {
  return countries.find((c) => c.cities.some((city) => city.id === cityId));
}

export const durationOptions = [
  { value: "3", label: { en: "3 nights / 4 days", ko: "3박 4일" } },
  { value: "4", label: { en: "4 nights / 5 days", ko: "4박 5일" } },
  { value: "5", label: { en: "5 nights / 6 days", ko: "5박 6일" } },
  { value: "7", label: { en: "7 nights / 8 days", ko: "7박 8일" } },
  { value: "10", label: { en: "10 nights / 11 days", ko: "10박 11일" } },
];

export const travelerTypeOptions = [
  { value: "couple", label: { en: "Couple", ko: "커플" }, emoji: "💑" },
  { value: "solo", label: { en: "Solo", ko: "혼자" }, emoji: "🧳" },
  { value: "family", label: { en: "Family", ko: "가족" }, emoji: "👨‍👩‍👧‍👦" },
  { value: "friends", label: { en: "Friends", ko: "친구" }, emoji: "👯" },
];

export const styleOptions = [
  { value: "relaxed", label: { en: "Relaxed", ko: "여유롭게" }, description: { en: "Slow pace, beaches & cafes", ko: "여유로운 여행, 해변과 카페" } },
  { value: "efficient", label: { en: "Efficient", ko: "알차게" }, description: { en: "See more in less time", ko: "짧은 시간에 알차게" } },
  { value: "activity-focused", label: { en: "Activity-Focused", ko: "액티비티 중심" }, description: { en: "Adventures & experiences", ko: "액티비티와 체험 중심" } },
  { value: "hotel-focused", label: { en: "Hotel-Focused", ko: "숙소 중심" }, description: { en: "Premium stays & resort time", ko: "프리미엄 숙소와 리조트" } },
];
