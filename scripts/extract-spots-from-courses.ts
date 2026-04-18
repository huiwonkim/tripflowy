/**
 * One-off migration: extract Spot objects from existing DayCourse.activities.
 *
 * Output: data/spots/<city>.ts + data/spots/index.ts
 *
 * Run: npx tsx scripts/extract-spots-from-courses.ts
 *
 * This is seed data only — expect to manually revise priority/area/openHours
 * and eventually replace with spreadsheet-sourced content.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { dayCourses } from "../data/day-courses";
import type { DayCourse, DayActivity, LocaleString } from "../types";
import type { Spot, SpotCategory, MealSlot } from "../types/spot";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, "..");
const OUT_DIR = path.join(ROOT, "data", "spots");

// ────────────────────────────────────────────────────────
// Mapping helpers
// ────────────────────────────────────────────────────────

/** Activity types we skip when extracting spots (handled elsewhere or not useful). */
const SKIP_TYPES = new Set(["transport", "accommodation", "free"]);

/** Map DayActivity.type → Spot.category. */
function categoryFor(type: DayActivity["type"]): SpotCategory | null {
  switch (type) {
    case "sightseeing":
      return "sight";
    case "dining":
      return "food";
    case "tour":
      return "experience";
    case "shopping":
      return "shopping";
    case "beach":
      return "sight";
    default:
      return null;
  }
}

/** Guess meal slot from the activity's start time ("HH:MM"). */
function guessMealSlot(time: string): MealSlot | undefined {
  const [hStr, mStr] = time.split(":");
  const minutes = Number(hStr) * 60 + Number(mStr || "0");
  if (minutes < 10 * 60 + 30) return "breakfast";
  if (minutes < 15 * 60) return "lunch";
  if (minutes < 17 * 60 + 30) return "snack";
  return "dinner";
}

/** slugify ASCII-ish titles for stable ids. Falls back to hash if empty. */
function slugify(text: string): string {
  const slug = text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 60);
  if (slug) return slug;
  // Fallback: simple string hash
  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    hash = (hash << 5) - hash + text.charCodeAt(i);
    hash |= 0;
  }
  return `spot-${Math.abs(hash)}`;
}

// ────────────────────────────────────────────────────────
// Extraction
// ────────────────────────────────────────────────────────

type SpotBucket = Map<string, Spot>; // key = id within a city

type TemplateRecord = {
  id: string;
  city: string;
  title: LocaleString;
  summary: LocaleString;
  styles: string[];
  travelerTypes: string[];
  spotIds: string[];
  coverGradient: string;
  whyThisCourse?: LocaleString[];
  courseType?: LocaleString[];
};

const byCity = new Map<string, SpotBucket>();
const templates: TemplateRecord[] = [];
let totalActivities = 0;
let extracted = 0;
let skipped = 0;
let deduped = 0;
let skippedNoLocation = 0;

for (const course of dayCourses as DayCourse[]) {
  const bucket = byCity.get(course.city) ?? new Map();
  byCity.set(course.city, bucket);
  const courseSpotIds: string[] = [];

  for (const activity of course.activities) {
    totalActivities++;

    if (SKIP_TYPES.has(activity.type)) {
      skipped++;
      continue;
    }

    const category = categoryFor(activity.type);
    if (!category) {
      skipped++;
      continue;
    }

    if (!activity.location) {
      // Location is required — log and skip
      skippedNoLocation++;
      continue;
    }

    const baseName = activity.title.en;
    const id = `${course.city}-${slugify(baseName)}`;
    // Track this spot in the course's ordered spot id list (for template output)
    if (!courseSpotIds.includes(id)) courseSpotIds.push(id);

    if (bucket.has(id)) {
      // Same-name duplicate across courses — keep first, merge styles/travelerTypes
      const existing = bucket.get(id)!;
      for (const s of course.styles) if (!existing.styles.includes(s)) existing.styles.push(s);
      for (const t of course.travelerTypes) if (!existing.travelerTypes.includes(t)) existing.travelerTypes.push(t);
      deduped++;
      continue;
    }

    const spot: Spot = {
      id,
      city: course.city,
      name: activity.title,
      category,
      ...(category === "food" || category === "cafe"
        ? { mealSlot: guessMealSlot(activity.time) }
        : {}),
      styles: [...course.styles],
      travelerTypes: [...course.travelerTypes],
      location: activity.location,
      duration: activity.duration ?? 60,
      priority: 2,
      description: activity.description,
      ...(activity.tips && activity.tips.length > 0 ? { tips: activity.tips } : {}),
      ...(activity.photo ? { photos: [activity.photo] } : {}),
      ...(activity.postSlug ? { postSlug: activity.postSlug } : {}),
      ...(activity.bookingLinks ? { bookingLinks: activity.bookingLinks } : {}),
    };

    bucket.set(id, spot);
    extracted++;
  }

  // Emit a template record only when the course has at least one extractable spot
  if (courseSpotIds.length > 0) {
    templates.push({
      id: course.id,
      city: course.city,
      title: course.title,
      summary: course.summary,
      styles: [...course.styles],
      travelerTypes: [...course.travelerTypes],
      spotIds: courseSpotIds,
      coverGradient: course.coverGradient,
      ...(course.whyThisCourse ? { whyThisCourse: course.whyThisCourse } : {}),
      ...(course.courseType ? { courseType: course.courseType } : {}),
    });
  }
}

// ────────────────────────────────────────────────────────
// Emit files
// ────────────────────────────────────────────────────────

if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

function formatLocaleString(ls: LocaleString): string {
  return `{ en: ${JSON.stringify(ls.en)}, ko: ${JSON.stringify(ls.ko)} }`;
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
  lines.push(`    location: { lat: ${spot.location.lat}, lng: ${spot.location.lng} },`);
  lines.push(`    duration: ${spot.duration},`);
  lines.push(`    priority: ${spot.priority},`);
  lines.push(`    description: ${formatLocaleString(spot.description)},`);
  if (spot.tips && spot.tips.length > 0) {
    const tipsStr = spot.tips.map(formatLocaleString).join(", ");
    lines.push(`    tips: [${tipsStr}],`);
  }
  if (spot.photos && spot.photos.length > 0) {
    lines.push(`    photos: ${JSON.stringify(spot.photos)},`);
  }
  if (spot.postSlug) lines.push(`    postSlug: ${JSON.stringify(spot.postSlug)},`);
  if (spot.bookingLinks) {
    lines.push(`    bookingLinks: ${JSON.stringify(spot.bookingLinks)},`);
  }
  lines.push(`  }`);
  return lines.join("\n");
}

const cityExports: string[] = [];
const cities = [...byCity.keys()].sort();

for (const city of cities) {
  const bucket = byCity.get(city)!;
  const spots = [...bucket.values()].sort((a, b) => a.id.localeCompare(b.id));
  const exportName = `${city.replace(/-/g, "_")}Spots`;
  const body = [
    `// AUTO-GENERATED by scripts/extract-spots-from-courses.ts`,
    `// Seed data extracted from data/day-courses.ts — revise manually as needed.`,
    `// Count: ${spots.length}`,
    ``,
    `import type { Spot } from "@/types/spot";`,
    ``,
    `export const ${exportName}: Spot[] = [`,
    spots.map(formatSpot).join(",\n"),
    `];`,
    ``,
  ].join("\n");
  const filepath = path.join(OUT_DIR, `${city}.ts`);
  fs.writeFileSync(filepath, body);
  cityExports.push({ city, exportName } as never);
  console.log(`  wrote ${spots.length} spots → ${path.relative(ROOT, filepath)}`);
}

// index.ts — aggregates active-city spot arrays only.
// The other 23 city files are generated on disk but NOT imported into the
// client bundle. Sync this list with `data/destinations.ts` when new countries
// go live.
const ACTIVE_CITIES = ["tokyo", "osaka", "kyoto", "fukuoka"];
const activeCities = cities.filter((c) => ACTIVE_CITIES.includes(c));
const indexBody = [
  `// Aggregator for active-city spots.`,
  `//`,
  `// MVP: only Japan cities (tokyo/osaka/kyoto/fukuoka) are imported so their spots`,
  `// ship in the client bundle. The other 23 city files are kept on disk for when`,
  `// we activate additional countries (see destinations.ts / comingSoonCountries) —`,
  `// add them back to the import list and \`allSpots\` when that happens.`,
  `//`,
  `// \`data/spots/<city>.ts\` is generated by scripts/extract-spots-from-courses.ts.`,
  ``,
  `import type { Spot } from "@/types/spot";`,
  ``,
  ...activeCities.map(
    (c) => `import { ${c.replace(/-/g, "_")}Spots } from "./${c}";`,
  ),
  ``,
  `export const allSpots: Spot[] = [`,
  ...activeCities.map((c) => `  ...${c.replace(/-/g, "_")}Spots,`),
  `];`,
  ``,
  `export function getSpotsByCity(city: string): Spot[] {`,
  `  return allSpots.filter((s) => s.city === city);`,
  `}`,
  ``,
  `export function getSpotById(id: string): Spot | undefined {`,
  `  return allSpots.find((s) => s.id === id);`,
  `}`,
  ``,
].join("\n");

fs.writeFileSync(path.join(OUT_DIR, "index.ts"), indexBody);
console.log(`  wrote index → ${path.relative(ROOT, path.join(OUT_DIR, "index.ts"))}`);

// ────────────────────────────────────────────────────────
// Templates — course → spotIds mapping (for "recommended courses" UI)
// ────────────────────────────────────────────────────────

function formatTemplate(t: TemplateRecord): string {
  const lines: string[] = [];
  lines.push(`  {`);
  lines.push(`    id: ${JSON.stringify(t.id)},`);
  lines.push(`    city: ${JSON.stringify(t.city)},`);
  lines.push(`    title: ${formatLocaleString(t.title)},`);
  lines.push(`    summary: ${formatLocaleString(t.summary)},`);
  lines.push(`    styles: ${JSON.stringify(t.styles)},`);
  lines.push(`    travelerTypes: ${JSON.stringify(t.travelerTypes)},`);
  lines.push(`    spotIds: ${JSON.stringify(t.spotIds)},`);
  lines.push(`    coverGradient: ${JSON.stringify(t.coverGradient)},`);
  if (t.whyThisCourse) {
    const arr = t.whyThisCourse.map(formatLocaleString).join(", ");
    lines.push(`    whyThisCourse: [${arr}],`);
  }
  if (t.courseType) {
    const arr = t.courseType.map(formatLocaleString).join(", ");
    lines.push(`    courseType: [${arr}],`);
  }
  lines.push(`  }`);
  return lines.join("\n");
}

const templatesBody = [
  `// AUTO-GENERATED by scripts/extract-spots-from-courses.ts`,
  `// DayCourse-based templates recast as spot-id sequences — one click in the`,
  `// planner applies the whole template to the current itinerary.`,
  `// Count: ${templates.length}`,
  ``,
  `import type { DayTemplate } from "@/types/spot";`,
  ``,
  `export const dayTemplates: DayTemplate[] = [`,
  templates.map(formatTemplate).join(",\n"),
  `];`,
  ``,
  `export function getTemplatesByCity(city: string): DayTemplate[] {`,
  `  return dayTemplates.filter((t) => t.city === city);`,
  `}`,
  ``,
  `export function getTemplateById(id: string): DayTemplate | undefined {`,
  `  return dayTemplates.find((t) => t.id === id);`,
  `}`,
  ``,
].join("\n");

const templatesPath = path.join(ROOT, "data", "templates.ts");
fs.writeFileSync(templatesPath, templatesBody);
console.log(`  wrote ${templates.length} templates → ${path.relative(ROOT, templatesPath)}`);

// ────────────────────────────────────────────────────────
// Summary
// ────────────────────────────────────────────────────────

console.log("\nExtraction summary:");
console.log(`  total activities scanned : ${totalActivities}`);
console.log(`  extracted as spots       : ${extracted}`);
console.log(`  skipped (type)           : ${skipped}`);
console.log(`  skipped (no location)    : ${skippedNoLocation}`);
console.log(`  deduped (same name)      : ${deduped}`);
console.log(`  cities                   : ${cities.join(", ")}`);
for (const city of cities) {
  console.log(`    ${city.padEnd(14)}: ${byCity.get(city)!.size}`);
}
