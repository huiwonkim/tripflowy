/**
 * One-off: fill English-side fields in data/sheets/tokyo-spots.csv.
 *
 * Rules:
 *  - name_en: looked up in NAME_EN map by id (falls back to name_ko if already Latin)
 *  - description_en: filled as "Test" wherever description_ko is "테스트" and en is empty
 *  - tips_en: padded to tips_ko length with "Test" entries when shorter
 *
 * Run: npx tsx scripts/spots-translate-tokyo.ts
 * Intended as a stopgap while content is placeholder — replace with real
 * Korean→English translations once descriptions are written.
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
 * id → English name. Covers the 115 rows in the current Tokyo sheet.
 * Use Latin transliterations for shop names (closer to how Japan brands
 * spell them), full English for landmarks/museums.
 */
const NAME_EN: Record<string, string> = {
  "tokyo-ikebukuro-sunshine-city": "Sunshine City",
  "tokyo-ikebukuro-animate": "Animate Ikebukuro",
  "tokyo-ikebukuro-mutakiya": "Mutekiya Ramen",
  "tokyo-ikebukuro-junku-bookstore": "Junkudo Bookstore",
  "tokyo-ikebukuro-seibu-departmentstore": "Seibu Department Store",
  "tokyo-ikebukuro-ciwicawa-park": "Chiikawa Park",
  "tokyo-ikebukuro-motomura-kyuaksu": "Gyukatsu Motomura Ikebukuro",
  "tokyo-ikebukuro-iroha": "Gyukatsu Iroha",
  "tokyo-ikebukuro-photin": "Pho Thin Tokyo",
  "tokyo-ikebukuro-yakiniku-hormon-hutago": "Osaka Yakiniku Hormone Futago Ikebukuro",
  "tokyo-odaiba-disneyland": "Tokyo Disneyland",
  "tokyo-odaiba-disneysea": "Tokyo DisneySea",
  "tokyo-odaiba-statueofliverty": "Statue of Liberty (Odaiba)",
  "tokyo-odaiba-beach-park": "Odaiba Seaside Park",
  "tokyo-odaiba-gundambase": "Gundam Base Tokyo",
  "tokyo-odaiba-teamlabplanet": "teamLab Planets",
  "tokyo-odaiba-dipgarden-teraace": "Dipgarden Terrace Ariake Garden",
  "tokyo-asakusa-skytree-tower": "Tokyo Skytree",
  "tokyo-asakusa-asahi": "Asahi Group Headquarters",
  "tokyo-asakusa-nakamisetori": "Nakamise-dori",
  "tokyo-asakusa-sensoji": "Senso-ji Temple",
  "tokyo-asakusa-asakusamenchi": "Asakusa Menchi",
  "tokyo-asakusa-richshaw": "Asakusa Rickshaw Ride",
  "tokyo-asakusa-kobebeefwagyu-kanana": "Kobe Beef Wagyu Katana",
  "tokyo-asakusa-okonomiyaki-monzasiraiwa": "Okonomiyaki Monja Shiraiwa",
  "tokyo-asakusa-koyanagi": "Koyanagi",
  "tokyo-asakusa-jenya": "Asakusa Monja Zenya",
  "tokyo-asakusa-monjakato": "Monja Katō",
  "tokyo-asakusa-kyotogatzuku": "Gyukatsu Kyoto Katsugyu Asakusa Orange Street",
  "tokyo-asakusa-asakusa-gyukatsu": "Asakusa Gyukatsu",
  "tokyo-asakusa-nadai-unatoto": "Nadai Unatoto Asakusa",
  "tokyo-asakusa-tonkatsu-toyama": "Tonkatsu Toyama",
  "tokyo-ueno-zoo": "Ueno Zoo",
  "tokyo-ueno-park": "Ueno Park",
  "tokyo-ueno-park-starkbucks": "Starbucks Ueno Park",
  "tokyo-ueno-national-museum": "Tokyo National Museum",
  "tokyo-ueno-science-museum": "National Museum of Nature and Science",
  "tokyo-ueno-western-museum": "National Museum of Western Art",
  "tokyo-ueno-toritsune-sizsendow": "Toritsune Shizendo",
  "tokyo-ueno-ramen-butayama": "Ramen Butayama Ueno",
  "tokyo-ueno-mori-sakura-terrace": "Ueno no Mori Sakura Terrace",
  "tokyo-shinjuku-tokyo-metropolitan": "Tokyo Metropolitan Government Observatory",
  "tokyo-shinjuku-tenkichiya": "Tenkichiya",
  "tokyo-shinjuku-buchiuyama": "Buchiumaya",
  "tokyo-shinjuku-gabukicho": "Kabukicho Tower",
  "tokyo-shinjuku-disneystore": "Disney Flagship Store Tokyo",
  "tokyo-shinjuku-kinokuniya-bookstore": "Kinokuniya Bookstore",
  "tokyo-shinjuku-isetan-department-store": "Isetan Department Store",
  "tokyo-shinjuku-goldenguy": "Shinjuku Golden Gai",
  "tokyo-shinjuku-omoideyokocho": "Omoide Yokocho",
  "tokyo-shinjuku-hananojo-shrine": "Hanazono Shrine",
  "tokyo-shinjuku-donkihote-gabukicho": "Don Quijote Shinjuku Kabukicho",
  "tokyo-shinjuku-donkihote-donangochi": "Don Quijote Shinjuku South Exit",
  "tokyo-shinjuku-kyoen": "Shinjuku Gyoen",
  "tokyo-shinjuku-okonomiyaki-rush": "Okonomiyaki Teppanyaki Rush",
  "tokyo-shinjuku-ichiran-ramen-juohigashi": "Ichiran Shinjuku Chuo East Exit",
  "tokyo-shinjuku-momo-paradise": "Mo-Mo Paradise Shinjuku Meiji-dori",
  "tokyo-shinjuku-acacia": "Shinjuku Acacia",
  "tokyo-shinjuku-food-quwanne": "Miyazaki Food Quwanne",
  "tokyo-shinjuku-ditaipung": "Din Tai Fung Shinjuku Takashimaya",
  "tokyo-shinjuku-hinotori": "Hinotori",
  "tokyo-shinjuku-harrypotter": "Harry Potter Studio Tour Tokyo",
  "tokyo-harajuku-meiji-palace": "Meiji Shrine",
  "tokyo-harajuku-takeshitadori": "Takeshita-dori",
  "tokyo-harajuku-omotesandohills": "Omotesando Hills",
  "tokyo-harajuku-dacci-pasta-labo": "Harajuku Dacci Pasta Labo",
  "tokyo-harajuku-men-chirashi": "Men Chirashi",
  "tokyo-harajuku-cantera": "Cantera Harajuku",
  "tokyo-harajuku-omotesando-ukaitei": "Omotesando Ukai-tei",
  "tokyo-shibuya-shibuyasky": "Shibuya Sky",
  "tokyo-shibuya-hachiko": "Hachiko Statue",
  "tokyo-shibuya-moheji": "Moheji Shibuya Scramble Square",
  "tokyo-shibuya-nonbei-yokocho": "Shibuya Nonbei Yokocho",
  "tokyo-shibuya-scramble-crossing": "Shibuya Scramble Crossing",
  "tokyo-shibuya-streamer-coffee-company": "Streamer Coffee Company Shibuya",
  "tokyo-shibuya-bigcamera": "Bic Camera Shibuya",
  "tokyo-shibuya-donkihote": "Mega Don Quijote Shibuya",
  "tokyo-shibuya-parco": "Shibuya Parco",
  "tokyo-shibuya-uobei": "Uobei Shibuya Dogenzaka",
  "tokyo-shibuya-takibiya": "Takibiya",
  "tokyo-shibuya-jauo": "Zauo Shibuya",
  "tokyo-shibuya-raikyo": "Raikyo Shibuya",
  "tokyo-shibuya-abiento-restaurant": "À Bientôt Shibuya Yakiniku",
  "tokyo-shibuya-ichiran-spainjaka": "Ichiran Shibuya Spain-zaka",
  "tokyo-shibuya-matuya-shibuyacenter": "Matsuya Shibuya Center",
  "tokyo-shibuya-shibuya109": "Shibuya 109",
  "tokyo-shibuya-keika-ramen": "Keika Ramen Shibuya Center-gai",
  "tokyo-shibuya-jikasei-mensho": "Jikasei Mensho",
  "tokyo-shibuya-wagyu-haral-ramen": "Wagyu Halal Ramen Shibuya",
  "tokyo-shibuya-tskimonza": "Tsukishima Monja Okoge Shibuya",
  "tokyo-shibuya-uogashinihonichi": "Sushi Uogashi Nihon-Ichi Shibuya Dogenzaka",
  "tokyo-shibuya-sushimidori": "Sushi no Midori Shibuya",
  "tokyo-shibuya-niigata-katsdong": "Niigata Katsudon Tarekatsu Shibuya",
  "tokyo-shibuya-matze": "Matsue Shibuya Scramble Square",
  "tokyo-roppongi-roppongi-hills": "Roppongi Hills",
  "tokyo-roppongi-morri-museum": "Mori Art Museum",
  "tokyo-roppongi-cityview-skydeck": "Tokyo City View & Sky Deck",
  "tokyo-roppongi-chrudongtan": "Tsurutontan Roppongi",
  "tokyo-roppongi-tszihan": "Tsujihan Tokyo Midtown",
  "tokyo-roppongi-tokyomidtown": "Tokyo Midtown",
  "tokyo-roppongi-donkihote-roppongi": "Don Quijote Roppongi",
  "tokyo-roppongi-teamlab-boderless": "teamLab Borderless",
  "tokyo-roppongi-tokyo-tower": "Tokyo Tower Observatory",
  "tokyo-ginza-waco": "Wako Main Store",
  "tokyo-ginza-ginza-six": "Ginza Six",
  "tokyo-ginza-donkihote-ginza": "Don Quijote Ginza Main",
  "tokyo-ginza-kyoto-ramen-moriginza": "Kyoto Ramen Mori Ginza",
  "tokyo-ginza-uniqlo": "Uniqlo Ginza",
  "tokyo-ginza-tendon-tenya-ginza": "Tendon Tenya Ginza",
  "tokyo-tokyo-station-station": "Tokyo Station",
  "tokyo-tokyo-station-kitte": "KITTE Marunouchi",
  "tokyo-tokyo-station-hichmabushi-nagoya": "Hitsumabushi Nagoya Binchō Marunouchi",
  "tokyo-tokyo-station-gokyo": "Imperial Palace (Kōkyo)",
  "tokyo-tokyo-station-starbuscks-gokyo": "Starbucks Coffee Kōkyo",
  "tokyo-tokyo-station-nihonbashi-michcoshi": "Nihonbashi Mitsukoshi",
};

const raw = fs.readFileSync(csvPath, "utf8");
const rows = parseCsv(raw);
const headers = rows[0];

const iId = headers.indexOf("id");
const iNameEn = headers.indexOf("name_en");
const iNameKo = headers.indexOf("name_ko");
const iDescEn = headers.indexOf("description_en");
const iDescKo = headers.indexOf("description_ko");
const iTipsEn = headers.indexOf("tips_en");
const iTipsKo = headers.indexOf("tips_ko");

const ARR_SEP = "|";
let filled = 0;
let unmatched: string[] = [];
const seen = new Map<string, number[]>();

for (let i = 1; i < rows.length; i++) {
  const row = rows[i];
  if (row.every((c) => c.trim() === "")) continue;

  const id = (row[iId] ?? "").trim();
  if (!id) continue;
  const list = seen.get(id) ?? [];
  list.push(i + 1);
  seen.set(id, list);

  // name_en
  if (!(row[iNameEn] ?? "").trim()) {
    const nameKo = (row[iNameKo] ?? "").trim();
    const mapped = NAME_EN[id];
    // If name_ko is already Latin-only, use it as-is.
    const isLatin = /^[\x00-\x7F\u00C0-\u024F\s]+$/.test(nameKo) && /[A-Za-z]/.test(nameKo);
    if (mapped) {
      row[iNameEn] = mapped;
      filled++;
    } else if (isLatin) {
      row[iNameEn] = nameKo;
      filled++;
    } else {
      unmatched.push(`${id}  (${nameKo})`);
    }
  }

  // description_en — fill "Test" wherever description_ko is placeholder
  const dEn = (row[iDescEn] ?? "").trim();
  const dKo = (row[iDescKo] ?? "").trim();
  if (!dEn && dKo) {
    row[iDescEn] = dKo === "테스트" ? "Test" : "Placeholder description — translate before publishing.";
  }

  // tips — pad tips_en to match tips_ko count
  const tEnArr = (row[iTipsEn] ?? "").split(ARR_SEP).map((s) => s.trim()).filter(Boolean);
  const tKoArr = (row[iTipsKo] ?? "").split(ARR_SEP).map((s) => s.trim()).filter(Boolean);
  if (tKoArr.length > tEnArr.length) {
    const padded = [...tEnArr];
    while (padded.length < tKoArr.length) {
      const koTip = tKoArr[padded.length];
      padded.push(koTip === "테스트" ? "Test" : "Placeholder tip — translate before publishing.");
    }
    row[iTipsEn] = padded.join(ARR_SEP);
  }
}

// Duplicate id report
const dups = [...seen.entries()].filter(([, lines]) => lines.length > 1);
if (dups.length > 0) {
  console.warn("Duplicate ids detected (you'll need to rename one):");
  for (const [id, lines] of dups) {
    console.warn(`  ${id}  rows ${lines.join(", ")}`);
  }
  console.warn("");
}

if (unmatched.length > 0) {
  console.warn(`No translation mapping for ${unmatched.length} id(s):`);
  for (const u of unmatched) console.warn("  " + u);
  console.warn("");
}

// Verify all columns exist (guard against header drift)
for (const col of CSV_COLUMNS) {
  if (!headers.includes(col)) {
    console.error(`CSV missing required column: ${col}`);
    process.exit(1);
  }
}

const out = rows.map((r) => encodeCsvRow(r)).join("\n");
fs.writeFileSync(csvPath, "\uFEFF" + out + "\n", "utf8");
console.log(`filled ${filled} name_en entries; wrote ${path.relative(ROOT, csvPath)}`);
