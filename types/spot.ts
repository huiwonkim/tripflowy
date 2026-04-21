import type {
  BookingLinks,
  Coordinates,
  LocaleString,
  TravelStyle,
  TravelerType,
} from "@/types";

/**
 * Category of a travel spot.
 * Drives rendering (icons, copy) and engine logic (e.g. meal injection targets `food`/`cafe`).
 */
export type SpotCategory =
  | "sight"        // 관광지, 전망대, 랜드마크
  | "food"         // 식당
  | "cafe"         // 카페·디저트
  | "shopping"     // 쇼핑
  | "experience"   // 체험형 (teamLab, 박물관, 공방)
  | "park"         // 공원·정원
  | "nightlife";   // 바·클럽·야시장

/**
 * Optional meal slot for food/cafe spots — engine uses this to place spots at fixed day times.
 */
export type MealSlot = "breakfast" | "lunch" | "dinner" | "snack";

/**
 * Day-level pace preference. Maps to per-day spot count in the engine:
 *  - relaxed: 3 관광 + 2 식사
 *  - balanced: 4 관광 + 2 식사 (default)
 *  - packed: 6 관광 + 2 식사
 */
export type Pace = "relaxed" | "balanced" | "packed";

/**
 * A single spot (point of interest) — the atomic unit for the spot-based planner.
 * Multiple spots combine into a `GeneratedDay` at runtime via `lib/spot-builder.ts`.
 */
export type Spot = {
  id: string;                    // e.g. "tokyo-shibuya-sky"
  city: string;                  // matches id in data/destinations.ts
  name: LocaleString;
  category: SpotCategory;

  /** Required when category is "food" or "cafe" — used for meal-slot injection. */
  mealSlot?: MealSlot;

  /** Reuses the existing TravelStyle union from types/index.ts. */
  styles: TravelStyle[];

  /** Which traveler types this spot suits. */
  travelerTypes: TravelerType[];

  /** GPS position — required, the engine uses it for route sorting. */
  location: Coordinates;

  /**
   * Dwell time in minutes, min/typical/max for different paces.
   *  - `min`: quick pass (packed itineraries) — e.g. 30 min at a landmark
   *  - `typical`: average visit (balanced) — e.g. 60 min
   *  - `max`: relaxed lingering — e.g. 90 min
   * The spot engine picks min/typical/max based on the user's selected `Pace`.
   */
  duration: { min: number; typical: number; max: number };

  /**
   * Selection weight for the engine.
   *  - 1 = must-see (highest score bonus)
   *  - 2 = strongly recommended
   *  - 3 = recommended (default)
   *  - 4 = optional filler
   */
  priority: 1 | 2 | 3 | 4;

  /** Area/neighborhood key for clustering (e.g. "shibuya", "asakusa"). Same-area spots group into one day. */
  area?: string;

  /** Opening hours for future validation. `closedDays` uses 0=Sun…6=Sat. */
  openHours?: {
    open: string;                // "09:30"
    close: string;               // "22:00"
    closedDays?: number[];
  };

  description: LocaleString;
  tips?: LocaleString[];

  /** Multiple photos — displayed as carousel in day cards. */
  photos?: string[];

  /** Internal blog-guide slug (links to /posts/<slug>). */
  postSlug?: string;

  bookingLinks?: BookingLinks;

  /** Direct Google Maps URL (coords suffice for display, but a shareable URL is handy). */
  googleMapsUrl?: string;

  /** Per-person average cost. Engine aggregates these into DayCostBreakdown. */
  costEstimate?: {
    amount: number;
    currency: string;
  };

  tags?: string[];

  /**
   * Chain / brand key for cross-day deduplication. When set, the spot engine
   * picks at most one spot with a given `chain` per itinerary — so Don
   * Quijote appears once, not in every shopping area. Leave unset for
   * one-of-a-kind places.
   */
  chain?: string;

  /**
   * Full-day / out-of-town experience (Harry Potter Studio Tour, Disneyland,
   * Fuji day trip, etc). When true, the engine treats this as the day's
   * anchor — skips adjacent-area supplementation and fills the remaining
   * slots sparingly, accounting for round-trip travel from the city center.
   */
  fullDay?: boolean;
};

/**
 * A curated single-day "template" — a named spot sequence.
 * Templates are generated from legacy DayCourse entries and surfaced on
 * the planner as "recommended itineraries" you can apply to your trip.
 */
export type DayTemplate = {
  id: string;
  city: string;
  title: LocaleString;
  summary: LocaleString;
  styles: TravelStyle[];
  travelerTypes: TravelerType[];
  /** Spot ids in visit order. Resolved against `allSpots` at runtime. */
  spotIds: string[];
  coverGradient: string;
  /** Optional narrative bullets carried over from DayCourse for rich cards. */
  whyThisCourse?: LocaleString[];
  courseType?: LocaleString[];
};
