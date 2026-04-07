import { NextRequest, NextResponse } from "next/server";
import { kv } from "@vercel/kv";

export async function GET(request: NextRequest) {
  const destination = request.nextUrl.searchParams.get("destination");

  if (!destination) {
    return NextResponse.json({ error: "Missing destination parameter" }, { status: 400 });
  }

  try {
    const raw = await kv.get<string>(`prices:${destination}`);

    if (!raw) {
      return NextResponse.json({ error: "No price data available", destination }, { status: 404 });
    }

    const data = typeof raw === "string" ? JSON.parse(raw) : raw;

    return NextResponse.json(data, {
      headers: {
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=7200",
      },
    });
  } catch (err) {
    console.error(`Price fetch error for ${destination}:`, err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
