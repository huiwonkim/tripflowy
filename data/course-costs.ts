import type { DayCostBreakdown } from "@/types";

/**
 * Default daily costs by city in local currency.
 * These are applied to all courses for that city unless overridden per-course.
 * User will refine these values later for each individual course.
 */
export const defaultCostsByCity: Record<string, DayCostBreakdown> = {
  // Vietnam (VND) - 1 USD ≈ 25,000 VND
  danang:    { food: 350000, activity: 400000, transport: 100000, etc: 50000, currency: "VND" },
  nhatrang:  { food: 300000, activity: 450000, transport: 80000, etc: 50000, currency: "VND" },
  hanoi:     { food: 300000, activity: 350000, transport: 80000, etc: 50000, currency: "VND" },

  // Thailand (THB) - 1 USD ≈ 35 THB
  bangkok:   { food: 500, activity: 600, transport: 200, etc: 100, currency: "THB" },
  pattaya:   { food: 500, activity: 800, transport: 250, etc: 100, currency: "THB" },
  chiangmai: { food: 400, activity: 700, transport: 150, etc: 100, currency: "THB" },
  phuket:    { food: 600, activity: 900, transport: 300, etc: 150, currency: "THB" },

  // Indonesia (IDR) - 1 USD ≈ 16,000 IDR
  bali:      { food: 200000, activity: 350000, transport: 100000, etc: 50000, currency: "IDR" },

  // Japan (JPY) - 1 USD ≈ 150 JPY
  tokyo:     { food: 3000, activity: 2500, transport: 1000, etc: 500, currency: "JPY" },
  osaka:     { food: 2500, activity: 2000, transport: 800, etc: 500, currency: "JPY" },
  kyoto:     { food: 2500, activity: 2500, transport: 600, etc: 500, currency: "JPY" },
  nagoya:    { food: 2500, activity: 2000, transport: 700, etc: 500, currency: "JPY" },
  fukuoka:   { food: 2000, activity: 1500, transport: 600, etc: 400, currency: "JPY" },

  // France/Italy/Spain (EUR)
  paris:     { food: 35, activity: 25, transport: 8, etc: 10, currency: "EUR" },
  rome:      { food: 30, activity: 20, transport: 7, etc: 8, currency: "EUR" },
  florence:  { food: 30, activity: 25, transport: 5, etc: 10, currency: "EUR" },
  venice:    { food: 35, activity: 25, transport: 15, etc: 10, currency: "EUR" },
  barcelona: { food: 28, activity: 20, transport: 7, etc: 8, currency: "EUR" },

  // UK (GBP)
  london:    { food: 30, activity: 20, transport: 10, etc: 8, currency: "GBP" },

  // China (CNY) - 1 USD ≈ 7.2 CNY
  shanghai:  { food: 120, activity: 100, transport: 30, etc: 20, currency: "CNY" },
  beijing:   { food: 100, activity: 120, transport: 25, etc: 20, currency: "CNY" },

  // USA (USD)
  la:        { food: 40, activity: 30, transport: 15, etc: 10, currency: "USD" },
  lasvegas:  { food: 50, activity: 40, transport: 10, etc: 20, currency: "USD" },
  newyork:   { food: 45, activity: 35, transport: 12, etc: 10, currency: "USD" },
  seattle:   { food: 35, activity: 25, transport: 10, etc: 8, currency: "USD" },
  boston:     { food: 35, activity: 25, transport: 10, etc: 8, currency: "USD" },

  // Türkiye (TRY) - 1 USD ≈ 32 TRY
  istanbul:   { food: 400, activity: 500, transport: 100, etc: 80, currency: "TRY" },
  cappadocia: { food: 350, activity: 1500, transport: 200, etc: 100, currency: "TRY" },
  antalya:    { food: 350, activity: 400, transport: 150, etc: 80, currency: "TRY" },
};

/** Get costs for a course (by city, since we use city defaults) */
export function getDefaultCosts(cityId: string): DayCostBreakdown | undefined {
  return defaultCostsByCity[cityId];
}
