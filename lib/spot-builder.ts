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

/**
 * Per-day counts keyed by pace. `sights` is the count of non-food activities
 * — meals are added on top and aren't considered part of the pace. A
 * "balanced" day should feel like ~6 things to do plus lunch and dinner.
 */
const PACE_CONFIG: Record<Pace, { sights: number; meals: number }> = {
  relaxed: { sights: 4, meals: 2 },
  balanced: { sights: 6, meals: 2 },
  packed: { sights: 8, meals: 2 },
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
    const usedAreas = new Map<string, number>();
    const usedChains = new Set<string>();
    const accommodation = accommodations?.[city];

    // Derive the accommodation-nearest area by finding the area whose spots
    // have the closest centroid to the accommodation coordinate. Used as a
    // day-1 preference so the first day doesn't start in a distant district.
    const accommodationArea = accommodation
      ? findClosestArea(cityPool, accommodation)
      : undefined;

    for (let d = 0; d < cityDays; d++) {
      const visitDate = dateForDay(startDate, dayNumber);
      const closedDayOfWeek = visitDate ? visitDate.getDay() : null;

      // Day 1 prefers the accommodation area; later days pick by fresh-area score
      const preferredArea = d === 0 ? accommodationArea : undefined;

      // Pick sights + meals for the day
      let { sights, meals, primaryArea } = pickDaySpots(
        cityPool,
        pace,
        styles,
        travelerType,
        usedIds,
        usedAreas,
        usedChains,
        closedDayOfWeek,
        preferredArea,
      );

      // Pool exhausted — allow reuse once to avoid empty days
      if (sights.length === 0 && meals.length === 0) {
        usedIds.clear();
        usedAreas.clear();
        usedChains.clear();
        ({ sights, meals, primaryArea } = pickDaySpots(
          cityPool,
          pace,
          styles,
          travelerType,
          usedIds,
          usedAreas,
          usedChains,
          closedDayOfWeek,
          preferredArea,
        ));
        if (sights.length === 0 && meals.length === 0) break;
      }

      // First day starts later when an arrival time is given; last day ends
      // earlier when a departure time is given. Middle days get no constraint.
      const isFirstDay = dayNumber === 1;
      const isLastDay = dayNumber === duration;
      const dayStart = isFirstDay ? arrivalStart : undefined;
      const dayEnd = isLastDay ? departureEnd : undefined;

      const activities = scheduleDay(sights, meals, accommodation, pace, dayStart, dayEnd);

      // Only mark spots that actually made it onto the schedule as "used" —
      // scheduleDay drops spots that don't fit the day window (late arrival,
      // openHours constraints, early departure). Picked-but-dropped spots
      // stay in the pool for subsequent days.
      const scheduledSpotIds = new Set(
        activities.map((a) => a.spotId).filter((id): id is string => !!id),
      );
      const byId = new Map<string, Spot>();
      for (const s of [...sights, ...meals]) byId.set(s.id, s);
      const scheduledSpots: Spot[] = [];
      for (const id of scheduledSpotIds) {
        const sp = byId.get(id);
        if (sp) scheduledSpots.push(sp);
      }

      for (const id of scheduledSpotIds) usedIds.add(id);

      // Lock chain brands — one Don Quijote / one Ichiran per itinerary
      for (const sp of scheduledSpots) {
        if (sp.chain) usedChains.add(sp.chain);
      }

      // Count an area as "used" only when multiple spots from it landed on
      // the day. A short day 1 with a single spot from the accommodation
      // area shouldn't block day 2 from finishing that area.
      if (primaryArea) {
        const scheduledInPrimary = scheduledSpots.filter(
          (s) => s.area === primaryArea,
        ).length;
        if (scheduledInPrimary >= 2) {
          usedAreas.set(primaryArea, (usedAreas.get(primaryArea) ?? 0) + 1);
        }
      }

      const course = buildDayCourse(city, dayNumber, activities, scheduledSpots);

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
  // Priority is the dominant signal — priority-1 "must-see" spots should
  // make it into the plan even when style overlap is poor. Weights are
  // tuned so a priority-1 spot with no style match still outranks a
  // priority-3 spot with 1 style match.
  //   priority 1 → 8, 2 → 5, 3 → 3, 4 → 1
  const PRIORITY_SCORE: Record<1 | 2 | 3 | 4, number> = { 1: 8, 2: 5, 3: 3, 4: 1 };
  let score = PRIORITY_SCORE[spot.priority] ?? 1;

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

/**
 * Pick one primary area and fill the day with its spots (sights + meals).
 * Area clustering keeps a single day geographically coherent — Shibuya day
 * stays in Shibuya instead of hopping to Ueno then back. Rotation across
 * days is encouraged by penalising previously-used areas.
 *
 * Flow:
 *  1. Group available spots by `area`.
 *  2. Score each area = sum of its top-N sight scores, minus reuse penalty,
 *     plus a large bonus when it matches the accommodation area (day 1).
 *  3. Take sights from the winning area. If it's short on sights, supplement
 *     from the geographically nearest adjacent area by centroid distance.
 *  4. Take meals from the same area first; if lunch/dinner slots are missing,
 *     pull the closest food spot from any area.
 */
function pickDaySpots(
  pool: Spot[],
  pace: Pace,
  styles: TravelStyle[] | undefined,
  travelerType: TravelerType | undefined,
  usedIds: Set<string>,
  usedAreas: Map<string, number>,
  usedChains: Set<string>,
  closedDayOfWeek: number | null,
  preferredArea?: string,
): { sights: Spot[]; meals: Spot[]; primaryArea: string | undefined } {
  const config = PACE_CONFIG[pace];

  const available = pool.filter((s) => {
    if (usedIds.has(s.id)) return false;
    if (closedDayOfWeek !== null && s.openHours?.closedDays?.includes(closedDayOfWeek)) return false;
    // Chain dedupe — once a Don Quijote has been scheduled, skip the others.
    if (s.chain && usedChains.has(s.chain)) return false;
    return true;
  });

  const isSight = (s: Spot) => s.category !== "food" && s.category !== "cafe";
  const isFood = (s: Spot) => s.category === "food" || s.category === "cafe";

  // Group by area — spots without an area go into a "_none" wildcard bucket
  // and are only used to top up when a chosen area runs short.
  const byArea = new Map<string, Spot[]>();
  for (const s of available) {
    const key = s.area ?? "_none";
    const bucket = byArea.get(key) ?? [];
    bucket.push(s);
    byArea.set(key, bucket);
  }

  type AreaCand = {
    area: string;
    score: number;
    sights: Spot[];
    foods: Spot[];
    centroid: Coordinates;
  };

  const candidates: AreaCand[] = [];
  for (const [area, spots] of byArea) {
    if (area === "_none") continue;
    const scoredSights = spots
      .filter(isSight)
      .map((s) => ({ spot: s, score: scoreSpot(s, styles, travelerType) }))
      .sort((a, b) => b.score - a.score);
    if (scoredSights.length === 0) continue;
    const scoredFoods = spots
      .filter(isFood)
      .map((s) => ({ spot: s, score: scoreSpot(s, styles, travelerType) }))
      .sort((a, b) => b.score - a.score);

    const topSightsScore = scoredSights
      .slice(0, config.sights)
      .reduce((sum, x) => sum + x.score, 0);
    const reuseCount = usedAreas.get(area) ?? 0;

    // Reuse penalty: scales with how much of the area is LEFT after previous
    // visits. Big areas (Shibuya/Shinjuku with 15+ spots) keep getting picked
    // on day 2 because there's still a full day of content. Small areas are
    // blocked from re-use. Also: if day 1 only managed to fit one spot due
    // to a late arrival, the remaining-count logic still makes the area
    // easily re-pickable on day 2.
    const remainingSightsHere = scoredSights.length;
    const hasMultipleDaysOfContent = remainingSightsHere >= config.sights * 1.5;
    let reusePenalty: number;
    if (reuseCount === 0) {
      reusePenalty = 0;
    } else if (hasMultipleDaysOfContent) {
      reusePenalty = 10; // soft nudge toward diversification, but don't block
    } else {
      reusePenalty = 80; // strong block once the area is mostly drained
    }

    const prefBonus = area === preferredArea ? 40 : 0;
    const score = topSightsScore - reusePenalty + prefBonus;

    candidates.push({
      area,
      score,
      sights: scoredSights.map((x) => x.spot),
      foods: scoredFoods.map((x) => x.spot),
      centroid: centroid(spots.map((s) => s.location)),
    });
  }

  if (candidates.length === 0) {
    // No areas at all — fall back to flat score-based picking over the whole pool
    const scoredSights = available
      .filter(isSight)
      .map((s) => ({ spot: s, score: scoreSpot(s, styles, travelerType) }))
      .sort((a, b) => b.score - a.score);
    const scoredFoods = available
      .filter(isFood)
      .map((s) => ({ spot: s, score: scoreSpot(s, styles, travelerType) }))
      .sort((a, b) => b.score - a.score);
    const sights = scoredSights.slice(0, config.sights).map((x) => x.spot);
    const meals: Spot[] = [];
    const l = scoredFoods.find((sf) => sf.spot.mealSlot === "lunch");
    if (l) meals.push(l.spot);
    const dn = scoredFoods.find((sf) => sf.spot.mealSlot === "dinner" && !meals.includes(sf.spot));
    if (dn) meals.push(dn.spot);
    for (const sf of scoredFoods) {
      if (meals.length >= config.meals) break;
      if (!meals.includes(sf.spot)) meals.push(sf.spot);
    }
    return { sights, meals, primaryArea: undefined };
  }

  candidates.sort((a, b) => b.score - a.score);
  const chosen = candidates[0];

  // Sights: start with primary area
  const sights = chosen.sights.slice(0, config.sights);

  // Supplement from the nearest other area if short on sights
  if (sights.length < config.sights) {
    const missing = config.sights - sights.length;
    const others = candidates
      .filter((c) => c.area !== chosen.area)
      .map((c) => ({
        cand: c,
        dist: haversineKm(chosen.centroid, c.centroid),
      }))
      .sort((a, b) => a.dist - b.dist);
    const topUp: Spot[] = [];
    for (const { cand } of others) {
      for (const s of cand.sights) {
        if (topUp.length >= missing) break;
        topUp.push(s);
      }
      if (topUp.length >= missing) break;
    }
    sights.push(...topUp);
  }

  // Meals from same area first
  const meals: Spot[] = [];
  const lunch = chosen.foods.find((s) => s.mealSlot === "lunch");
  if (lunch) meals.push(lunch);
  const dinner = chosen.foods.find((s) => s.mealSlot === "dinner" && !meals.includes(s));
  if (dinner) meals.push(dinner);
  for (const f of chosen.foods) {
    if (meals.length >= config.meals) break;
    if (!meals.includes(f)) meals.push(f);
  }

  // Fall back to nearest-area foods if meals are missing
  if (meals.length < config.meals) {
    const crossAreaFoods = available
      .filter((s) => isFood(s) && s.area !== chosen.area && !meals.includes(s))
      .map((s) => ({
        spot: s,
        dist: haversineKm(chosen.centroid, s.location),
      }))
      .sort((a, b) => a.dist - b.dist);
    for (const { spot } of crossAreaFoods) {
      if (meals.length >= config.meals) break;
      // Prefer missing slot (lunch or dinner) when still uncovered
      const needLunch = !meals.some((m) => m.mealSlot === "lunch");
      const needDinner = !meals.some((m) => m.mealSlot === "dinner");
      if (
        (needLunch && spot.mealSlot === "lunch") ||
        (needDinner && spot.mealSlot === "dinner") ||
        (!needLunch && !needDinner)
      ) {
        meals.push(spot);
      }
    }
    // Still short? Fill with any remaining food regardless of slot
    for (const { spot } of crossAreaFoods) {
      if (meals.length >= config.meals) break;
      if (!meals.includes(spot)) meals.push(spot);
    }
  }

  // Within-day chain dedupe — in case supplement/fallback pulled in another
  // spot of a chain that wasn't locked yet at filter time.
  const dayChains = new Set<string>();
  const dedupedSights = sights.filter((s) => {
    if (!s.chain) return true;
    if (dayChains.has(s.chain)) return false;
    dayChains.add(s.chain);
    return true;
  });
  const dedupedMeals = meals.filter((s) => {
    if (!s.chain) return true;
    if (dayChains.has(s.chain)) return false;
    dayChains.add(s.chain);
    return true;
  });

  return { sights: dedupedSights, meals: dedupedMeals, primaryArea: chosen.area };
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
  // Split sights into daytime vs evening (opens at 16:00 or later) so that
  // evening-only spots — golden gai, omoide yokocho, night markets — land
  // at the end of the day instead of being scheduled at 10am.
  const isEveningOnly = (s: Spot): boolean => {
    if (!s.openHours?.open) return false;
    return parseTime(s.openHours.open) >= parseTime("16:00");
  };
  const daytimeSights = sights.filter((s) => !isEveningOnly(s));
  const eveningSights = sights.filter(isEveningOnly);

  // Sort daytime sights by proximity, anchored to accommodation if available
  let sortedDaytime: Spot[];
  if (daytimeSights.length === 0) {
    sortedDaytime = [];
  } else if (accommodation) {
    let startIdx = 0;
    let startDist = Infinity;
    for (let i = 0; i < daytimeSights.length; i++) {
      const d = haversineKm(accommodation, daytimeSights[i].location);
      if (d < startDist) {
        startDist = d;
        startIdx = i;
      }
    }
    const head = daytimeSights[startIdx];
    const rest = daytimeSights.filter((_, i) => i !== startIdx);
    sortedDaytime = [head, ...sortByProximity(rest, (s) => s.location)];
  } else {
    sortedDaytime = sortByProximity(daytimeSights, (s) => s.location);
  }
  // Evening-only spots: sort among themselves by proximity but append last
  const sortedEvening = eveningSights.length > 1
    ? sortByProximity(eveningSights, (s) => s.location)
    : eveningSights;
  const sortedSights = [...sortedDaytime, ...sortedEvening];

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
   * Returns false (and skips) when:
   *  - The slot would exceed `dayEnd`
   *  - The spot's open hours can't accommodate its typical dwell
   * If the computed start is before the spot's `openHours.open`, the start is
   * delayed to the opening time (so a 17:00-opens spot gets scheduled at 17:00
   * even if our proximity cursor reached it at 15:45).
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
    // Respect arrival-constrained start
    if (startMin < startMinutes) startMin = startMinutes;

    // Respect the spot's own opening hours
    if (spot.openHours?.open) {
      const openMin = parseTime(spot.openHours.open);
      if (startMin < openMin) startMin = openMin;
    }
    if (spot.openHours?.close) {
      const closeMin = parseTime(spot.openHours.close);
      const dwell = dwellMinutes(spot, pace);
      // Skip if we can't finish the minimum visit before it closes
      if (startMin + Math.min(dwell, 30) > closeMin) return false;
    }

    // Cut off at dayEnd — drop spots that would start past it
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
      // Use max(currentMinutes, 18:30) — mirrors lunch. Prior bug forced 18:30
      // regardless, so a sight ending at 19:00 would overlap dinner at 18:30.
      if (pushSpot(dinner, Math.max(currentMinutes, parseTime("18:30")))) {
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

/**
 * Returns the area key whose spot centroid is closest to the given coordinate.
 * Used to snap accommodation location to a known area for day-1 preference.
 */
function findClosestArea(pool: Spot[], accommodation: Coordinates): string | undefined {
  const byArea = new Map<string, Coordinates[]>();
  for (const s of pool) {
    if (!s.area) continue;
    const bucket = byArea.get(s.area) ?? [];
    bucket.push(s.location);
    byArea.set(s.area, bucket);
  }
  let best: { area: string; dist: number } | undefined;
  for (const [area, coords] of byArea) {
    const c = centroid(coords);
    const d = haversineKm(c, accommodation);
    if (!best || d < best.dist) best = { area, dist: d };
  }
  return best?.area;
}

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
