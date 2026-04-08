import type { DayCourse, DayCostBreakdown, GeneratedItinerary, TravelStyle, TravelerType, GeneratedDay, Locale } from "@/types";
import { dayCourses } from "@/data/day-courses";
import { tours } from "@/data/tours";
import { hotels } from "@/data/hotels";
import { sortByProximity } from "./geo";
import { getDefaultCosts } from "@/data/course-costs";

interface BuildInput {
  destinations: string[];
  duration: number; // total days (nights + 1)
  style?: TravelStyle;
  travelerType?: TravelerType;
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
  const { destinations, duration, style, travelerType } = input;

  if (destinations.length === 0 || duration <= 0) return null;

  // Step 1: Filter
  const coursesByCity = new Map<string, DayCourse[]>();
  for (const city of destinations) {
    const filtered = dayCourses.filter((c) => {
      if (c.city !== city) return false;
      if (style && !c.styles.includes(style)) return false;
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
      if (style && c.styles.includes(style)) score += 2;
      if (travelerType && c.travelerTypes.includes(travelerType)) score += 2;
      score += Math.random(); // tie-breaking randomness
      return { course: c, score };
    });

    scored.sort((a, b) => b.score - a.score);

    // Pick top N, allowing repeats only if necessary
    let picked: DayCourse[] = [];
    for (let i = 0; i < daysForCity; i++) {
      picked.push(scored[i % scored.length].course);
    }

    // Step 4: Sort by GPS proximity within city
    picked = sortByProximity(picked);

    for (const course of picked) {
      days.push({ dayNumber, course, city });
      dayNumber++;
    }
  }

  return {
    days,
    cities: cityList,
    duration: days.length,
    style: style || "relaxed",
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
