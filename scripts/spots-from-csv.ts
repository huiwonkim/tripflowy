/**
 * Import spots for a city from a CSV (edited in Google Sheets) back into
 * data/spots/<city>.ts. Validates enum values, required fields, and uniqueness.
 *
 * Usage:  npx tsx scripts/spots-from-csv.ts tokyo
 * Input:  data/sheets/<city>-spots.csv
 * Output: data/spots/<city>.ts (overwritten)
 *
 * Bonus: rows missing lat/lng but having a googleMapsUrl are auto-resolved
 * (including maps.app.goo.gl shortened URLs) and the extracted coords are
 * written back to the CSV so the next run is instant.
 *
 * Exits non-zero if any row has a validation error. Warnings are printed but
 * do not block the write.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import type { Spot } from "../types/spot";
import type { LocaleString } from "../types";
import {
  CSV_COLUMNS,
  encodeCsvRow,
  extractLatLng,
  parseCsv,
  rowToSpot,
} from "./spots-csv-shared";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, "..");

function formatLocaleString(s: LocaleString): string {
  return `{ en: ${JSON.stringify(s.en)}, ko: ${JSON.stringify(s.ko)} }`;
}

function formatSpot(spot: Spot): string {
  const lines: string[] = [];
  lines.push(`  {`);
  lines.push(`    id: ${JSON.stringify(spot.id)},`);
  lines.push(`    city: ${JSON.stringify(spot.city)},`);
  lines.push(`    name: ${formatLocaleString(spot.name)},`);
  lines.push(`    category: ${JSON.stringify(spot.category)},`);
  if (spot.mealSlot) lines.push(`    mealSlot: ${JSON.stringify(spot.mealSlot)},`);
  lines.push(`    styles: ${JSON.stringify(spot.styles)},`);
  lines.push(`    travelerTypes: ${JSON.stringify(spot.travelerTypes)},`);
  lines.push(
    `    location: { lat: ${spot.location.lat}, lng: ${spot.location.lng} },`,
  );
  lines.push(
    `    duration: { min: ${spot.duration.min}, typical: ${spot.duration.typical}, max: ${spot.duration.max} },`,
  );
  lines.push(`    priority: ${spot.priority},`);
  if (spot.area) lines.push(`    area: ${JSON.stringify(spot.area)},`);
  if (spot.openHours) {
    const oh = spot.openHours;
    const parts = [
      `open: ${JSON.stringify(oh.open)}`,
      `close: ${JSON.stringify(oh.close)}`,
    ];
    if (oh.closedDays && oh.closedDays.length > 0) {
      parts.push(`closedDays: ${JSON.stringify(oh.closedDays)}`);
    }
    lines.push(`    openHours: { ${parts.join(", ")} },`);
  }
  lines.push(`    description: ${formatLocaleString(spot.description)},`);
  if (spot.tips && spot.tips.length > 0) {
    const tipsStr = spot.tips.map(formatLocaleString).join(", ");
    lines.push(`    tips: [${tipsStr}],`);
  }
  if (spot.photos && spot.photos.length > 0) {
    lines.push(`    photos: ${JSON.stringify(spot.photos)},`);
  }
  if (spot.postSlug) lines.push(`    postSlug: ${JSON.stringify(spot.postSlug)},`);
  if (spot.googleMapsUrl) {
    lines.push(`    googleMapsUrl: ${JSON.stringify(spot.googleMapsUrl)},`);
  }
  if (spot.costEstimate) {
    lines.push(
      `    costEstimate: { amount: ${spot.costEstimate.amount}, currency: ${JSON.stringify(spot.costEstimate.currency)} },`,
    );
  }
  if (spot.tags && spot.tags.length > 0) {
    lines.push(`    tags: ${JSON.stringify(spot.tags)},`);
  }
  if (spot.chain) {
    lines.push(`    chain: ${JSON.stringify(spot.chain)},`);
  }
  if (spot.fullDay) {
    lines.push(`    fullDay: true,`);
  }
  if (spot.bookingLinks) {
    lines.push(`    bookingLinks: ${JSON.stringify(spot.bookingLinks)},`);
  }
  if (spot.lastVerified) {
    lines.push(`    lastVerified: ${JSON.stringify(spot.lastVerified)},`);
  }
  lines.push(`  }`);
  return lines.join("\n");
}

async function main() {
  const city = process.argv[2];
  if (!city) {
    console.error("usage: npx tsx scripts/spots-from-csv.ts <city>");
    process.exit(1);
  }

  const csvPath = path.join(ROOT, "data", "sheets", `${city}-spots.csv`);
  if (!fs.existsSync(csvPath)) {
    console.error(`input not found: ${path.relative(ROOT, csvPath)}`);
    process.exit(1);
  }

  const raw = fs.readFileSync(csvPath, "utf8");
  const rows = parseCsv(raw);
  if (rows.length < 2) {
    console.error("CSV has no data rows");
    process.exit(1);
  }

  const headers = rows[0];
  for (const col of CSV_COLUMNS) {
    if (!headers.includes(col)) {
      console.error(`CSV missing required column: ${col}`);
      process.exit(1);
    }
  }

  // Pre-pass: backfill lat/lng from googleMapsUrl where possible.
  const latIdx = headers.indexOf("lat");
  const lngIdx = headers.indexOf("lng");
  const urlIdx = headers.indexOf("googleMapsUrl");
  const idIdx = headers.indexOf("id");

  let csvDirty = false;
  const extractionFailures: Array<{ row: number; id: string; url: string }> = [];

  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    if (row.every((c) => c.trim() === "")) continue;
    const hasLat = (row[latIdx] ?? "").trim() !== "";
    const hasLng = (row[lngIdx] ?? "").trim() !== "";
    if (hasLat && hasLng) continue;

    const url = (row[urlIdx] ?? "").trim();
    if (!url) continue;

    const coords = await extractLatLng(url);
    const spotId = (row[idIdx] ?? "").trim();
    if (coords) {
      row[latIdx] = String(coords.lat);
      row[lngIdx] = String(coords.lng);
      csvDirty = true;
      console.log(`  extracted ${coords.lat}, ${coords.lng} ← ${spotId}`);
    } else {
      extractionFailures.push({ row: i + 1, id: spotId, url });
    }
  }

  if (csvDirty) {
    const out = rows.map((r) => encodeCsvRow(r)).join("\n");
    fs.writeFileSync(csvPath, "\uFEFF" + out + "\n", "utf8");
    console.log(`  updated CSV with extracted lat/lng\n`);
  }

  if (extractionFailures.length > 0) {
    console.warn("Could not extract lat/lng from googleMapsUrl:");
    for (const f of extractionFailures) {
      console.warn(`  row ${f.row} (${f.id || "?"}): ${f.url}`);
    }
    console.warn(
      "  → open each in a browser, copy the URL with @lat,lng, and retry.\n",
    );
  }

  // Main pass: validate + convert.
  const allErrors: string[] = [];
  const allWarnings: string[] = [];
  const spots: Spot[] = [];
  const seenIds = new Set<string>();

  for (let i = 1; i < rows.length; i++) {
    if (rows[i].every((c) => c.trim() === "")) continue;

    const { spot, errors, warnings } = rowToSpot(headers, rows[i], i - 1);
    allErrors.push(...errors);
    allWarnings.push(...warnings);
    if (!spot) continue;

    if (seenIds.has(spot.id)) {
      allErrors.push(`row ${i + 1}: duplicate id "${spot.id}"`);
      continue;
    }
    seenIds.add(spot.id);

    if (spot.city !== city) {
      allErrors.push(
        `row ${i + 1}: city "${spot.city}" does not match expected "${city}"`,
      );
      continue;
    }

    spots.push(spot);
  }

  if (allWarnings.length > 0) {
    console.warn("Warnings:");
    for (const w of allWarnings) console.warn("  " + w);
  }

  if (allErrors.length > 0) {
    console.error("Errors:");
    for (const e of allErrors) console.error("  " + e);
    console.error(`\n${allErrors.length} error(s) — aborting.`);
    process.exit(1);
  }

  spots.sort((a, b) => a.id.localeCompare(b.id));

  const exportName = `${city.replace(/-/g, "_")}Spots`;
  const body = [
    `// AUTO-GENERATED by scripts/spots-from-csv.ts`,
    `// Source: data/sheets/${city}-spots.csv — edit the CSV, not this file.`,
    `// Count: ${spots.length}`,
    ``,
    `import type { Spot } from "@/types/spot";`,
    ``,
    `export const ${exportName}: Spot[] = [`,
    spots.map(formatSpot).join(",\n"),
    `];`,
    ``,
  ].join("\n");

  const outPath = path.join(ROOT, "data", "spots", `${city}.ts`);
  fs.writeFileSync(outPath, body);
  console.log(`wrote ${spots.length} spots → ${path.relative(ROOT, outPath)}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
