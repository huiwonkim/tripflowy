# /app — Next.js App Router Rules

Rules that apply **only to files under `/app`**. Root rules in `/AGENTS.md` still apply.

## Routing

- App Router only (Next.js 16.2). No `pages/` directory.
- Locale-scoped routes live under `/app/[locale]/...` with `next-intl`. Default locale is `en` (no prefix); Korean uses `/ko/...`.
- Dynamic itinerary results (`/planner?destinations=...`) must **not** appear in the sitemap — URL combinations are unbounded.
- `/courses/[id]` (legacy, ID-based day-course catalog in `data/day-courses.ts`) is **noindex/nofollow** and excluded from the sitemap — treat this catalog as proprietary, placeholder-quality content until Sprint 7 replaces it.
- **New** `/courses/[city]/[slug]` pages (Sprint 7 day trips like `/courses/tokyo/kawagoe`) are the indexable route shape: `robots: { index: true, follow: true }`, self-referential absolute canonical, included in `app/sitemap.ts`, bidirectional hreflang + `x-default`, Article + TravelGuide dual JSON-LD, `visitedAt` + `lastVerified` required, only cover places `FOUNDER` personally visited.
- Neither route shape appears in header/footer navigation.

## Metadata & i18n

- Every page that renders bilingual content must emit `hreflang` **bidirectionally** plus `x-default`:
  - `en` → canonical `https://www.tripflowy.com/<path>`
  - `ko` → `https://www.tripflowy.com/ko/<path>`
  - `x-default` → English URL
- `generateMetadata` must pull `title` / `description` from `/content/brand.ts` constants (`META_DESCRIPTIONS`, `HERO`) — no hardcoded strings.
- Canonical URLs always point at self (no cross-locale canonical).

## JSON-LD Standard

- Every content page emits JSON-LD via a `<script type="application/ld+json">` in the page component.
- Guide/post pages use the **dual-type** pattern: `"@type": ["Article", "TravelGuide"]`. Don't pick one — both.
- Home emits `WebSite` (with `SearchAction` if applicable); day-trip hubs emit `CollectionPage`.
- `description` fields come from `META_DESCRIPTIONS.*` — never inline copy here.

## Person Schema (author)

- **Always import `FOUNDER` from `/content/brand.ts`.** Never inline name, bio, jobTitle, or profile URLs.
- `alternateName` must be an **array**: `FOUNDER.alternateName` — not a single string, even in Korean-locale pages.
- `jobTitle` uses `FOUNDER.jobTitleKo` / `FOUNDER.jobTitleEn`. Korean pages show `TripFlowy Founder · 여행 크리에이터` (keep "Founder" in English inside the Korean string).
- `sameAs` must include `FOUNDER.profiles.instagram` at minimum. Other profile URLs may carry `[TODO]` placeholders — filter those out before emitting the array (don't emit `[TODO]` into production JSON-LD).
- `description` uses `FOUNDER.bioKo` / `FOUNDER.bioEn`.
- Korean author-box UI: show both names as `책킴 (Check Kim)` using `${FOUNDER.nameKo} (${FOUNDER.nameEn})`.
- `Patrick Kim` must not appear anywhere. If found, delete.

## Component Conventions

- `.tf-serif` is applied to English headings **only**. Gate with `locale === "en"` — Korean headings use the default sans (Geist).
- Map rendering: each mounted `<Map>` from `@vis.gl/react-google-maps` counts as 1 billable Load — prefer offline helpers (static distance/time tables) when possible. Do **not** reintroduce the Directions API.
- `<PostCTA>` auto-inserts `/ko/` into Klook affiliate URLs for Korean locale — store Klook URLs **without** `/ko/` in data.

## Routes Worth Remembering

- `/llms.txt` and `/llms-full.txt` are LLM-index routes under `/app/llms.txt/route.ts` (and `/app/llms-full.txt/route.ts`). They must return `200 OK` for `ClaudeBot` / `GPTBot` / `PerplexityBot` and reference `BRAND` + `FOUNDER` from `brand.ts`.
- Affiliate disclosure in footer: import `AFFILIATE_DISCLOSURE` from `brand.ts`; show locale-appropriate variant.
