# /scripts — Data & Pipeline Scripts

Rules for files under `/scripts`. Root rules in `/AGENTS.md` still apply. Scripts here are one-shot / ops utilities (CSV round-trips, translations, image processing) — not production runtime code.

## Image Processing (sharp)

- Always call `.withMetadata()` after `sharp(...)` — EXIF (camera, lens, GPS, capture date) must survive the pipeline. Stripping EXIF breaks our GEO story: "shot by the author on a specific day at a specific place" is a trust signal.
- Preserve original capture date in metadata; don't overwrite with processing date.
- Work off originals in a staging dir — never re-encode production images in place.
- Sony A7M5 + Lightroom is the author's primary workflow; exports are expected to include JPEG XMP + EXIF intact.

## Spot CSV Pipeline

The content loop is: Google Sheets → CSV → translate → regenerate `data/spots/<city>.ts`.

- `spots-to-csv.ts` exports current TS data back to CSV.
- `spots-from-csv.ts` reads the edited CSV and regenerates `data/spots/<city>.ts`.
- `spots-translate-<city>.ts` calls Claude to produce EN adaptation (not literal translation — idioms and KR-specific context get rewritten; see `/content/AGENTS.md`).
- The runtime **requires `NEXT_PUBLIC_USE_SPOT_ENGINE=true` in `.env.local`** for the new spot data to render. Mention this if a spot appears in data but not on the site.
- Shared helpers live in `spots-csv-shared.ts` — reuse them rather than re-parsing CSV columns from scratch.

## Naver → TripFlowy Conversion

When adapting Naver blog posts into TripFlowy guides:

- Replace `트립플로위` → `트플` in body copy (brand shorthand rule).
- Korea-specific context gets replaced for EN adaptation: `강남역에서 1시간` → `accessible from central Tokyo`.
- Currency: strip KRW from EN output — use USD + local currency only.
- Preserve `visitedAt` from original post date where verifiable; set `lastVerified` to the conversion date.
- Don't auto-generate `focusKeyphrase` — leave blank for the user to fill.

## Claude API Calls

- API keys come from `process.env.ANTHROPIC_API_KEY` — never hardcoded, never committed.
- If a script needs a new env var, document it at the top of the file and in this `AGENTS.md` if it becomes a convention.
- Default to the model specified in the script's prompt context; don't silently downgrade models.
- Scripts that make Claude calls should be idempotent — checkpoint partial results so a re-run doesn't re-pay for completed rows.

## Execution

- Run scripts with `npx tsx scripts/<name>.ts` (tsconfig already has `paths: { "@/*": ["./*"] }`).
- Scripts that mutate `data/` should dump a diff summary at the end (rows added / updated / removed) so the user can eyeball before committing.
