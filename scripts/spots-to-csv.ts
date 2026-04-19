/**
 * Export spots of a given city to a CSV file suitable for Google Sheets editing.
 *
 * Usage:  npx tsx scripts/spots-to-csv.ts tokyo
 * Output: data/sheets/<city>-spots.csv
 *
 * Round-trip partner: scripts/spots-from-csv.ts reads the CSV back into
 * data/spots/<city>.ts.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { CSV_COLUMNS, spotToRow, encodeCsvRow } from "./spots-csv-shared";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, "..");

const city = process.argv[2];
if (!city) {
  console.error("usage: npx tsx scripts/spots-to-csv.ts <city>");
  process.exit(1);
}

const spotsFile = path.join(ROOT, "data", "spots", `${city}.ts`);
if (!fs.existsSync(spotsFile)) {
  console.error(`data/spots/${city}.ts not found`);
  process.exit(1);
}

async function main() {
  const mod = await import(spotsFile);
  const exportName = `${city.replace(/-/g, "_")}Spots`;
  const spots = mod[exportName];
  if (!Array.isArray(spots)) {
    console.error(`expected ${exportName} array in ${spotsFile}`);
    process.exit(1);
  }

  const outDir = path.join(ROOT, "data", "sheets");
  fs.mkdirSync(outDir, { recursive: true });
  const outPath = path.join(outDir, `${city}-spots.csv`);

  const rows: string[] = [];
  rows.push(encodeCsvRow(CSV_COLUMNS));
  for (const s of spots) {
    rows.push(encodeCsvRow(spotToRow(s)));
  }

  // UTF-8 BOM so Google Sheets / Excel auto-detect encoding for Korean text.
  fs.writeFileSync(outPath, "\uFEFF" + rows.join("\n") + "\n", "utf8");
  console.log(`wrote ${spots.length} rows → ${path.relative(ROOT, outPath)}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
