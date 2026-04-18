import type { Coordinates } from "@/types";

/** Haversine distance between two GPS coordinates in kilometers */
export function haversineKm(a: Coordinates, b: Coordinates): number {
  const R = 6371;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const sinLat = Math.sin(dLat / 2);
  const sinLng = Math.sin(dLng / 2);
  const h = sinLat * sinLat + Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * sinLng * sinLng;
  return R * 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
}

function toRad(deg: number): number {
  return (deg * Math.PI) / 180;
}

/**
 * Sort items by proximity using a greedy nearest-neighbor approach.
 * Starts from the first item and always picks the nearest unvisited next.
 *
 * Pass a getter to support any shape — e.g. DayCourse uses `center`, Spot uses `location`.
 */
export function sortByProximity<T>(
  items: T[],
  getCoord: (item: T) => Coordinates,
): T[] {
  if (items.length <= 1) return items;

  const remaining = [...items];
  const sorted: T[] = [remaining.shift()!];

  while (remaining.length > 0) {
    const last = sorted[sorted.length - 1];
    const lastCoord = getCoord(last);
    let nearestIdx = 0;
    let nearestDist = Infinity;

    for (let i = 0; i < remaining.length; i++) {
      const d = haversineKm(lastCoord, getCoord(remaining[i]));
      if (d < nearestDist) {
        nearestDist = d;
        nearestIdx = i;
      }
    }

    sorted.push(remaining.splice(nearestIdx, 1)[0]);
  }

  return sorted;
}
