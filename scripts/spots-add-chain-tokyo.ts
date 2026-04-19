/**
 * One-off: populate the new `chain` column in tokyo-spots.csv based on
 * name matching. Chains that appear in multiple areas (Don Quijote,
 * Ichiran, Starbucks, Uniqlo, teamLab locations that share a brand but
 * not a venue) get a shared chain key so the engine includes one per
 * itinerary.
 *
 * Safe to run multiple times — existing chain values are preserved.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { CSV_COLUMNS, encodeCsvRow, parseCsv } from "./spots-csv-shared";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, "..");
const csvPath = path.join(ROOT, "data", "sheets", "tokyo-spots.csv");

/**
 * Name/id substring → chain key.
 * Don't list venues that are one-of-a-kind (teamLab Planets vs Borderless
 * are distinct experiences, so teamLab is NOT a chain here).
 */
const CHAIN_RULES: Array<{ match: RegExp; chain: string }> = [
  { match: /돈키호테|don\s*quijote|donkihote/i, chain: "donki" },
  { match: /이치란|ichiran/i, chain: "ichiran" },
  { match: /스타벅스|starbucks/i, chain: "starbucks" },
  { match: /유니클로|uniqlo/i, chain: "uniqlo" },
  { match: /딘타이펑|din\s*tai\s*fung/i, chain: "dintaifung" },
  { match: /기노쿠니야|kinokuniya/i, chain: "kinokuniya" },
  { match: /준쿠도|junkudo/i, chain: "junkudo" },
  { match: /빅카메라|bic\s*camera|bigcamera/i, chain: "bic-camera" },
  { match: /마츠야|matsuya/i, chain: "matsuya" },
  { match: /텐동\s*텐야|tendon\s*tenya/i, chain: "tendon-tenya" },
  { match: /나다이\s*우나토토|nadai\s*unatoto/i, chain: "unatoto" },
];

const raw = fs.readFileSync(csvPath, "utf8");
const rows = parseCsv(raw);
const headers = rows[0];

// Ensure the chain column exists — prepend it from CSV_COLUMNS order if missing.
if (!headers.includes("chain")) {
  // Find the canonical position of chain in CSV_COLUMNS and insert accordingly.
  const chainPos = CSV_COLUMNS.indexOf("chain");
  const before = CSV_COLUMNS[chainPos - 1];
  const insertAt = headers.indexOf(before) + 1;
  headers.splice(insertAt, 0, "chain");
  for (let i = 1; i < rows.length; i++) {
    rows[i].splice(insertAt, 0, "");
  }
}

const iId = headers.indexOf("id");
const iNameKo = headers.indexOf("name_ko");
const iNameEn = headers.indexOf("name_en");
const iChain = headers.indexOf("chain");

let filled = 0;
const chainCounts = new Map<string, number>();
for (let i = 1; i < rows.length; i++) {
  const row = rows[i];
  if (row.every((c) => c.trim() === "")) continue;
  if ((row[iChain] ?? "").trim() !== "") continue;

  const id = row[iId] ?? "";
  const nameKo = row[iNameKo] ?? "";
  const nameEn = row[iNameEn] ?? "";
  const haystack = `${id} ${nameKo} ${nameEn}`;

  for (const rule of CHAIN_RULES) {
    if (rule.match.test(haystack)) {
      row[iChain] = rule.chain;
      chainCounts.set(rule.chain, (chainCounts.get(rule.chain) ?? 0) + 1);
      filled++;
      break;
    }
  }
}

const out = rows.map((r) => encodeCsvRow(r)).join("\n");
fs.writeFileSync(csvPath, "\uFEFF" + out + "\n", "utf8");

console.log(`filled ${filled} chain values`);
for (const [chain, count] of chainCounts) {
  console.log(`  ${chain}: ${count} spot(s)`);
}
console.log(`wrote ${path.relative(ROOT, csvPath)}`);
