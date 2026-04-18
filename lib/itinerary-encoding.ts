/**
 * Version-2 shareable itinerary encoding.
 *
 * Payload is JSON → UTF-8 → base64url (no compression library — typical payloads
 * are < 1KB which fits comfortably in URLs). URLs look like `?v=2&s=<base64url>`.
 *
 * The spot engine is mostly deterministic but includes small random jitter for
 * scoring diversity, so we snapshot the actual spot IDs per day to guarantee
 * the shared link reproduces exactly what the original viewer saw.
 */
import type {
  GeneratedItinerary,
  PlannerInput,
  TravelerType,
  TravelStyle,
} from "@/types";
import type { Pace } from "@/types/spot";

export const URL_VERSION = 2;

/**
 * Compact shared payload shape. Short keys keep the URL shorter.
 */
export type SharedV2 = {
  d: string[];                               // destinations
  n: number;                                 // nights (not days)
  sp: string[][];                            // sp[dayIdx] = spotIds (in visit order)
  cp?: string[];                             // city per day (aligns with sp)
  ac?: Record<string, [number, number]>;     // city → [lat, lng]
  sd?: string;                               // startDate
  t?: TravelerType;
  st?: TravelStyle[];
  p?: Pace;
};

/** base64url = RFC 4648 §5. Safe in URL/querystring without percent-encoding. */
function base64urlEncode(utf8: string): string {
  if (typeof window === "undefined") {
    return Buffer.from(utf8, "utf-8").toString("base64")
      .replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
  }
  // Browser: btoa works on Latin-1, so we first encode UTF-8 to bytes
  const bytes = new TextEncoder().encode(utf8);
  let bin = "";
  bytes.forEach((b) => { bin += String.fromCharCode(b); });
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function base64urlDecode(s: string): string | null {
  try {
    const pad = "=".repeat((4 - (s.length % 4)) % 4);
    const b64 = (s + pad).replace(/-/g, "+").replace(/_/g, "/");
    if (typeof window === "undefined") {
      return Buffer.from(b64, "base64").toString("utf-8");
    }
    const bin = atob(b64);
    const bytes = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
    return new TextDecoder().decode(bytes);
  } catch {
    return null;
  }
}

/**
 * Build a shareable URL slug from the current itinerary + user input.
 * Returns the `s` value only (no URL prefix).
 */
export function encodeItinerary(
  itinerary: GeneratedItinerary,
  input: PlannerInput,
): string {
  const spotsPerDay: string[][] = itinerary.days.map((d) =>
    d.course.activities
      .map((a) => a.spotId)
      .filter((id): id is string => Boolean(id)),
  );
  const cityPerDay: string[] = itinerary.days.map((d) => d.city);

  const payload: SharedV2 = {
    d: input.destinations,
    n: Number(input.duration) || 0,
    sp: spotsPerDay,
    cp: cityPerDay,
    ...(input.travelerType ? { t: input.travelerType as TravelerType } : {}),
    ...(input.styles && input.styles.length > 0 ? { st: input.styles } : {}),
    ...(input.pace ? { p: input.pace } : {}),
    ...(input.startDate ? { sd: input.startDate } : {}),
  };

  if (input.accommodations) {
    const ac: Record<string, [number, number]> = {};
    for (const [city, acc] of Object.entries(input.accommodations)) {
      if (acc.source !== "default" && acc.location) {
        ac[city] = [
          Number(acc.location.lat.toFixed(5)),
          Number(acc.location.lng.toFixed(5)),
        ];
      }
    }
    if (Object.keys(ac).length > 0) payload.ac = ac;
  }

  return base64urlEncode(JSON.stringify(payload));
}

/**
 * Decode a shared URL slug back into a SharedV2 payload.
 * Returns null when the input is malformed or from an incompatible version.
 */
export function decodeItinerary(s: string): SharedV2 | null {
  const text = base64urlDecode(s);
  if (!text) return null;
  try {
    const obj = JSON.parse(text);
    if (!obj || typeof obj !== "object") return null;
    if (!Array.isArray(obj.d) || typeof obj.n !== "number" || !Array.isArray(obj.sp)) return null;
    return obj as SharedV2;
  } catch {
    return null;
  }
}

/** Build a full shareable URL for the current page + itinerary. */
export function buildShareableUrl(
  itinerary: GeneratedItinerary,
  input: PlannerInput,
  origin: string = typeof window !== "undefined" ? window.location.origin : "",
  pathname: string = typeof window !== "undefined" ? window.location.pathname : "/planner",
): string {
  const s = encodeItinerary(itinerary, input);
  return `${origin}${pathname}?v=${URL_VERSION}&s=${s}`;
}
