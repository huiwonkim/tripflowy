/**
 * IndexNow submission script.
 *
 * Submits one or more URLs to api.indexnow.org so Bing / Yandex / Seznam
 * re-crawl them quickly. Google does NOT participate in IndexNow — for
 * GSC re-indexing, use the GSC console "Inspect URL → Request indexing"
 * (or the URL Inspection API with OAuth, not implemented here).
 *
 * Usage:
 *   npx tsx scripts/indexnow.ts <url> [<url> ...]
 *   npx tsx scripts/indexnow.ts --file urls.txt
 *
 * URL list file: one URL per line, blank lines and `#` comments ignored.
 *
 * Verification (run once after deploy):
 *   curl https://www.tripflowy.com/<KEY>.txt   # must return the key
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, "..");

const HOST = "www.tripflowy.com";
const KEY = "1d7922dd1fe3488190cae2aa0ea728ff93c67973f10047493a09e06871f00b0a";
const KEY_LOCATION = `https://${HOST}/${KEY}.txt`;
const ENDPOINT = "https://api.indexnow.org/IndexNow";
const MAX_URLS_PER_REQUEST = 10000;

function loadUrlsFromFile(filePath: string): string[] {
  const abs = path.isAbsolute(filePath) ? filePath : path.resolve(ROOT, filePath);
  const content = fs.readFileSync(abs, "utf8");
  return content
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith("#"));
}

function validateUrls(urls: string[]): void {
  for (const u of urls) {
    let parsed: URL;
    try {
      parsed = new URL(u);
    } catch {
      throw new Error(`Invalid URL: ${u}`);
    }
    if (parsed.hostname !== HOST) {
      throw new Error(`URL host must be ${HOST}, got ${parsed.hostname}: ${u}`);
    }
  }
}

async function submit(urls: string[]): Promise<void> {
  if (urls.length > MAX_URLS_PER_REQUEST) {
    throw new Error(`Max ${MAX_URLS_PER_REQUEST} URLs per request, got ${urls.length}`);
  }
  const body = {
    host: HOST,
    key: KEY,
    keyLocation: KEY_LOCATION,
    urlList: urls,
  };
  const res = await fetch(ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const text = await res.text();
  if (res.status === 200 || res.status === 202) {
    console.log(`✓ ${res.status} — submitted ${urls.length} URL(s) to IndexNow.`);
    if (text) console.log(text);
  } else {
    console.error(`✗ ${res.status} — ${text}`);
    process.exit(1);
  }
}

async function main(): Promise<void> {
  const args = process.argv.slice(2);
  if (args.length === 0) {
    console.error(
      "Usage:\n  npx tsx scripts/indexnow.ts <url> [<url> ...]\n  npx tsx scripts/indexnow.ts --file urls.txt"
    );
    process.exit(1);
  }
  let urls: string[];
  if (args[0] === "--file") {
    if (!args[1]) {
      console.error("--file requires a path");
      process.exit(1);
    }
    urls = loadUrlsFromFile(args[1]);
  } else {
    urls = args;
  }
  if (urls.length === 0) {
    console.error("No URLs to submit.");
    process.exit(1);
  }
  validateUrls(urls);
  console.log(`Submitting ${urls.length} URL(s) to ${ENDPOINT}…`);
  await submit(urls);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
