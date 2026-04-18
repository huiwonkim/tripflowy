import type { Coordinates, LocaleString } from "@/types";

/**
 * An "area" is a sub-region inside a city that serves two purposes:
 *  1. A unit the user can pick as their accommodation neighborhood
 *     (the dropdown in AccommodationPicker).
 *  2. A clustering key on `Spot.area` — the spot engine prefers grouping
 *     same-area spots into one Day for natural travel flow.
 *
 * `id` is a stable slug (used as the area key on Spot.area).
 * `location` is the representative coordinate — typically the main station
 * or landmark — used as the day start/end anchor when this area is the chosen
 * accommodation.
 */
export type Area = {
  id: string;
  cityId: string;
  label: LocaleString;
  location: Coordinates;
  notes?: LocaleString;
};

export const areas: Area[] = [
  // ── Tokyo (10) ────────────────────────────────────────
  { id: "shinjuku", cityId: "tokyo",
    label: { en: "Shinjuku", ko: "신주쿠" },
    location: { lat: 35.6896, lng: 139.7006 } },
  { id: "shibuya", cityId: "tokyo",
    label: { en: "Shibuya", ko: "시부야" },
    location: { lat: 35.6580, lng: 139.7016 } },
  { id: "harajuku", cityId: "tokyo",
    label: { en: "Harajuku", ko: "하라주쿠" },
    location: { lat: 35.6716, lng: 139.7026 } },
  { id: "ginza", cityId: "tokyo",
    label: { en: "Ginza", ko: "긴자" },
    location: { lat: 35.6717, lng: 139.7640 },
    notes: { en: "Includes Tsukiji", ko: "쓰키지 포함" } },
  { id: "tokyo-station", cityId: "tokyo",
    label: { en: "Tokyo Station", ko: "도쿄역" },
    location: { lat: 35.6812, lng: 139.7671 } },
  { id: "asakusa", cityId: "tokyo",
    label: { en: "Asakusa", ko: "아사쿠사" },
    location: { lat: 35.7148, lng: 139.7967 },
    notes: { en: "Includes Skytree", ko: "스카이트리 포함" } },
  { id: "ueno", cityId: "tokyo",
    label: { en: "Ueno", ko: "우에노" },
    location: { lat: 35.7138, lng: 139.7774 },
    notes: { en: "Absorbs Akihabara spots", ko: "아키하바라 스팟 포함" } },
  { id: "odaiba", cityId: "tokyo",
    label: { en: "Odaiba", ko: "오다이바" },
    location: { lat: 35.6268, lng: 139.7750 },
    notes: { en: "Includes Toyosu", ko: "토요스 포함" } },
  { id: "roppongi", cityId: "tokyo",
    label: { en: "Roppongi", ko: "롯폰기" },
    location: { lat: 35.6641, lng: 139.7294 },
    notes: { en: "Includes Azabudai Hills", ko: "아자부다이 힐즈 포함" } },
  { id: "ikebukuro", cityId: "tokyo",
    label: { en: "Ikebukuro", ko: "이케부쿠로" },
    location: { lat: 35.7295, lng: 139.7109 } },

  // ── Osaka (5) ─────────────────────────────────────────
  { id: "umeda", cityId: "osaka",
    label: { en: "Umeda (Kita)", ko: "우메다 (키타)" },
    location: { lat: 34.7024, lng: 135.4959 } },
  { id: "namba", cityId: "osaka",
    label: { en: "Namba (Minami)", ko: "난바 (미나미)" },
    location: { lat: 34.6687, lng: 135.5011 },
    notes: { en: "Includes Dotonbori & Shinsaibashi", ko: "도톤보리·신사이바시 포함" } },
  { id: "tennoji", cityId: "osaka",
    label: { en: "Tennoji", ko: "텐노지" },
    location: { lat: 34.6460, lng: 135.5130 } },
  { id: "osaka-castle", cityId: "osaka",
    label: { en: "Osaka Castle", ko: "오사카성" },
    location: { lat: 34.6873, lng: 135.5262 } },
  { id: "universal", cityId: "osaka",
    label: { en: "Universal (USJ)", ko: "유니버설" },
    location: { lat: 34.6666, lng: 135.4322 } },

  // ── Kyoto (6) ─────────────────────────────────────────
  { id: "kyoto-station", cityId: "kyoto",
    label: { en: "Kyoto Station", ko: "교토역" },
    location: { lat: 34.9859, lng: 135.7585 } },
  { id: "higashiyama", cityId: "kyoto",
    label: { en: "Higashiyama", ko: "히가시야마" },
    location: { lat: 35.0036, lng: 135.7785 },
    notes: { en: "Gion & Kiyomizu-dera", ko: "기온·기요미즈 포함" } },
  { id: "arashiyama", cityId: "kyoto",
    label: { en: "Arashiyama", ko: "아라시야마" },
    location: { lat: 35.0169, lng: 135.6768 } },
  { id: "central-kyoto", cityId: "kyoto",
    label: { en: "Central Kyoto", ko: "교토 시내" },
    location: { lat: 35.0047, lng: 135.7685 },
    notes: { en: "Nishiki & Pontocho", ko: "니시키·폰토초" } },
  { id: "northern-kyoto", cityId: "kyoto",
    label: { en: "Northern Kyoto", ko: "교토 북부" },
    location: { lat: 35.0394, lng: 135.7294 },
    notes: { en: "Kinkaku-ji, Ginkaku-ji, Philosopher's Path", ko: "킨카쿠지·긴카쿠지·철학의 길" } },
  { id: "uji", cityId: "kyoto",
    label: { en: "Uji", ko: "우지" },
    location: { lat: 34.8889, lng: 135.8074 },
    notes: { en: "Byodo-in temple", ko: "뵤도인" } },

  // ── Fukuoka (5) ───────────────────────────────────────
  { id: "hakata", cityId: "fukuoka",
    label: { en: "Hakata", ko: "하카타" },
    location: { lat: 33.5902, lng: 130.4207 } },
  { id: "tenjin", cityId: "fukuoka",
    label: { en: "Tenjin", ko: "텐진" },
    location: { lat: 33.5903, lng: 130.3985 },
    notes: { en: "Includes Nakasu", ko: "나카스 포함" } },
  { id: "momochi", cityId: "fukuoka",
    label: { en: "Momochi", ko: "모모치" },
    location: { lat: 33.5939, lng: 130.3517 } },
  { id: "dazaifu", cityId: "fukuoka",
    label: { en: "Dazaifu", ko: "다자이후" },
    location: { lat: 33.5115, lng: 130.5352 } },
  { id: "yufuin-beppu", cityId: "fukuoka",
    label: { en: "Yufuin / Beppu", ko: "유후인 / 벳푸" },
    location: { lat: 33.2651, lng: 131.3581 },
    notes: { en: "Yufuin Station — day-trip base", ko: "유후인역 (당일치기 거점)" } },
];

export function getAreasByCity(cityId: string): Area[] {
  return areas.filter((a) => a.cityId === cityId);
}

export function getAreaById(id: string): Area | undefined {
  return areas.find((a) => a.id === id);
}
