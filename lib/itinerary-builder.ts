import type { Coordinates, DayCourse, DayCostBreakdown, GeneratedItinerary, TravelStyle, TravelerType, GeneratedDay, Locale } from "@/types";
import type { Pace } from "@/types/spot";
import { dayCourses } from "@/data/day-courses";
import { tours } from "@/data/tours";
import { hotels } from "@/data/hotels";
import { sortByProximity } from "./geo";
import { getDefaultCosts } from "@/data/course-costs";
import { buildSpotItinerary } from "./spot-builder";

/**
 * Feature flag — when `true`, `buildItinerary()` delegates to the new spot-based
 * engine (`lib/spot-builder.ts`). When `false`, uses the legacy DayCourse logic.
 *
 * Set via `NEXT_PUBLIC_USE_SPOT_ENGINE=true` in .env.local during migration.
 * Once stable, flip this default to true and remove the legacy path.
 */
const USE_SPOT_ENGINE = process.env.NEXT_PUBLIC_USE_SPOT_ENGINE === "true";

interface LockedDay {
  dayNumber: number;
  courseId: string;
  city: string;
}

interface BuildInput {
  destinations: string[];
  duration: number; // total days (nights + 1)
  styles?: TravelStyle[];
  travelerType?: TravelerType;
  lockedDays?: LockedDay[];
  /** Day-level density for the spot engine. Ignored by the legacy path. */
  pace?: Pace;
  /** city → hotel coordinates. Spot engine uses this to anchor day start/end. */
  accommodations?: Record<string, Coordinates>;
  /** ISO yyyy-mm-dd. Spot engine uses this to skip spots closed on that weekday. */
  startDate?: string;
}

/**
 * Build a multi-day itinerary by assembling DayCourses.
 *
 * 1. Filter courses by cities, style, traveler type
 * 2. Allocate days per city (proportional to available courses)
 * 3. Score & pick courses
 * 4. Sort by GPS proximity within each city
 * 5. Chain cities in order
 */
export function buildItinerary(input: BuildInput): GeneratedItinerary | null {
  const { destinations, duration, styles, travelerType, lockedDays, pace, accommodations, startDate } = input;

  if (destinations.length === 0 || duration <= 0) return null;

  // Spot-based engine path — used when feature flag is on.
  // Locked-days are not yet supported in the spot engine, so falls back to legacy
  // when locks are present to preserve existing reshuffle/lock UX.
  if (USE_SPOT_ENGINE && (!lockedDays || lockedDays.length === 0)) {
    return buildSpotItinerary({
      destinations,
      duration,
      styles,
      travelerType,
      pace,
      accommodations,
      startDate,
    });
  }

  // If we have locked days, fill only the unlocked slots
  if (lockedDays && lockedDays.length > 0) {
    const lockedCourseIds = new Set(lockedDays.map((d) => d.courseId));
    const unlockedCount = duration - lockedDays.length;

    // Get available courses excluding locked ones
    const available = dayCourses.filter((c) => {
      if (lockedCourseIds.has(c.id)) return false;
      if (!destinations.includes(c.city)) return false;
      if (styles && styles.length > 0 && !styles.some((s) => c.styles.includes(s))) return false;
      if (travelerType && !c.travelerTypes.includes(travelerType)) return false;
      return true;
    });

    // Fallback: city-only filter if strict gives too few
    const fallback = available.length >= unlockedCount ? available : dayCourses.filter((c) =>
      !lockedCourseIds.has(c.id) && destinations.includes(c.city)
    );

    // Score and pick
    const scored = fallback.map((c) => {
      let score = 0;
      if (styles && styles.length > 0) score += styles.filter((s) => c.styles.includes(s)).length * 2;
      if (travelerType && c.travelerTypes.includes(travelerType)) score += 2;
      score += Math.random();
      return { course: c, score };
    });
    scored.sort((a, b) => b.score - a.score);

    // Always fill `unlockedCount` slots, cycling through scored courses if
    // the pool is smaller than the requested number of unlocked days. This
    // mirrors the non-locked branch's "allowing repeats only if necessary"
    // behaviour. Previously this used scored.slice(0, unlockedCount), which
    // silently dropped days when the filtered pool was too small — the user
    // would see a 7-day trip turn into 6 days after a reshuffle.
    const picked: DayCourse[] = [];
    if (scored.length > 0) {
      for (let i = 0; i < unlockedCount; i++) {
        picked.push(scored[i % scored.length].course);
      }
    }

    // Assemble: locked days stay in place, unlocked filled in order
    const days: GeneratedDay[] = [];
    let unlockedIdx = 0;
    for (let dayNum = 1; dayNum <= duration; dayNum++) {
      const locked = lockedDays.find((d) => d.dayNumber === dayNum);
      if (locked) {
        const course = dayCourses.find((c) => c.id === locked.courseId);
        if (course) {
          days.push({ dayNumber: dayNum, course, city: locked.city });
        }
      } else if (unlockedIdx < picked.length) {
        days.push({ dayNumber: dayNum, course: picked[unlockedIdx], city: picked[unlockedIdx].city });
        unlockedIdx++;
      }
    }

    const cityList = [...new Set(days.map((d) => d.city))];
    return {
      days,
      cities: cityList,
      duration: days.length,
      style: (styles && styles.length > 0 ? styles[0] : "relax") as TravelStyle,
      travelerType: travelerType || "couple",
    };
  }

  // Step 1: Filter
  const coursesByCity = new Map<string, DayCourse[]>();
  for (const city of destinations) {
    const filtered = dayCourses.filter((c) => {
      if (c.city !== city) return false;
      if (styles && styles.length > 0 && !styles.some((s) => c.styles.includes(s))) return false;
      if (travelerType && !c.travelerTypes.includes(travelerType)) return false;
      return true;
    });
    // If strict filter gives 0 results, fall back to city-only filter
    const fallback = filtered.length > 0
      ? filtered
      : dayCourses.filter((c) => c.city === city);
    if (fallback.length > 0) {
      coursesByCity.set(city, fallback);
    }
  }

  if (coursesByCity.size === 0) return null;

  // Step 2: Allocate days per city
  const totalAvailable = Array.from(coursesByCity.values()).reduce((sum, cs) => sum + cs.length, 0);
  const allocation = new Map<string, number>();
  let remaining = duration;

  const cityList = Array.from(coursesByCity.keys());
  for (let i = 0; i < cityList.length; i++) {
    const city = cityList[i];
    const courses = coursesByCity.get(city)!;
    if (i === cityList.length - 1) {
      // Last city gets remaining days
      allocation.set(city, Math.max(1, remaining));
    } else {
      // Proportional allocation
      const share = Math.max(1, Math.round((courses.length / totalAvailable) * duration));
      allocation.set(city, Math.min(share, remaining - (cityList.length - i - 1)));
      remaining -= allocation.get(city)!;
    }
  }

  // Step 3: Pick courses per city
  const days: GeneratedDay[] = [];
  let dayNumber = 1;

  for (const city of cityList) {
    const daysForCity = allocation.get(city) ?? 1;
    const available = coursesByCity.get(city) ?? [];

    // Score courses by style/traveler match
    const scored = available.map((c) => {
      let score = 0;
      if (styles && styles.length > 0) {
        const matchCount = styles.filter((s) => c.styles.includes(s)).length;
        score += matchCount * 2; // more style matches = higher score
      }
      if (travelerType && c.travelerTypes.includes(travelerType)) score += 2;
      score += Math.random();
      return { course: c, score };
    });

    scored.sort((a, b) => b.score - a.score);

    // Pick top N, allowing repeats only if necessary
    let picked: DayCourse[] = [];
    for (let i = 0; i < daysForCity; i++) {
      picked.push(scored[i % scored.length].course);
    }

    // Step 4: Sort by GPS proximity within city
    picked = sortByProximity(picked, (c) => c.center);

    for (const course of picked) {
      days.push({ dayNumber, course, city });
      dayNumber++;
    }
  }

  return {
    days,
    cities: cityList,
    duration: days.length,
    style: (styles && styles.length > 0 ? styles[0] : "relax") as TravelStyle,
    travelerType: travelerType || "couple",
  };
}

/** Get matching tours for a generated itinerary */
export function getMatchedTours(itinerary: GeneratedItinerary) {
  const cities = new Set(itinerary.cities);
  return tours.filter((t) => cities.has(t.destination));
}

/** Get matching hotels for a generated itinerary */
export function getMatchedHotels(itinerary: GeneratedItinerary) {
  const cities = new Set(itinerary.cities);
  return hotels.filter((h) => cities.has(h.destination));
}

/** Get costs for a course — prefer course-level costs, fallback to city default */
export function getCourseCosts(course: DayCourse): DayCostBreakdown | undefined {
  return course.costs ?? getDefaultCosts(course.city);
}

/** Sum all local costs, converting to display currency (KRW or USD) */
export function sumLocalCosts(itinerary: GeneratedItinerary, locale: Locale): { food: number; activity: number; transport: number; etc: number } {
  const { convertToDisplay } = require("@/lib/currency");
  const totals = { food: 0, activity: 0, transport: 0, etc: 0 };

  for (const day of itinerary.days) {
    const costs = getCourseCosts(day.course);
    if (!costs) continue;
    totals.food += convertToDisplay(costs.food, costs.currency, locale);
    totals.activity += convertToDisplay(costs.activity, costs.currency, locale);
    totals.transport += convertToDisplay(costs.transport, costs.currency, locale);
    totals.etc += convertToDisplay(costs.etc, costs.currency, locale);
  }

  return totals;
}
