/**
 * Spot-based itinerary engine.
 *
 * Takes individually labeled Spot objects (data/spots/) and composes a GeneratedItinerary
 * at runtime — in contrast to lib/itinerary-builder.ts which pre-made DayCourses.
 *
 * Returns the same GeneratedItinerary shape so downstream UI (DayPlanSection, OverviewMap,
 * PDF export, BudgetSection) renders without changes.
 */
import type {
  ActivityType,
  Coordinates,
  DayActivity,
  DayCostBreakdown,
  DayCourse,
  GeneratedDay,
  GeneratedItinerary,
  TravelStyle,
  TravelerType,
} from "@/types";
import type { Pace, Spot, SpotCategory } from "@/types/spot";
import { getSpotsByCity, getSpotById } from "@/data/spots";
import { haversineKm, sortByProximity } from "./geo";

// ────────────────────────────────────────────────────────
// Config
// ────────────────────────────────────────────────────────

/** Per-day counts keyed by pace. */
const PACE_CONFIG: Record<Pace, { sights: number; meals: number }> = {
  relaxed: { sights: 3, meals: 2 },
  balanced: { sights: 4, meals: 2 },
  packed: { sights: 6, meals: 2 },
};

/** Rotating gradient palette for generated DayCourse banners. */
const DEFAULT_GRADIENTS = [
  "from-indigo-500 to-purple-700",
  "from-cyan-500 to-blue-700",
  "from-emerald-500 to-teal-600",
  "from-amber-500 to-orange-600",
  "from-rose-500 to-pink-600",
  "from-violet-500 to-purple-700",
  "from-sky-500 to-indigo-600",
];

// ────────────────────────────────────────────────────────
// Public API
// ────────────────────────────────────────────────────────

export interface BuildSpotInput {
  destinations: string[];
  duration: number;                         // total days (not nights)
  styles?: TravelStyle[];
  travelerType?: TravelerType;
  pace?: Pace;                              // default "balanced"
  accommodations?: Record<string, Coordinates>; // city id → hotel coord
  startDate?: string;                       // optional ISO date (used for closedDays check)
  /** Arrival flight — shrinks day 1 start to arrival.time + 1.5h. */
  arrival?: { airport?: string; time?: string };
  /** Departure flight — shrinks last day end to departure.time - 4h. */
  departure?: { airport?: string; time?: string };
}

/**
 * Entry point — compose a multi-day itinerary from the spot pool.
 * Returns null if inputs are invalid or no spots match any selected city.
 */
export function buildSpotItinerary(input: BuildSpotInput): GeneratedItinerary | null {
  const {
    destinations,
    duration,
    styles,
    travelerType,
    pace = "balanced",
    accommodations,
    startDate,
    arrival,
    departure,
  } = input;

  if (!destinations || destinations.length === 0) return null;
  if (!duration || duration <= 0) return null;

  // Derive first/last day time windows from flight info.
  //   공항→숙소 1h + 체크인/짐풀기 0.5h  → arrival + 1.5h
  //   숙소→공항 1h + 공항 여유 3h       → departure - 4h
  // Both are undefined when the user skips the airport UI; in that case the
  // engine falls back to its default 09:30 start / no end cutoff.
  const arrivalStart = arrival?.time
    ? formatTime(parseTime(arrival.time) + 90)
    : undefined;
  const departureEnd = departure?.time
    ? formatTime(Math.max(parseTime(departure.time) - 4 * 60, parseTime("09:00")))
    : undefined;

  // Allocate days per city proportionally
  const allocation = allocateCityDays(destinations, duration, styles, travelerType);

  const days: GeneratedDay[] = [];
  let dayNumber = 1;

  for (const city of destinations) {
    const cityDays = allocation.get(city) || 0;
    if (cityDays === 0) continue;

    const cityPool = getSpotsByCity(city);
    if (cityPool.length === 0) continue;

    const usedIds = new Set<string>();
    const accommodation = accommodations?.[city];

    for (let d = 0; d < cityDays; d++) {
      const visitDate = dateForDay(startDate, dayNumber);
      const closedDayOfWeek = visitDate ? visitDate.getDay() : null;

      // Pick sights + meals for the day
      let { sights, meals } = pickDaySpots(
        cityPool,
        pace,
        styles,
        travelerType,
        usedIds,
        closedDayOfWeek,
      );

      // Pool exhausted — allow reuse once to avoid empty days
      if (sights.length === 0 && meals.length === 0) {
        usedIds.clear();
        ({ sights, meals } = pickDaySpots(
          cityPool,
          pace,
          styles,
          travelerType,
          usedIds,
          closedDayOfWeek,
        ));
        if (sights.length === 0 && meals.length === 0) break;
      }

      for (const s of sights) usedIds.add(s.id);
      for (const m of meals) usedIds.add(m.id);

      // First day starts later when an arrival time is given; last day ends
      // earlier when a departure time is given. Middle days get no constraint.
      const isFirstDay = dayNumber === 1;
      const isLastDay = dayNumber === duration;
      const dayStart = isFirstDay ? arrivalStart : undefined;
      const dayEnd = isLastDay ? departureEnd : undefined;

      const activities = scheduleDay(sights, meals, accommodation, pace, dayStart, dayEnd);
      const course = buildDayCourse(city, dayNumber, activities, [...sights, ...meals]);

      days.push({ dayNumber, course, city });
      dayNumber++;
    }
  }

  if (days.length === 0) return null;

  const uniqueCities = [...new Set(days.map((d) => d.city))];
  return {
    days,
    cities: uniqueCities,
    duration,
    style: (styles && styles[0]) || "efficient",
    travelerType: travelerType || "couple",
  };
}

// ────────────────────────────────────────────────────────
// Deterministic rebuild (URL restore)
// ────────────────────────────────────────────────────────

export interface RebuildFromSpotIdsInput {
  /** Per-day spot ID arrays — activity order within a day is re-derived from GPS/meal slots. */
  spotsPerDay: string[][];
  /** City assignment per day (same length as spotsPerDay). Derived from first spot's city if omitted. */
  cityPerDay?: string[];
  styles?: TravelStyle[];
  travelerType?: TravelerType;
  accommodations?: Record<string, Coordinates>;
  pace?: Pace;
  /** Same arrival/departure constraints as buildSpotItinerary — applied to day 1 and the last day. */
  arrival?: { airport?: string; time?: string };
  departure?: { airport?: string; time?: string };
}

/**
 * Reconstruct a `GeneratedItinerary` from a list of spot IDs per day.
 * Skips scoring/random — used by URL v2 restore so the user sees exactly the
 * same spots they shared, just re-scheduled.
 */
export function buildItineraryFromSpotIds(input: RebuildFromSpotIdsInput): GeneratedItinerary | null {
  const { spotsPerDay, cityPerDay, styles, travelerType, accommodations, pace = "balanced", arrival, departure } = input;
  if (!spotsPerDay || spotsPerDay.length === 0) return null;

  // Same first/last-day shrink as buildSpotItinerary:
  //   첫날: arrival + 1.5h 부터
  //   마지막날: departure - 4h 에 종료
  const arrivalStart = arrival?.time
    ? formatTime(parseTime(arrival.time) + 90)
    : undefined;
  const departureEnd = departure?.time
    ? formatTime(Math.max(parseTime(departure.time) - 4 * 60, parseTime("09:00")))
    : undefined;
  const totalDays = spotsPerDay.length;

  const days: GeneratedDay[] = [];
  for (let i = 0; i < spotsPerDay.length; i++) {
    const ids = spotsPerDay[i];
    const spots = ids.map((id) => getSpotById(id)).filter((s): s is Spot => Boolean(s));
    if (spots.length === 0) continue;

    const city = cityPerDay?.[i] ?? spots[0].city;
    const sights = spots.filter((s) => s.category !== "food" && s.category !== "cafe");
    const meals = spots.filter((s) => s.category === "food" || s.category === "cafe");
    const accommodation = accommodations?.[city];

    const isFirstDay = i === 0;
    const isLastDay = i === totalDays - 1;
    const dayStart = isFirstDay ? arrivalStart : undefined;
    const dayEnd = isLastDay ? departureEnd : undefined;

    const activities = scheduleDay(sights, meals, accommodation, pace, dayStart, dayEnd);
    const dayNumber = days.length + 1;
    days.push({
      dayNumber,
      course: buildDayCourse(city, dayNumber, activities, spots),
      city,
    });
  }

  if (days.length === 0) return null;
  const uniqueCities = [...new Set(days.map((d) => d.city))];
  return {
    days,
    cities: uniqueCities,
    duration: days.length,
    style: (styles && styles[0]) || "efficient",
    travelerType: travelerType || "couple",
  };
}

// ────────────────────────────────────────────────────────
// Step 1: city allocation
// ────────────────────────────────────────────────────────

function allocateCityDays(
  destinations: string[],
  duration: number,
  styles: TravelStyle[] | undefined,
  travelerType: TravelerType | undefined,
): Map<string, number> {
  // Count spots matching filters per city
  const counts = new Map<string, number>();
  for (const city of destinations) {
    const spots = getSpotsByCity(city);
    const matching = spots.filter((s) => {
      if (styles && styles.length > 0 && !styles.some((st) => s.styles.includes(st))) return false;
      if (travelerType && !s.travelerTypes.includes(travelerType)) return false;
      return true;
    });
    counts.set(city, matching.length || spots.length || 1);
  }

  const total = [...counts.values()].reduce((a, b) => a + b, 0) || 1;
  const allocation = new Map<string, number>();
  let allocated = 0;

  destinations.forEach((city, idx) => {
    const cityCount = counts.get(city) || 0;
    let d: number;
    if (idx === destinations.length - 1) {
      d = Math.max(1, duration - allocated);
    } else {
      d = Math.max(1, Math.round((cityCount / total) * duration));
      if (allocated + d > duration - (destinations.length - idx - 1)) {
        // Leave at least 1 day per remaining city
        d = Math.max(1, duration - allocated - (destinations.length - idx - 1));
      }
    }
    allocation.set(city, d);
    allocated += d;
  });

  return allocation;
}

// ────────────────────────────────────────────────────────
// Step 2: scoring + picking
// ────────────────────────────────────────────────────────

function scoreSpot(
  spot: Spot,
  styles: TravelStyle[] | undefined,
  travelerType: TravelerType | undefined,
): number {
  // priority 1 = must-see (+4), 2 = strong (+3), 3 = recommended (+2), 4 = optional (+1)
  let score = 5 - spot.priority;

  if (styles && styles.length > 0) {
    const overlap = styles.filter((s) => spot.styles.includes(s)).length;
    score += overlap * 2;
  }
  if (travelerType && spot.travelerTypes.includes(travelerType)) {
    score += 2;
  }
  // Small jitter for deterministic-ish diversity
  score += Math.random() * 0.5;
  return score;
}

function pickDaySpots(
  pool: Spot[],
  pace: Pace,
  styles: TravelStyle[] | undefined,
  travelerType: TravelerType | undefined,
  usedIds: Set<string>,
  closedDayOfWeek: number | null,
): { sights: Spot[]; meals: Spot[] } {
  const config = PACE_CONFIG[pace];

  const available = pool.filter((s) => {
    if (usedIds.has(s.id)) return false;
    // Opening-hours check: skip if the visit day is a closed day
    if (closedDayOfWeek !== null && s.openHours?.closedDays?.includes(closedDayOfWeek)) return false;
    return true;
  });

  const sightCandidates = available.filter(
    (s) => s.category !== "food" && s.category !== "cafe",
  );
  const foodCandidates = available.filter(
    (s) => s.category === "food" || s.category === "cafe",
  );

  const scoredSights = sightCandidates
    .map((s) => ({ spot: s, score: scoreSpot(s, styles, travelerType) }))
    .sort((a, b) => b.score - a.score);

  const scoredFoods = foodCandidates
    .map((s) => ({ spot: s, score: scoreSpot(s, styles, travelerType) }))
    .sort((a, b) => b.score - a.score);

  const sights = scoredSights.slice(0, config.sights).map((x) => x.spot);

  // Meal injection: prefer one mealSlot=lunch + one mealSlot=dinner,
  // then fill any remaining slots with any food candidate
  const meals: Spot[] = [];
  const lunchPick = scoredFoods.find((sf) => sf.spot.mealSlot === "lunch");
  if (lunchPick) meals.push(lunchPick.spot);
  const dinnerPick = scoredFoods.find(
    (sf) => sf.spot.mealSlot === "dinner" && !meals.includes(sf.spot),
  );
  if (dinnerPick) meals.push(dinnerPick.spot);
  for (const sf of scoredFoods) {
    if (meals.length >= config.meals) break;
    if (!meals.includes(sf.spot)) meals.push(sf.spot);
  }

  return { sights, meals };
}

// ────────────────────────────────────────────────────────
// Step 3: scheduling (GPS sort + time assignment)
// ────────────────────────────────────────────────────────

/**
 * Travel minutes estimate between two coordinates — kept simple on purpose.
 * V2 may swap this for Google Directions API.
 */
function computeTravelMinutes(from: Coordinates, to: Coordinates): number {
  const km = haversineKm(from, to);
  if (km < 3) return 15;
  if (km < 10) return 25;
  return 40;
}

function parseTime(t: string): number {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + (m || 0);
}

function formatTime(minutes: number): string {
  const safe = ((minutes % (24 * 60)) + 24 * 60) % (24 * 60);
  const hh = Math.floor(safe / 60);
  const mm = safe % 60;
  return `${String(hh).padStart(2, "0")}:${String(mm).padStart(2, "0")}`;
}

function categoryToActivityType(cat: SpotCategory): ActivityType {
  switch (cat) {
    case "food":
    case "cafe":
      return "dining";
    case "shopping":
      return "shopping";
    case "experience":
      return "tour";
    case "park":
    case "sight":
    default:
      return "sightseeing";
  }
}

/** Pick the appropriate dwell time for the chosen pace. */
function dwellMinutes(spot: Spot, pace: Pace): number {
  if (pace === "packed") return spot.duration.min;
  if (pace === "relaxed") return spot.duration.max;
  return spot.duration.typical;
}

function spotToActivity(spot: Spot, time: string, pace: Pace): DayActivity {
  return {
    time,
    title: spot.name,
    description: spot.description,
    ...(spot.tips && spot.tips.length > 0 ? { tips: spot.tips } : {}),
    type: categoryToActivityType(spot.category),
    location: spot.location,
    duration: dwellMinutes(spot, pace),
    // photo (deprecated) = first photo for legacy compat; photos = full array
    ...(spot.photos && spot.photos[0] ? { photo: spot.photos[0] } : {}),
    ...(spot.photos && spot.photos.length > 0 ? { photos: spot.photos } : {}),
    ...(spot.postSlug ? { postSlug: spot.postSlug } : {}),
    ...(spot.bookingLinks ? { bookingLinks: spot.bookingLinks } : {}),
    spotId: spot.id,
  };
}

/**
 * Arrange selected spots into a timed sequence.
 *  - GPS-sort the sights starting from accommodation (if given)
 *  - Inject lunch around 12:30, dinner at 18:30
 *  - Breakfast (if any food spot has mealSlot=breakfast) goes to 09:00, sights start 09:30
 *  - `dayStart` overrides the default 09:30 start (first day w/ late arrival)
 *  - `dayEnd` cuts the day off — any sight that would start past it is dropped
 *    (last day w/ early departure)
 */
function scheduleDay(
  sights: Spot[],
  meals: Spot[],
  accommodation: Coordinates | undefined,
  pace: Pace = "balanced",
  dayStart?: string,
  dayEnd?: string,
): DayActivity[] {
  // Sort sights by proximity, anchored to accommodation if available
  let sortedSights: Spot[];
  if (sights.length === 0) {
    sortedSights = [];
  } else if (accommodation) {
    let startIdx = 0;
    let startDist = Infinity;
    for (let i = 0; i < sights.length; i++) {
      const d = haversineKm(accommodation, sights[i].location);
      if (d < startDist) {
        startDist = d;
        startIdx = i;
      }
    }
    const head = sights[startIdx];
    const rest = sights.filter((_, i) => i !== startIdx);
    sortedSights = [head, ...sortByProximity(rest, (s) => s.location)];
  } else {
    sortedSights = sortByProximity(sights, (s) => s.location);
  }

  const breakfast = meals.find((m) => m.mealSlot === "breakfast");
  const lunch = meals.find((m) => m.mealSlot === "lunch");
  const dinner = meals.find((m) => m.mealSlot === "dinner");
  const others = meals.filter(
    (m) => m !== breakfast && m !== lunch && m !== dinner,
  );

  const activities: DayActivity[] = [];
  const defaultStart = parseTime("09:30");
  const startMinutes = dayStart ? parseTime(dayStart) : defaultStart;
  const endMinutes = dayEnd ? parseTime(dayEnd) : null;
  let currentMinutes = startMinutes;
  let lastLocation: Coordinates | undefined = accommodation;
  let lunchInserted = false;
  let dinnerInserted = false;

  /**
   * Attempt to push a spot at the computed time.
   * Returns false (and skips) when the resulting slot would exceed `dayEnd`.
   */
  const pushSpot = (spot: Spot, forcedMinutes?: number): boolean => {
    let startMin: number;
    if (forcedMinutes !== undefined) {
      startMin = forcedMinutes;
    } else {
      startMin = currentMinutes;
      if (lastLocation) {
        startMin += computeTravelMinutes(lastLocation, spot.location);
      }
    }
    // Respect arrival-constrained start: nothing can begin before startMinutes.
    if (startMin < startMinutes) startMin = startMinutes;
    // Cut off at dayEnd — drop spots that would start past it.
    if (endMinutes !== null && startMin > endMinutes) return false;
    const timeStr = formatTime(startMin);
    activities.push(spotToActivity(spot, timeStr, pace));
    currentMinutes = startMin + dwellMinutes(spot, pace);
    lastLocation = spot.location;
    return true;
  };

  if (breakfast) {
    // Breakfast stays at 09:00 only if the day actually starts that early.
    const breakfastTime = Math.max(parseTime("09:00"), startMinutes);
    pushSpot(breakfast, breakfastTime);
  }

  for (const sight of sortedSights) {
    if (lunch && !lunchInserted && currentMinutes >= parseTime("12:00")) {
      if (pushSpot(lunch, Math.max(currentMinutes, parseTime("12:30")))) {
        lunchInserted = true;
      } else {
        lunchInserted = true; // give up if past cutoff
      }
    }
    if (dinner && !dinnerInserted && currentMinutes >= parseTime("18:00")) {
      if (pushSpot(dinner, parseTime("18:30"))) {
        dinnerInserted = true;
      } else {
        dinnerInserted = true;
      }
    }
    if (!pushSpot(sight)) break; // day window exhausted
  }

  // Ensure lunch and dinner get added even if the sight loop didn't trip the threshold
  if (lunch && !lunchInserted) {
    pushSpot(lunch, parseTime("12:30"));
  }
  if (dinner && !dinnerInserted) {
    pushSpot(dinner, parseTime("18:30"));
  }

  // Fill other meals (snack etc.) after the main sequence, time-based
  for (const other of others) {
    if (!pushSpot(other)) break;
  }

  // Final sort by time — insertion order may have been slightly off
  activities.sort((a, b) => parseTime(a.time) - parseTime(b.time));
  return activities;
}

// ────────────────────────────────────────────────────────
// Step 4: virtual DayCourse wrapper
// ────────────────────────────────────────────────────────

function centroid(coords: Coordinates[]): Coordinates {
  if (coords.length === 0) return { lat: 0, lng: 0 };
  const sum = coords.reduce(
    (acc, c) => ({ lat: acc.lat + c.lat, lng: acc.lng + c.lng }),
    { lat: 0, lng: 0 },
  );
  return { lat: sum.lat / coords.length, lng: sum.lng / coords.length };
}

/**
 * Sum per-spot costEstimate into a DayCostBreakdown, bucketed by category.
 * Returns undefined when no spot has a costEstimate — so BudgetSection falls
 * back to the city-level default instead of showing 0s.
 */
function computeDayCosts(spots: Spot[]): DayCostBreakdown | undefined {
  let food = 0;
  let activity = 0;
  let etc = 0;
  let currency = "JPY";
  let hasAny = false;
  for (const s of spots) {
    if (!s.costEstimate) continue;
    hasAny = true;
    currency = s.costEstimate.currency;
    const amount = s.costEstimate.amount;
    switch (s.category) {
      case "food":
      case "cafe":
        food += amount;
        break;
      case "sight":
      case "park":
      case "experience":
        activity += amount;
        break;
      case "shopping":
      case "nightlife":
      default:
        etc += amount;
    }
  }
  if (!hasAny) return undefined;
  // transport is MVP-assumed zero (covered in city-level estimates); V2 may
  // pull from dedicated transport spots or Directions API.
  return { food, activity, transport: 0, etc, currency };
}

function buildDayCourse(
  city: string,
  dayNumber: number,
  activities: DayActivity[],
  spots: Spot[] = [],
): DayCourse {
  const locations = activities
    .map((a) => a.location)
    .filter((l): l is Coordinates => Boolean(l));
  const center = centroid(locations);

  // Title = top 2 sightseeing-ish spots joined by " & "
  // (e.g. "Day 1 · 시부야 스카이 & 센소지").
  // Falls back to any available activities if no sightseeing spots exist.
  const sightseeing = activities.filter(
    (a) => a.type === "sightseeing" || a.type === "tour" || a.type === "shopping",
  );
  const headlines = (sightseeing.length >= 2 ? sightseeing : activities).slice(0, 2);
  const titleKo =
    headlines.length >= 2
      ? `${headlines[0].title.ko} & ${headlines[1].title.ko}`
      : headlines[0]?.title.ko ?? `Day ${dayNumber}`;
  const titleEn =
    headlines.length >= 2
      ? `${headlines[0].title.en} & ${headlines[1].title.en}`
      : headlines[0]?.title.en ?? `Day ${dayNumber}`;

  const costs = computeDayCosts(spots);

  return {
    id: `spot-gen-${city}-day-${dayNumber}`,
    city,
    title: { en: titleEn, ko: titleKo },
    summary: { en: "", ko: "" },
    styles: [],
    travelerTypes: [],
    activities,
    center,
    tags: [],
    coverGradient: DEFAULT_GRADIENTS[(dayNumber - 1) % DEFAULT_GRADIENTS.length],
    ...(costs ? { costs } : {}),
  };
}

// ────────────────────────────────────────────────────────
// Helpers
// ────────────────────────────────────────────────────────

function dateForDay(startDate: string | undefined, dayNumber: number): Date | null {
  if (!startDate) return null;
  const d = new Date(startDate);
  if (isNaN(d.getTime())) return null;
  d.setDate(d.getDate() + (dayNumber - 1));
  return d;
}
