// Aggregator for active-city spots.
//
// Only Check Kim-verified cities live here. Tokyo is the sole city in V1;
// additional cities land via Sprint 7 (Osaka · Kyoto · Fukuoka · Bangkok · Da Nang)
// through the `scripts/spots-from-csv.ts` pipeline once their CSVs are
// authored + 책킴 verifies spots in person.
//
// Do not add placeholder / unverified spot files — they violate the curated-
// platform positioning and fail the TRUST_PHRASES / lastVerified guardrails
// in `/content/AGENTS.md`.

import type { Spot } from "@/types/spot";

import { tokyoSpots } from "./tokyo";

export const allSpots: Spot[] = [
  ...tokyoSpots,
];

export function getSpotsByCity(city: string): Spot[] {
  return allSpots.filter((s) => s.city === city);
}

export function getSpotById(id: string): Spot | undefined {
  return allSpots.find((s) => s.id === id);
}
