export type Locale = "en" | "ko";

export type LocaleString = {
  en: string;
  ko: string;
};

export type TravelerType = "couple" | "solo" | "family" | "friends";
export type TravelStyle = "relaxed" | "efficient" | "activity-focused" | "hotel-focused";
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
export type DayActivity = {
  time: string;
  title: LocaleString;
  description: LocaleString;
  type: ActivityType;
  location?: Coordinates;
};

export type DayCostBreakdown = {
  food: number;
  activity: number;
  transport: number;
  etc: number;
  currency: string; // "VND", "THB", "JPY", "EUR", "USD", "CNY", "TRY", "GBP", "IDR"
};

export type DayCourse = {
  id: string;
  city: string;
  title: LocaleString;
  summary: LocaleString;
  styles: TravelStyle[];
  travelerTypes: TravelerType[];
  activities: DayActivity[];
  center: Coordinates;
  tags: string[];
  coverGradient: string;
  costs?: DayCostBreakdown;
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

export type CityInfo = {
  cityId: string;
  faq: FAQ[];
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

// ── 플래너 입력 ────────────────────────────────────
export type PlannerInput = {
  destinations: string[];
  duration: string;
  travelerType: TravelerType | "";
  style: TravelStyle | "";
};

// ── 여행지 구조 ────────────────────────────────────
export type Destination = {
  id: string;
  label: LocaleString;
  countryId: string;
};

export type Country = {
  id: string;
  label: LocaleString;
  emoji: string;
  cities: Destination[];
};
