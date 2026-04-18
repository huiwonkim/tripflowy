import type { CategoryId } from "@/data/categories";

export type Locale = "en" | "ko";

export type LocaleString = {
  en: string;
  ko: string;
};

export type TravelerType = "solo" | "parents" | "kids" | "couple" | "friends";
export type TravelStyle = "relax" | "efficient" | "activity" | "hotel" | "food" | "photo" | "budget" | "culture" | "nature" | "nightlife" | "shopping" | "local" | "popular";
export type ActivityType =
  | "transport"
  | "sightseeing"
  | "dining"
  | "accommodation"
  | "tour"
  | "free"
  | "beach"
  | "shopping";

// ── GPS ────────────────────────────────────────────
export type Coordinates = {
  lat: number;
  lng: number;
};

// ── 1일 코스 (atomic content unit) ─────────────────
export type BookingLinks = {
  klook?: string;
  agoda?: string;
  mrt?: string;
  direct?: string;
};

export type DayActivity = {
  time: string;
  title: LocaleString;
  description: LocaleString;
  tips?: LocaleString[];         // 팁 (여러 줄)
  type: ActivityType;
  location?: Coordinates;
  duration?: number;              // 체류 시간 (분)
  /** @deprecated prefer `photos` — kept for legacy DayCourse data. */
  photo?: string;
  /** Multiple photos, shown as a horizontal carousel in the day card. */
  photos?: string[];
  postSlug?: string;              // 가이드 포스트 연결
  bookingLinks?: BookingLinks;    // 어필리에이트 링크
  /** Present when the activity came from the spot engine — used for URL encoding and swap UI. */
  spotId?: string;
};

export type DayCostBreakdown = {
  food: number;
  activity: number;
  transport: number;
  etc: number;
  currency: string;
};

export type DayCourse = {
  id: string;
  city: string;
  title: LocaleString;
  summary: LocaleString;
  whyThisCourse?: LocaleString[];  // 이 코스를 가야 하는 이유 (불릿 포인트)
  courseType?: LocaleString[];    // 태그 (한/영)
  styles: TravelStyle[];
  travelerTypes: TravelerType[];
  activities: DayActivity[];
  center: Coordinates;
  tags: string[];
  coverGradient: string;
  costs?: DayCostBreakdown;
  googleMapsUrl?: string;        // 수동 입력한 Google Maps 경로/리스트 링크
  mapImage?: {                   // 로케일별 캡처 지도 이미지 (public/ 경로)
    en: string;
    ko: string;
  };
};

// ── 항공/숙소 가격 추정 ────────────────────────────
export type PriceRange = "$" | "$$" | "$$$" | "$$$$";

export type FlightEstimate = {
  fsc: { min: number; max: number };
  lcc: { min: number; max: number };
  currency: string;
  source: "api" | "estimate";
  updatedAt?: string;
};

export type HotelEstimate = {
  budget: { min: number; max: number };
  standard: { min: number; max: number };
  luxury: { min: number; max: number };
  currency: string;
  source: "api" | "estimate";
  updatedAt?: string;
};

// ── 생성된 일정 (조합 결과) ────────────────────────
export type GeneratedDay = {
  dayNumber: number;
  course: DayCourse;
  city: string;
};

export type GeneratedItinerary = {
  days: GeneratedDay[];
  cities: string[];
  duration: number;
  style: TravelStyle;
  travelerType: TravelerType;
};

// ── 도시 정보 ──────────────────────────────────────
export type FAQ = {
  question: LocaleString;
  answer: LocaleString;
};

export type MonthlyClimate = {
  tempHigh: number[];  // 12 months, °C
  tempLow: number[];   // 12 months, °C
  rain: number[];      // 12 months, mm
};

export type CityBasicInfo = {
  visa: LocaleString;
  timezone: LocaleString;
  currency: LocaleString;
  language: LocaleString;
  voltage: LocaleString;
  climate: MonthlyClimate;
  bestMonths: number[];  // e.g. [3,4,5,10,11]
};

export type CityInfo = {
  cityId: string;
  faq: FAQ[];
  info?: CityBasicInfo;
};

// ── 호텔 / 투어 ───────────────────────────────────
export type Hotel = {
  id: string;
  slug: string;
  name: string;
  destination: string;
  destinationLabel: LocaleString;
  style: TravelStyle[];
  priceRange: PriceRange;
  description: LocaleString;
  bestFor: LocaleString[];
  affiliateUrl: string;
  coverGradient: string;
  rating: number;
  reviewCount: number;
  location: LocaleString;
};

export type Tour = {
  id: string;
  slug: string;
  title: LocaleString;
  destination: string;
  destinationLabel: LocaleString;
  durationLabel: LocaleString;
  price: number;
  currency: string;
  style: TravelStyle[];
  description: LocaleString;
  highlights: LocaleString[];
  affiliateUrl: string;
  coverGradient: string;
  rating: number;
  reviewCount: number;
};

// ── 저자 ───────────────────────────────────────────
export type Author = {
  id: string;
  name: LocaleString;            // "김희원" / "Huiwon Kim"
  nickname?: LocaleString;        // "책킴" / "Chaek Kim" (optional alias)
  role: LocaleString;             // "Founder, TripFlowy" etc.
  bio: LocaleString;              // 2~3 sentence intro for author box
  expertise: string[];            // ["Japan theme parks", "Airport transit", ...] - schema knowsAbout
  image?: string;                 // /images/authors/xxx.jpg
  url?: string;                   // Personal site / social
  sameAs?: string[];              // Social profiles for schema.org Person.sameAs
};

// ── 블로그 포스트 (코스 상세 후기) ──────────────────
export type PostImage = {
  src: string;             // /images/posts/xxx.jpg
  alt: LocaleString;
  caption?: LocaleString;
};

export type PostCTA = {
  label: LocaleString;           // "시부야스카이 입장권 예약하기"
  url: string;                   // 어필리에이트 링크
  provider: string;              // "Klook", "Agoda" 등
  price?: LocaleString;          // "2,200엔~"
  note?: LocaleString;           // "온라인 예매 시 300엔 할인"
};

/** Comparison table — AI/AEO-friendly structured data. Embedded via {{compare:N}} marker. */
export type ComparisonTable = {
  title?: LocaleString;          // optional table heading
  columns: LocaleString[];       // column headers, 2~4 items
  rows: {
    label: LocaleString;          // row label (leftmost column)
    values: LocaleString[];       // one per column
    highlight?: number;           // optional column index to emphasize
  }[];
  caption?: LocaleString;        // optional footnote
};

export type BlogPost = {
  slug: string;
  courseId?: string;       // 연결된 DayCourse ID (있으면 코스에서 링크)
  title: LocaleString;
  excerpt: LocaleString;   // 목록에서 보이는 짧은 요약
  content: LocaleString;   // 마크다운 본문
  city: string;
  coverImage?: string;     // /images/posts/xxx.jpg
  coverGradient: string;
  images?: PostImage[];    // 본문 중간에 삽입할 이미지들
  tags: string[];
  categories?: CategoryId[];
  faq?: FAQ[];             // 포스트 하단 FAQ (SEO용)
  cta?: PostCTA;           // 어필리에이트 CTA
  publishedAt: string;     // ISO date
  updatedAt?: string;
  authorId?: string;       // lib/authors.ts의 ID 참조. 없으면 default author 사용
  comparisons?: ComparisonTable[]; // {{compare:N}} 마커로 본문에 삽입
};

// ── 플래너 입력 ────────────────────────────────────
import type { Pace } from "@/types/spot";

/**
 * User-entered accommodation for a city.
 * MVP: label is free-text; location falls back to the city's defaultAccommodation
 * when the user hasn't picked a specific address. V2 will add Places Autocomplete.
 */
export type AccommodationInput = {
  label: string;
  location: Coordinates;
  source: "default" | "manual" | "places";
};

export type PlannerInput = {
  destinations: string[];
  duration: string;
  travelerType: TravelerType | "";
  styles: TravelStyle[];
  /** Day-level spot density. Default "balanced" when not set. */
  pace?: Pace;
  /** city id → accommodation. Populated per selected destination. */
  accommodations?: Record<string, AccommodationInput>;
  /** ISO yyyy-mm-dd — optional. Used for opening-hours / closedDays checks. */
  startDate?: string;
  /** Optional arrival/departure flight info for first/last-day time planning. */
  arrival?: { airport?: string; time?: string };
  departure?: { airport?: string; time?: string };
};

// ── 여행지 구조 ────────────────────────────────────
export type Destination = {
  id: string;
  label: LocaleString;
  countryId: string;
  /** Hero/banner image shown behind the summary banner on the planner. */
  heroImage?: string;
  /**
   * Default accommodation coordinates when the traveler hasn't picked a hotel yet.
   * Typically the city's main station (e.g. Shinjuku for Tokyo).
   * Used by the spot engine as day start/end anchor for route optimization.
   */
  defaultAccommodation?: {
    label: LocaleString;
    location: Coordinates;
  };
};

export type Country = {
  id: string;
  label: LocaleString;
  emoji: string;
  cities: Destination[];
};
