import { NextRequest, NextResponse } from "next/server";
import { kv } from "@vercel/kv";
import { cityToAirport, allCityIds } from "@/lib/airports";

const ORIGIN = "ICN"; // Incheon

// ── Amadeus Auth ────────────────────────────────────

async function getAmadeusToken(): Promise<string> {
  const res = await fetch("https://api.amadeus.com/v1/security/oauth2/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "client_credentials",
      client_id: process.env.AMADEUS_API_KEY!,
      client_secret: process.env.AMADEUS_API_SECRET!,
    }),
  });
  const data = await res.json();
  return data.access_token;
}

// ── Amadeus Flight Search ───────────────────────────

interface FlightResult {
  fsc: { min: number; max: number };
  lcc: { min: number; max: number };
}

const LCC_CARRIERS = new Set([
  "7C", // Jeju Air
  "LJ", // Jin Air
  "TW", // T'way Air
  "BX", // Air Busan
  "RS", // Air Seoul
  "4H", // Hi Air
  "ZE", // Eastar Jet
  "VJ", // VietJet
  "AK", // AirAsia
  "FD", // AirAsia (Thai)
  "SL", // Thai Lion Air
  "NK", // Spirit
  "F9", // Frontier
  "W6", // Wizz Air
  "FR", // Ryanair
  "U2", // EasyJet
  "MM", // Peach
  "GK", // Jetstar Japan
  "QZ", // AirAsia Indonesia
  "TR", // Scoot
  "5J", // Cebu Pacific
]);

async function fetchFlights(token: string, destination: string, departureDate: string): Promise<FlightResult | null> {
  const airport = cityToAirport[destination];
  if (!airport) return null;

  try {
    const url = new URL("https://api.amadeus.com/v2/shopping/flight-offers");
    url.searchParams.set("originLocationCode", ORIGIN);
    url.searchParams.set("destinationLocationCode", airport);
    url.searchParams.set("departureDate", departureDate);
    url.searchParams.set("adults", "1");
    url.searchParams.set("currencyCode", "KRW");
    url.searchParams.set("max", "50");
    url.searchParams.set("nonStop", "false");

    const res = await fetch(url.toString(), {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) {
      console.error(`Amadeus error for ${destination}: ${res.status}`);
      return null;
    }

    const data = await res.json();
    const offers = data.data ?? [];

    const fscPrices: number[] = [];
    const lccPrices: number[] = [];

    for (const offer of offers) {
      const price = Number(offer.price?.total ?? 0);
      if (price <= 0) continue;

      // Check if any segment uses an LCC carrier
      const carriers = new Set<string>();
      for (const itin of offer.itineraries ?? []) {
        for (const seg of itin.segments ?? []) {
          carriers.add(seg.carrierCode);
        }
      }

      const isLcc = [...carriers].some((c) => LCC_CARRIERS.has(c));
      if (isLcc) {
        lccPrices.push(price);
      } else {
        fscPrices.push(price);
      }
    }

    return {
      fsc: fscPrices.length > 0
        ? { min: Math.min(...fscPrices), max: percentile(fscPrices, 75) }
        : { min: 0, max: 0 },
      lcc: lccPrices.length > 0
        ? { min: Math.min(...lccPrices), max: percentile(lccPrices, 75) }
        : { min: 0, max: 0 },
    };
  } catch (err) {
    console.error(`Flight fetch failed for ${destination}:`, err);
    return null;
  }
}

function percentile(arr: number[], p: number): number {
  const sorted = [...arr].sort((a, b) => a - b);
  const idx = Math.ceil((p / 100) * sorted.length) - 1;
  return sorted[Math.max(0, idx)];
}

// ── SerpAPI Hotel Search ────────────────────────────

interface HotelResult {
  budget: { min: number; max: number };
  standard: { min: number; max: number };
  luxury: { min: number; max: number };
}

const CITY_HOTEL_QUERIES: Record<string, string> = {
  danang: "Da Nang hotels",
  nhatrang: "Nha Trang hotels",
  hanoi: "Hanoi hotels",
  bangkok: "Bangkok hotels",
  pattaya: "Pattaya hotels",
  chiangmai: "Chiang Mai hotels",
  phuket: "Phuket hotels",
  bali: "Bali hotels",
  tokyo: "Tokyo hotels",
  osaka: "Osaka hotels",
  kyoto: "Kyoto hotels",
  nagoya: "Nagoya hotels",
  fukuoka: "Fukuoka hotels",
  paris: "Paris hotels",
  rome: "Rome hotels",
  florence: "Florence hotels",
  venice: "Venice hotels",
  london: "London hotels",
  barcelona: "Barcelona hotels",
  shanghai: "Shanghai hotels",
  beijing: "Beijing hotels",
  la: "Los Angeles hotels",
  lasvegas: "Las Vegas hotels",
  newyork: "New York hotels",
  seattle: "Seattle hotels",
  boston: "Boston hotels",
  istanbul: "Istanbul hotels",
  cappadocia: "Cappadocia hotels",
  antalya: "Antalya hotels",
};

async function fetchHotels(destination: string, checkIn: string, checkOut: string): Promise<HotelResult | null> {
  const query = CITY_HOTEL_QUERIES[destination];
  if (!query) return null;

  try {
    const url = new URL("https://serpapi.com/search.json");
    url.searchParams.set("engine", "google_hotels");
    url.searchParams.set("q", query);
    url.searchParams.set("check_in_date", checkIn);
    url.searchParams.set("check_out_date", checkOut);
    url.searchParams.set("currency", "KRW");
    url.searchParams.set("gl", "kr");
    url.searchParams.set("hl", "ko");
    url.searchParams.set("api_key", process.env.SERPAPI_KEY!);

    const res = await fetch(url.toString());
    if (!res.ok) {
      console.error(`SerpAPI error for ${destination}: ${res.status}`);
      return null;
    }

    const data = await res.json();
    const properties = data.properties ?? [];

    const prices: number[] = properties
      .map((p: { total_rate?: { lowest?: string }; rate_per_night?: { lowest?: string } }) => {
        const raw = p.total_rate?.lowest ?? p.rate_per_night?.lowest ?? "0";
        return Number(raw.replace(/[^0-9]/g, ""));
      })
      .filter((p: number) => p > 0);

    if (prices.length === 0) return null;

    prices.sort((a: number, b: number) => a - b);
    const len = prices.length;

    return {
      budget: {
        min: prices[0],
        max: prices[Math.floor(len * 0.25)] ?? prices[0],
      },
      standard: {
        min: prices[Math.floor(len * 0.25)] ?? prices[0],
        max: prices[Math.floor(len * 0.65)] ?? prices[Math.floor(len * 0.5)],
      },
      luxury: {
        min: prices[Math.floor(len * 0.75)] ?? prices[Math.floor(len * 0.5)],
        max: prices[len - 1],
      },
    };
  } catch (err) {
    console.error(`Hotel fetch failed for ${destination}:`, err);
    return null;
  }
}

// ── Main Cron Handler ───────────────────────────────

export async function GET(request: NextRequest) {
  // Verify cron secret
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Determine update type from query param
  const updateType = request.nextUrl.searchParams.get("type") ?? "all";
  const doFlights = updateType === "flights" || updateType === "all";
  const doHotels = updateType === "hotels" || updateType === "all";

  // Calculate dates: 30 days from now
  const now = new Date();
  const departureDate = new Date(now);
  departureDate.setDate(departureDate.getDate() + 30);
  const checkOutDate = new Date(departureDate);
  checkOutDate.setDate(checkOutDate.getDate() + 1);

  const depStr = departureDate.toISOString().split("T")[0];
  const checkInStr = depStr;
  const checkOutStr = checkOutDate.toISOString().split("T")[0];

  console.log(`[cron] Starting ${updateType} update — departure: ${depStr}`);

  // Get Amadeus token (only if updating flights)
  let amadeusToken: string | null = null;
  if (doFlights) {
    try {
      if (process.env.AMADEUS_API_KEY && process.env.AMADEUS_API_SECRET) {
        amadeusToken = await getAmadeusToken();
      }
    } catch (err) {
      console.error("[cron] Amadeus auth failed:", err);
    }
  }

  const results: Record<string, string> = {};

  for (const cityId of allCityIds) {
    console.log(`[cron] Processing ${cityId} (${updateType})...`);

    // Load existing data from KV to merge partial updates
    let existing: { flights?: FlightResult | null; hotels?: HotelResult | null } = {};
    try {
      const raw = await kv.get<string>(`prices:${cityId}`);
      if (raw) {
        existing = typeof raw === "string" ? JSON.parse(raw) : raw;
      }
    } catch { /* ignore */ }

    // Fetch flights (daily)
    let flights: FlightResult | null = existing.flights ?? null;
    if (doFlights && amadeusToken) {
      const result = await fetchFlights(amadeusToken, cityId, depStr);
      if (result && (result.fsc.min > 0 || result.lcc.min > 0)) {
        flights = result;
      }
      await new Promise((r) => setTimeout(r, 1200));
    }

    // Fetch hotels (weekly)
    let hotels: HotelResult | null = existing.hotels ?? null;
    if (doHotels && process.env.SERPAPI_KEY) {
      const result = await fetchHotels(cityId, checkInStr, checkOutStr);
      if (result) {
        hotels = result;
      }
      await new Promise((r) => setTimeout(r, 1500));
    }

    // Save merged data to KV
    const priceData = {
      updatedAt: now.toISOString(),
      flights,
      hotels,
    };

    try {
      await kv.set(`prices:${cityId}`, JSON.stringify(priceData), { ex: 86400 * 8 }); // 8-day TTL (covers weekly hotel cycle)
      results[cityId] = "ok";
    } catch (err) {
      console.error(`[cron] KV save failed for ${cityId}:`, err);
      results[cityId] = "kv_error";
    }
  }

  console.log(`[cron] ${updateType} update complete`);

  return NextResponse.json({
    success: true,
    type: updateType,
    updated: Object.keys(results).length,
    results,
    departureDate: depStr,
  });
}
