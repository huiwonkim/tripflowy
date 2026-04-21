/**
 * Shared CSV <-> Spot conversion logic for spots-to-csv.ts / spots-from-csv.ts.
 * Keeps column order and encoding rules in one place so the round-trip stays stable.
 */
import type { Spot } from "../types/spot";

// ────────────────────────────────────────────────────────
// Google Maps URL → { lat, lng } extraction
// ────────────────────────────────────────────────────────

const LATLNG_PATTERNS = [
  /@(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)/,        // /maps/@lat,lng  or  /place/…/@lat,lng
  /!3d(-?\d+(?:\.\d+)?)!4d(-?\d+(?:\.\d+)?)/,    // !3dLAT!4dLNG (long place URLs)
  /[?&]q=(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)/,   // ?q=lat,lng
  /[?&]ll=(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)/,  // ?ll=lat,lng
  /[?&]destination=(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)/, // directions URLs
];

function matchLatLng(text: string): { lat: number; lng: number } | null {
  for (const pat of LATLNG_PATTERNS) {
    const m = text.match(pat);
    if (m) {
      const lat = Number(m[1]);
      const lng = Number(m[2]);
      if (
        Number.isFinite(lat) &&
        Number.isFinite(lng) &&
        lat >= -90 &&
        lat <= 90 &&
        lng >= -180 &&
        lng <= 180
      ) {
        return { lat, lng };
      }
    }
  }
  return null;
}

/**
 * Extracts lat/lng from a Google Maps URL.
 * Handles:
 *   - https://www.google.com/maps/place/…/@35.67,139.76,17z/…
 *   - https://www.google.com/maps/@35.67,139.76,17z
 *   - https://maps.app.goo.gl/xxxxx   (shortened — resolved via redirect)
 *   - https://goo.gl/maps/xxxxx       (shortened — resolved via redirect)
 * Returns null if extraction fails.
 */
export async function extractLatLng(
  url: string,
): Promise<{ lat: number; lng: number } | null> {
  const trimmed = url.trim();
  if (!trimmed) return null;

  // Fast path: lat/lng already in the URL.
  const direct = matchLatLng(trimmed);
  if (direct) return direct;

  // Shortened URLs — follow redirects to get the full URL.
  if (/(maps\.app\.goo\.gl|goo\.gl\/maps)/i.test(trimmed)) {
    try {
      const res = await fetch(trimmed, {
        method: "GET",
        redirect: "follow",
        headers: { "user-agent": "Mozilla/5.0 (spots-import)" },
      });
      const finalUrl = res.url;
      const fromUrl = matchLatLng(finalUrl);
      if (fromUrl) return fromUrl;
      // Some short URLs redirect to a page whose body contains the coords.
      const body = await res.text();
      return matchLatLng(body);
    } catch {
      return null;
    }
  }

  return null;
}

export const CSV_COLUMNS = [
  "id",
  "city",
  "name_en",
  "name_ko",
  "category",
  "mealSlot",
  "styles",
  "travelerTypes",
  "lat",
  "lng",
  "duration_min",
  "duration_typical",
  "duration_max",
  "priority",
  "area",
  "openHours_open",
  "openHours_close",
  "closedDays",
  "description_en",
  "description_ko",
  "tips_en",
  "tips_ko",
  "photos",
  "postSlug",
  "googleMapsUrl",
  "costAmount",
  "costCurrency",
  "tags",
  "chain",
  "fullDay",
  "booking_klook",
  "booking_agoda",
  "booking_mrt",
  "booking_direct",
] as const;

export type CsvColumn = (typeof CSV_COLUMNS)[number];

const ARRAY_SEP = "|";

export function encodeCsvCell(value: string | number | undefined | null): string {
  if (value === undefined || value === null) return "";
  const s = String(value);
  if (s === "") return "";
  if (/[",\n\r]/.test(s)) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}

export function encodeCsvRow(cells: readonly (string | number | undefined | null)[]): string {
  return cells.map(encodeCsvCell).join(",");
}

/** RFC 4180-ish CSV parser. Handles quoted fields, embedded newlines, escaped quotes. */
export function parseCsv(text: string): string[][] {
  // Strip UTF-8 BOM if present.
  if (text.charCodeAt(0) === 0xfeff) text = text.slice(1);
  const rows: string[][] = [];
  let row: string[] = [];
  let cell = "";
  let inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQuotes) {
      if (c === '"') {
        if (text[i + 1] === '"') {
          cell += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        cell += c;
      }
      continue;
    }
    if (c === '"') {
      inQuotes = true;
    } else if (c === ",") {
      row.push(cell);
      cell = "";
    } else if (c === "\n") {
      row.push(cell);
      rows.push(row);
      row = [];
      cell = "";
    } else if (c === "\r") {
      // ignore, handled on \n
    } else {
      cell += c;
    }
  }
  // Final cell / row (allow file without trailing newline).
  if (cell !== "" || row.length > 0) {
    row.push(cell);
    rows.push(row);
  }
  // Drop trailing empty rows.
  while (rows.length > 0 && rows[rows.length - 1].every((c) => c === "")) {
    rows.pop();
  }
  return rows;
}

function arr(s: string): string[] {
  return s.split(ARRAY_SEP).map((x) => x.trim()).filter(Boolean);
}

export function spotToRow(s: Spot): (string | number | undefined)[] {
  return [
    s.id,
    s.city,
    s.name.en,
    s.name.ko,
    s.category,
    s.mealSlot ?? "",
    s.styles.join(ARRAY_SEP),
    s.travelerTypes.join(ARRAY_SEP),
    s.location.lat,
    s.location.lng,
    s.duration.min,
    s.duration.typical,
    s.duration.max,
    s.priority,
    s.area ?? "",
    s.openHours?.open ?? "",
    s.openHours?.close ?? "",
    (s.openHours?.closedDays ?? []).join(ARRAY_SEP),
    s.description.en,
    s.description.ko,
    (s.tips ?? []).map((t) => t.en).join(ARRAY_SEP),
    (s.tips ?? []).map((t) => t.ko).join(ARRAY_SEP),
    (s.photos ?? []).join(ARRAY_SEP),
    s.postSlug ?? "",
    s.googleMapsUrl ?? "",
    s.costEstimate?.amount ?? "",
    s.costEstimate?.currency ?? "",
    (s.tags ?? []).join(ARRAY_SEP),
    s.chain ?? "",
    s.fullDay ? "true" : "",
    s.bookingLinks?.klook ?? "",
    s.bookingLinks?.agoda ?? "",
    s.bookingLinks?.mrt ?? "",
    s.bookingLinks?.direct ?? "",
  ];
}

export type RowParseResult = {
  spot?: Spot;
  errors: string[];
  warnings: string[];
};

const VALID_CATEGORIES = new Set([
  "sight",
  "food",
  "cafe",
  "shopping",
  "experience",
  "park",
  "nightlife",
]);
const VALID_MEAL_SLOTS = new Set(["breakfast", "lunch", "dinner", "snack"]);
const VALID_STYLES = new Set([
  "relax",
  "efficient",
  "activity",
  "hotel",
  "food",
  "photo",
  "budget",
  "culture",
  "nature",
  "nightlife",
  "shopping",
  "local",
  "popular",
]);
const VALID_TRAVELER_TYPES = new Set(["solo", "parents", "kids", "couple", "friends"]);
const VALID_PRIORITIES = new Set([1, 2, 3, 4]);

export function rowToSpot(
  headers: string[],
  row: string[],
  rowIndex: number,
): RowParseResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  const g = (col: CsvColumn): string => {
    const idx = headers.indexOf(col);
    return idx === -1 ? "" : (row[idx] ?? "").trim();
  };

  const id = g("id");
  const city = g("city");
  const nameEn = g("name_en");
  const nameKo = g("name_ko");
  const category = g("category");
  const descEn = g("description_en");
  const descKo = g("description_ko");

  const where = `row ${rowIndex + 2}`; // +2 for header + 1-based

  if (!id) errors.push(`${where}: missing id`);
  if (!city) errors.push(`${where}: missing city`);
  if (!nameEn) errors.push(`${where}: missing name_en`);
  if (!nameKo) errors.push(`${where}: missing name_ko`);
  if (!descEn) errors.push(`${where}: missing description_en`);
  if (!descKo) errors.push(`${where}: missing description_ko`);
  if (!VALID_CATEGORIES.has(category)) {
    errors.push(`${where}: invalid category "${category}"`);
  }

  const mealSlot = g("mealSlot");
  if (mealSlot && !VALID_MEAL_SLOTS.has(mealSlot)) {
    errors.push(`${where}: invalid mealSlot "${mealSlot}"`);
  }
  if ((category === "food" || category === "cafe") && !mealSlot) {
    warnings.push(`${where}: ${category} spot without mealSlot (${id})`);
  }

  const styles = arr(g("styles"));
  for (const s of styles) {
    if (!VALID_STYLES.has(s)) errors.push(`${where}: invalid style "${s}"`);
  }
  const travelerTypes = arr(g("travelerTypes"));
  for (const t of travelerTypes) {
    if (!VALID_TRAVELER_TYPES.has(t)) errors.push(`${where}: invalid travelerType "${t}"`);
  }
  if (styles.length === 0) errors.push(`${where}: styles empty`);
  if (travelerTypes.length === 0) errors.push(`${where}: travelerTypes empty`);

  const lat = Number(g("lat"));
  const lng = Number(g("lng"));
  if (!Number.isFinite(lat) || lat < -90 || lat > 90) {
    errors.push(`${where}: invalid lat "${g("lat")}"`);
  }
  if (!Number.isFinite(lng) || lng < -180 || lng > 180) {
    errors.push(`${where}: invalid lng "${g("lng")}"`);
  }

  const durMin = Number(g("duration_min"));
  const durTyp = Number(g("duration_typical"));
  const durMax = Number(g("duration_max"));
  for (const [name, v] of [
    ["duration_min", durMin],
    ["duration_typical", durTyp],
    ["duration_max", durMax],
  ] as const) {
    if (!Number.isFinite(v) || v <= 0) errors.push(`${where}: invalid ${name}`);
  }

  const priority = Number(g("priority"));
  if (!VALID_PRIORITIES.has(priority)) {
    errors.push(`${where}: priority must be 1-4, got "${g("priority")}"`);
  }

  const area = g("area");
  const openOpen = g("openHours_open");
  const openClose = g("openHours_close");
  const closedDaysRaw = arr(g("closedDays"));
  const closedDays = closedDaysRaw.map((d) => Number(d));
  for (const d of closedDays) {
    if (!Number.isInteger(d) || d < 0 || d > 6) {
      errors.push(`${where}: closedDays must be 0-6`);
    }
  }

  const tipsEn = arr(g("tips_en"));
  const tipsKo = arr(g("tips_ko"));
  if (tipsEn.length !== tipsKo.length) {
    errors.push(`${where}: tips_en (${tipsEn.length}) / tips_ko (${tipsKo.length}) length mismatch`);
  }
  const tips = tipsEn.length === tipsKo.length
    ? tipsEn.map((en, i) => ({ en, ko: tipsKo[i] }))
    : [];

  const photos = arr(g("photos"));
  const postSlug = g("postSlug");
  const googleMapsUrl = g("googleMapsUrl");

  const costAmountRaw = g("costAmount");
  const costCurrency = g("costCurrency");
  let costEstimate: Spot["costEstimate"];
  if (costAmountRaw || costCurrency) {
    const amt = Number(costAmountRaw);
    if (!Number.isFinite(amt)) errors.push(`${where}: invalid costAmount`);
    if (!costCurrency) errors.push(`${where}: costCurrency required when costAmount set`);
    if (Number.isFinite(amt) && costCurrency) {
      costEstimate = { amount: amt, currency: costCurrency };
    }
  }

  const tags = arr(g("tags"));
  const chain = g("chain");
  const fullDayRaw = g("fullDay").toLowerCase();
  const fullDay = fullDayRaw === "true" || fullDayRaw === "1" || fullDayRaw === "yes";

  const bookingLinks: Spot["bookingLinks"] = {};
  const bk = g("booking_klook");
  const ba = g("booking_agoda");
  const bm = g("booking_mrt");
  const bd = g("booking_direct");
  if (bk) bookingLinks.klook = bk;
  if (ba) bookingLinks.agoda = ba;
  if (bm) bookingLinks.mrt = bm;
  if (bd) bookingLinks.direct = bd;
  const bookingLinksFinal =
    Object.keys(bookingLinks).length > 0 ? bookingLinks : undefined;

  if (errors.length > 0) return { errors, warnings };

  const spot: Spot = {
    id,
    city,
    name: { en: nameEn, ko: nameKo },
    category: category as Spot["category"],
    ...(mealSlot ? { mealSlot: mealSlot as Spot["mealSlot"] } : {}),
    styles: styles as Spot["styles"],
    travelerTypes: travelerTypes as Spot["travelerTypes"],
    location: { lat, lng },
    duration: { min: durMin, typical: durTyp, max: durMax },
    priority: priority as Spot["priority"],
    ...(area ? { area } : {}),
    ...(openOpen && openClose
      ? {
          openHours: {
            open: openOpen,
            close: openClose,
            ...(closedDays.length > 0 ? { closedDays } : {}),
          },
        }
      : {}),
    description: { en: descEn, ko: descKo },
    ...(tips.length > 0 ? { tips } : {}),
    ...(photos.length > 0 ? { photos } : {}),
    ...(postSlug ? { postSlug } : {}),
    ...(googleMapsUrl ? { googleMapsUrl } : {}),
    ...(costEstimate ? { costEstimate } : {}),
    ...(tags.length > 0 ? { tags } : {}),
    ...(chain ? { chain } : {}),
    ...(fullDay ? { fullDay: true } : {}),
    ...(bookingLinksFinal ? { bookingLinks: bookingLinksFinal } : {}),
  };

  return { spot, errors, warnings };
}
