/**
 * GET /api/exchange-rate?from=JPY&to=KRW
 *
 * Proxy around frankfurter.app — a free, no-key European Central Bank FX
 * feed. Updated once a day; 12h ISR cache here to keep quota use trivial
 * even under heavy traffic.
 *
 * Response: { rate: number, date: "YYYY-MM-DD", from: "JPY", to: "KRW" }
 */
import { NextResponse } from "next/server";

// Revalidate every 12 hours. Frankfurter updates ~16:00 CET on weekdays.
export const revalidate = 43200;

const ISO_RE = /^[A-Z]{3}$/;

export async function GET(req: Request) {
  const url = new URL(req.url);
  const from = (url.searchParams.get("from") ?? "").toUpperCase();
  const to = (url.searchParams.get("to") ?? "").toUpperCase();
  if (!ISO_RE.test(from) || !ISO_RE.test(to)) {
    return NextResponse.json({ error: "invalid currency code" }, { status: 400 });
  }
  if (from === to) {
    return NextResponse.json({ rate: 1, date: new Date().toISOString().slice(0, 10), from, to });
  }

  try {
    const res = await fetch(
      `https://api.frankfurter.app/latest?from=${from}&to=${to}`,
      { next: { revalidate: 43200 } },
    );
    if (!res.ok) {
      return NextResponse.json({ error: `upstream ${res.status}` }, { status: 502 });
    }
    const data = await res.json();
    const rate = data?.rates?.[to];
    if (typeof rate !== "number") {
      return NextResponse.json({ error: "rate missing" }, { status: 502 });
    }
    return NextResponse.json({ rate, date: data.date, from, to });
  } catch {
    return NextResponse.json({ error: "fetch failed" }, { status: 502 });
  }
}
