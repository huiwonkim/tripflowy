import type { Coordinates } from "@/types";
import { haversineKm } from "./geo";

/**
 * Offline travel-time estimate between two spots.
 *
 * We intentionally don't hit Google Directions — the cost/complexity
 * isn't worth the marginal accuracy for what's essentially a hint
 * label in the itinerary. A traveler double-checks the real route in
 * Google Maps anyway.
 *
 * Policy:
 *   - Same area OR very short straight-line distance (<0.4 km) → walking
 *   - Otherwise → public transport (subway + short walks to/from station)
 *
 * Times are rounded to human-friendly 5/10/15-min buckets.
 */

export type TravelMode = "walking" | "transit";

export interface TravelEstimate {
  minutes: number;
  mode: TravelMode;
}

const WALK_SPEED_KMH = 4.5; // average city-walk speed with crossings

function bucket(min: number): number {
  if (min < 15) return Math.max(5, Math.round(min / 5) * 5);
  if (min < 60) return Math.round(min / 10) * 10;
  return Math.round(min / 15) * 15;
}

/**
 * Rough transit time for dense-city trips:
 *   - short (1-4km): 15 + (km-1) * 3   → 15-24 min
 *   - medium (4-10km): 24 + (km-4) * 2.5 → 24-39 min
 *   - long (10-25km): 39 + (km-10) * 2   → 39-69 min
 *   - very long (25km+): 69 + (km-25) * 1.5
 * All include typical station walk + one transfer buffer.
 */
function transitMinutes(km: number): number {
  if (km <= 4) return 15 + (km - 1) * 3;
  if (km <= 10) return 24 + (km - 4) * 2.5;
  if (km <= 25) return 39 + (km - 10) * 2;
  return 69 + (km - 25) * 1.5;
}

function walkingMinutes(km: number): number {
  return (km / WALK_SPEED_KMH) * 60;
}

/**
 * Estimate travel time between two geographic points.
 *
 * @param fromArea  — area key of origin spot (optional)
 * @param toArea    — area key of destination spot (optional)
 */
export function estimateTravel(
  from: Coordinates,
  to: Coordinates,
  fromArea?: string,
  toArea?: string,
): TravelEstimate {
  const km = haversineKm(from, to);

  // Same area (or both area-less) → assume walking
  const sameArea = fromArea && toArea && fromArea === toArea;
  const veryShort = km < 0.4;

  if (sameArea || veryShort) {
    return {
      minutes: bucket(walkingMinutes(km)),
      mode: "walking",
    };
  }

  // Edge case: different areas but still within walking reach (<1 km).
  // Tokyo travelers often walk between adjacent districts like Shibuya ↔
  // Harajuku when the path is short, so compare walking to transit and
  // pick whichever is faster.
  const walkMin = walkingMinutes(km);
  const trainMin = transitMinutes(km);
  if (walkMin < trainMin) {
    return { minutes: bucket(walkMin), mode: "walking" };
  }
  return { minutes: bucket(trainMin), mode: "transit" };
}
