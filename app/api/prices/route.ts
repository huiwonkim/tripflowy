import { NextRequest, NextResponse } from "next/server";
import { kv } from "@vercel/kv";
import { getCachedMrtCityData } from "@/lib/myrealtrip";
import { mrtCityCodes } from "@/lib/myrealtrip-cities";

/**
 * Compute check-in / check-out dates 30 days from now (1-night search).
 * Used for on-demand MRT accommodation lookup.
 */
function getDefaultDates() {
  const now = new Date();
  const checkIn = new Date(now);
  checkIn.setDate(checkIn.getDate() + 30);
  const checkOut = new Date(checkIn);
  checkOut.setDate(checkOut.getDate() + 1);
  return {
    checkIn: checkIn.toISOString().split("T")[0],
    checkOut: checkOut.toISOString().split("T")[0],
  };
}

export async function GET(request: NextRequest) {
  const destination = request.nextUrl.searchParams.get("destination");
  const locale = request.nextUrl.searchParams.get("locale");

  if (!destination) {
    return NextResponse.json({ error: "Missing destination parameter" }, { status: 400 });
  }

  // ── ko locale: fetch live MyRealTrip data on-demand ──
  if (locale === "ko" && process.env.MYREALTRIP_API_KEY && mrtCityCodes[destination]) {
    try {
      const { checkIn, checkOut } = getDefaultDates();
      const mrt = await getCachedMrtCityData(destination, checkIn, checkOut);

      return NextResponse.json(
        {
          updatedAt: new Date().toISOString(),
          flights: mrt.flights,
          hotels: mrt.hotels,
          mylinks: mrt.mylinks,
        },
        {
          headers: {
            "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=7200",
          },
        },
      );
    } catch (err) {
      console.error(`MRT fetch error for ${destination}:`, err);
      // Return 404 so the client falls back to static estimates gracefully.
      return NextResponse.json({ error: "MRT unavailable" }, { status: 404 });
    }
  }

  // ── KV not configured → return 404 so client uses static fallback ──
  if (!process.env.KV_REST_API_URL || !process.env.KV_REST_API_TOKEN) {
    return NextResponse.json({ error: "No price data available" }, { status: 404 });
  }

  // ── Legacy KV cache path (Amadeus/SerpAPI, en locale) ──
  try {
    const raw = await kv.get<string>(`prices:${destination}`);

    if (!raw) {
      return NextResponse.json({ error: "No price data available" }, { status: 404 });
    }

    const data = typeof raw === "string" ? JSON.parse(raw) : raw;

    return NextResponse.json(data, {
      headers: {
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=7200",
      },
    });
  } catch (err) {
    console.error(`KV fetch error for ${destination}:`, err);
    return NextResponse.json({ error: "No price data available" }, { status: 404 });
  }
}
