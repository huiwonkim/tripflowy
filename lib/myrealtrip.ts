/**
 * MyRealTrip Partner API client.
 *
 * All functions are server-only — require MYREALTRIP_API_KEY env var.
 * Do NOT import this module into client components.
 */

import { unstable_cache } from "next/cache";
import { MRT_ORIGIN, getMrtCity, isDirectAirline } from "./myrealtrip-cities";

const MRT_BASE = "https://partner-ext-api.myrealtrip.com";

// Low-cost carrier IATA codes used to classify MRT flight responses.
// Kept in sync with the (dormant) cron file at app/api/cron/update-prices/route.ts.
const LCC_CARRIERS = new Set([
  "7C",  // Jeju Air
  "LJ",  // Jin Air
  "TW",  // T'way Air
  "BX",  // Air Busan
  "RS",  // Air Seoul
  "4H",  // Hi Air
  "ZE",  // Eastar Jet
  "VJ",  // VietJet
  "AK",  // AirAsia
  "FD",  // AirAsia (Thai)
  "SL",  // Thai Lion Air
  "NK",  // Spirit
  "F9",  // Frontier
  "W6",  // Wizz Air
  "FR",  // Ryanair
  "U2",  // EasyJet
  "MM",  // Peach
  "APJ", // Peach (alt code)
  "GK",  // Jetstar Japan
  "QZ",  // AirAsia Indonesia
  "TR",  // Scoot
  "5J",  // Cebu Pacific
  "ZG",  // ZIPAIR (JAL's LCC)
  "VY",  // Vueling
  "9C",  // Spring Airlines
  "XJ",  // Thai AirAsia X
  "JT",  // Lion Air
  "ID",  // Batik Air
]);

// Compute the p-th percentile of a sorted-or-unsorted number array.
function percentile(arr: number[], p: number): number {
  if (arr.length === 0) return 0;
  const sorted = [...arr].sort((a, b) => a - b);
  const idx = Math.ceil((p / 100) * sorted.length) - 1;
  return sorted[Math.max(0, Math.min(idx, sorted.length - 1))];
}

// ── Types ───────────────────────────────────────────

interface MrtEnvelope<T> {
  data: T;
  meta: { totalCount?: number };
  result: { status: number; message: string; code: string | null };
}

interface MrtFlightLowestItem {
  fromCity: string;
  toCity: string;
  period: number;
  departureDate: string;
  returnDate: string;
  totalPrice: number;
  airline: string | null;
  transfer: number | null;
  averagePrice: number | null;
}

interface MrtAccommodationData {
  items: Array<{
    itemId: number;
    itemName: string;
    salePrice: number;
    originalPrice: number;
    starRating?: number;
    reviewScore?: string;
    reviewCount?: number;
  }>;
  totalCount: number;
  page: number;
  size: number;
}

interface MrtMylinkData {
  mylink: string;
}

// ── Flight range type used by the cron/KV layer ──────

export interface MrtFlightResult {
  fsc: { min: number; max: number };
  lcc: { min: number; max: number };
}

export interface MrtHotelResult {
  budget: { min: number; max: number };
  standard: { min: number; max: number };
  luxury: { min: number; max: number };
}

export interface MrtMylinks {
  flight?: string;
  hotel?: string;
}

// ── Core HTTP wrapper ───────────────────────────────

async function mrtPost<T>(path: string, body: object): Promise<T | null> {
  const key = process.env.MYREALTRIP_API_KEY;
  if (!key) return null;

  try {
    const res = await fetch(`${MRT_BASE}${path}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      console.error(`[MRT] ${path} ${res.status}`);
      return null;
    }

    const json = (await res.json()) as MrtEnvelope<T>;
    if (json.result?.status !== 200) {
      console.error(`[MRT] ${path} result.status=${json.result?.status} msg=${json.result?.message}`);
      return null;
    }
    return json.data;
  } catch (err) {
    console.error(`[MRT] ${path} fetch failed:`, err);
    return null;
  }
}

// ── Flight lowest ──────────────────────────────────

/**
 * Fetch flight prices for a city pair via `/flight/calendar/window`.
 * Filters to direct-operator airlines only (Korean + destination-country
 * carriers). Returns FSC/LCC ranges where:
 *   - min = absolute lowest price found
 *   - max = 75th percentile (caps extreme outliers)
 *
 * Returns `{min:0, max:0}` for a carrier type when no direct flights were
 * found for it. Returns `null` if no direct flights at all.
 */
export async function fetchMrtFlightLowest(cityId: string): Promise<MrtFlightResult | null> {
  const city = getMrtCity(cityId);
  if (!city) return null;

  const data = await mrtPost<MrtFlightLowestItem[]>(
    "/v1/products/flight/calendar/window",
    {
      depCityCd: MRT_ORIGIN,
      arrCityCd: city.cityCode,
      period: 5,
    },
  );

  if (!data || !Array.isArray(data)) return null;

  const fscPrices: number[] = [];
  const lccPrices: number[] = [];

  for (const item of data) {
    if (item.totalPrice <= 0) continue;
    // Filter: only keep direct-operator airlines for this destination.
    if (!isDirectAirline(cityId, item.airline)) continue;
    // Classify FSC/LCC by airline code (null → FSC as conservative default)
    const isLcc = item.airline != null && LCC_CARRIERS.has(item.airline);
    if (isLcc) {
      lccPrices.push(item.totalPrice);
    } else {
      fscPrices.push(item.totalPrice);
    }
  }

  if (fscPrices.length === 0 && lccPrices.length === 0) return null;

  return {
    fsc: fscPrices.length > 0
      ? { min: Math.min(...fscPrices), max: percentile(fscPrices, 75) }
      : { min: 0, max: 0 },
    lcc: lccPrices.length > 0
      ? { min: Math.min(...lccPrices), max: percentile(lccPrices, 75) }
      : { min: 0, max: 0 },
  };
}

// ── Accommodation search ───────────────────────────

export async function fetchMrtAccommodation(
  cityId: string,
  checkIn: string,
  checkOut: string,
): Promise<MrtHotelResult | null> {
  const city = getMrtCity(cityId);
  if (!city) return null;

  const data = await mrtPost<MrtAccommodationData>(
    "/v1/products/accommodation/search",
    {
      keyword: city.keyword,
      checkIn,
      checkOut,
      adultCount: 2,
      size: 50,
      page: 0,
    },
  );

  if (!data?.items?.length) return null;

  // Per-night basis: divide total salePrice by 1 (1-night search).
  const prices = data.items
    .map((i) => i.salePrice)
    .filter((p) => p > 0)
    .sort((a, b) => a - b);

  if (prices.length === 0) return null;

  const len = prices.length;
  const q25 = prices[Math.floor(len * 0.25)] ?? prices[0];
  const q65 = prices[Math.floor(len * 0.65)] ?? prices[Math.floor(len * 0.5)];
  const q75 = prices[Math.floor(len * 0.75)] ?? prices[Math.floor(len * 0.5)];

  return {
    budget: {
      min: prices[0],
      max: q25,
    },
    standard: {
      min: q25,
      max: q65,
    },
    luxury: {
      min: q75,
      max: prices[len - 1],
    },
  };
}

// ── MyLink (affiliate tracking) ─────────────────────

export async function createMrtMylink(targetUrl: string): Promise<string | null> {
  if (targetUrl.length > 2000) {
    console.warn(`[MRT] mylink targetUrl too long (${targetUrl.length})`);
    return null;
  }
  const data = await mrtPost<MrtMylinkData>("/v1/mylink", { targetUrl });
  return data?.mylink ?? null;
}

// ── URL builders ───────────────────────────────────

/**
 * Build a MyRealTrip search URL for a destination city (used as MyLink target).
 * Falls back to the generic offers search if the city is unknown.
 */
export function buildMrtHotelSearchUrl(cityId: string): string {
  const city = getMrtCity(cityId);
  const q = encodeURIComponent(city?.keyword ?? cityId);
  return `https://www.myrealtrip.com/search?keyword=${q}`;
}

/**
 * Build a MyRealTrip flight search URL (best-effort).
 * Uses the flights subdomain with airport codes.
 */
export function buildMrtFlightSearchUrl(cityId: string): string {
  const city = getMrtCity(cityId);
  if (!city) return "https://flights.myrealtrip.com/";
  // Use a generic landing URL with from/to codes
  return `https://flights.myrealtrip.com/?from=${MRT_ORIGIN}&to=${city.cityCode}`;
}

// ── Fetch all (convenience for cron) ────────────────

export interface MrtCityData {
  flights: MrtFlightResult | null;
  hotels: MrtHotelResult | null;
  mylinks: MrtMylinks;
}

/**
 * Fetch all MRT data for a single city: flight prices, hotel prices, and mylinks.
 * Rate-limit pacing is applied between sub-requests.
 */
export async function fetchMrtCityData(
  cityId: string,
  checkIn: string,
  checkOut: string,
): Promise<MrtCityData> {
  const flights = await fetchMrtFlightLowest(cityId);
  await new Promise((r) => setTimeout(r, 300));

  const hotels = await fetchMrtAccommodation(cityId, checkIn, checkOut);
  await new Promise((r) => setTimeout(r, 300));

  const flightUrl = buildMrtFlightSearchUrl(cityId);
  const hotelUrl = buildMrtHotelSearchUrl(cityId);

  const [flightMylink, hotelMylink] = await Promise.all([
    createMrtMylink(flightUrl),
    createMrtMylink(hotelUrl),
  ]);

  return {
    flights,
    hotels,
    mylinks: {
      flight: flightMylink ?? undefined,
      hotel: hotelMylink ?? undefined,
    },
  };
}

/**
 * Cached version of fetchMrtCityData. Results are cached per (cityId, checkIn, checkOut)
 * for 1 hour using Next.js `unstable_cache`. Use this from API routes and Server
 * Components to avoid hammering the MRT API on every request.
 */
export const getCachedMrtCityData = unstable_cache(
  async (cityId: string, checkIn: string, checkOut: string): Promise<MrtCityData> => {
    return fetchMrtCityData(cityId, checkIn, checkOut);
  },
  ["mrt-city-data-v3"], // v3: /window endpoint + direct filter + p75 max
  { revalidate: 3600, tags: ["mrt"] },
);
