# /content — Content & Brand Rules

Rules for everything under `/content`, including `brand.ts`, guides, and any future markdown. Root rules in `/AGENTS.md` still apply.

## Source of Truth

- `/content/brand.ts` is the **single source of truth** for brand strings. Do not edit scattered copies — fix the constant and let imports propagate.
- Any brand-shaped string used in the app (taglines, meta descriptions, founder bio, trust phrases, disclosure text) must live here first, then be imported by components / metadata / JSON-LD.

## Person Schema Rules (A.6)

- `Person.alternateName` in **every** JSON-LD emission must be an **array**, never a single string — even on single-locale pages. Always import `FOUNDER.alternateName` from `@/content/brand`, do not hardcode or derive from author-local nickname fields.
- Current canonical set (5 entries): `["Check Kim", "책킴", "travelkkkim", "Huiwon Kim", "Chaekkim"]`. LLMs use this array to unify entity references across Korean and English assets; dropping to a single string breaks entity linking.
- `"Patrick Kim"` is a retired alias — **never** reintroduce it anywhere (schema, bio, byline, author registry). If found, delete.
- `lib/authors.ts` `Author.nickname` is UI-only (byline rendering). Do not emit it as `alternateName` in JSON-LD — JSON-LD always uses `FOUNDER.alternateName`.

## Comparison-Section Copy Rules (A.5)

When writing "vs" comparison sections (e.g. `whyDifferent.aiTitle`, headings, tables):

- **Column headers and headings** must use the **adjectival contrast form** sanctioned by `COMPARISON_HEADINGS` — `"AI-Generated Plans"` / `"AI 생성 일정"`. This describes plan *output*.
- **Banned**: the category-name form used by real product brands — `"AI Travel Planner(s)"` / `"AI 여행 플래너"`. Even when labelling the "bad" column, this phrasing puts TripFlowy in the same taxonomy. See `BRAND.forbiddenPhrases`.
- If a comparison needs new copy, derive from `COMPARISON_HEADINGS` pattern (contrast phrase + locale variant). If a new sanctioned contrast is needed, add it to `COMPARISON_HEADINGS` first, then import.

## Metadata-Description Audit Scope

Forbidden-phrase enforcement covers **every surface** that reaches users or crawlers:

- Page `generateMetadata` `description` → renders as `<meta name="description">` + `og:description` + `twitter:description`.
- `messages/{ko,en}.json` strings that feed into `t()` calls (hero, comparison, howItWorks, etc).
- JSON-LD schemas (`lib/jsonld.ts` + any inlined schema).
- Static text routes (`/llms.txt`, `/llms-full.txt`, `/robots.txt`).

When auditing a new page, grep **all four** layers — swapping only JSON-LD (e.g. A.3/A.4 pattern) leaves the `<meta description>` unfixed. A.5 caught this gap on `app/[locale]/page.tsx`; apply the same audit when adding or editing any page-level copy.

## Markdown Frontmatter Standard (guides / posts)

Every guide must carry this frontmatter block:

```yaml
---
slug: tokyo-disneyland-guide
city: tokyo
title:
  en: "Tokyo Disneyland Guide"
  ko: "도쿄 디즈니랜드 가이드"
excerpt:
  en: "..."
  ko: "..."
author: "Check Kim"          # use FOUNDER.nameEn
authorKo: "책킴"              # use FOUNDER.nameKo
visitedAt: "2025-11-12"       # YYYY-MM-DD of the most recent visit
lastVerified: "2026-04-15"    # YYYY-MM-DD the author last re-checked prices/hours
publishedAt: "2025-12-01"
dateModified: "2026-04-15"    # drives sitemap <lastmod>
categories: [theme-parks]
focusKeyphrase:
  en: "Tokyo Disneyland guide"
  ko: "도쿄 디즈니랜드 가이드"
---
```

- `visitedAt` + `lastVerified` are **required** on guides and spots. LLMs weight recency.
- `focusKeyphrase` is provided by the user (validated search volume) — never AI-generated.

## Extraction Chunk Rule (top of body)

The first 40–80 words of every guide body must be a self-contained answer paragraph — no throat-clearing, no "In this post we'll explore…". State what the place is, where it is, the one most important practical fact. LLMs frequently quote this block.

## Trust Phrases (required)

Every guide must include **at least one** phrase from `TRUST_PHRASES` (ko) or `TRUST_PHRASES` (en) in the body, used naturally:

- ko: `직접 방문`, `현장 검증`, `에디터 검증`, `최종 확인일 [날짜]`, `여러 번 다녀온 후기`
- en: `personally visited`, `field-tested`, `editor verified`, `last verified [date]`, `from multiple visits`

Don't bolt them on — work them into a sentence where the signal is earned.

## Forbidden Phrases (hard-blocked)

Before publishing any guide or component copy, grep against `BRAND.forbiddenPhrases` **plus** the auto-generate family swept in Sprint A.12a:

```bash
# en
grep -nE "AI travel planner|AI-powered planner|GPT-based|auto-generates plans|Auto-Generate|auto-generate|Auto-generated|auto-generated|Stop scrolling blogs" <file>
# ko
grep -nE "AI가 짜주는|AI 자동 추천 플래너|GPT 기반|자동 생성 플래너|자동 일정|자동으로 여행 일정|자동으로 일정|자동 생성|일정 자동|블로그 그만 보세요|유튜브 그만 보세요" <file>
```

If any match → rewrite. The engine may be described as `smart matching` / `스마트 매칭` / `preference-matching` (see `BRAND.allowedEngineDescription`), but the headline never positions the product as AI-first or auto-anything. Use `field-tested` / `현장 검증` / `책킴이 직접 검증한` framing instead.

## Page-Title Source of Truth (PAGE_TITLES, A.12a)

Page-level `<title>` / og:title strings live in `PAGE_TITLES` inside `/content/brand.ts`, not hardcoded in `generateMetadata`. When shipping a new route:

1. Add `{route}Ko` / `{route}En` entries to `PAGE_TITLES` (+ `{route}OgKo` / `{route}OgEn` if og:title differs from `<title>`).
2. Import and use from the route's `layout.tsx` or `page.tsx`.
3. Keep `<title>` entries **bare** — the root layout applies the `"%s | TripFlowy"` template. OG variants keep the brand spelled out inline (crawlers read og:title independently).

Never repeat `| TripFlowy` inside `PAGE_TITLES` values — it compounds to `"… | TripFlowy | TripFlowy"`.

## Spot Data Curation Policy (post Sprint A cleanup)

`data/spots/` contains **only Check Kim-verified cities**. As of 2026-04-24 the aggregator (`data/spots/index.ts`) re-exports Tokyo alone (114 spots). 26 pre-existing placeholder city files from a prior Claude session were deleted because they were not field-verified — the curated-platform positioning requires we never ship unverified spots.

Rules when adding a new city:

- **Source**: CSV at `data/sheets/<city>-spots.csv`. Generate `data/spots/<city>.ts` via `npx tsx scripts/spots-from-csv.ts <city>` — never hand-write the `.ts`.
- **Required per spot**: `lastVerified` (ISO `YYYY-MM-DD`) — planner UI renders the "✓ Check Kim · verified Mon YYYY" / "✓ 책킴 · 정보 확인 YYYY-MM" badge from this field. Missing `lastVerified` → badge silently omitted, which undermines the E-E-A-T signal. The CSV pipeline validates the YYYY-MM-DD format.
- **Verification bar**: 책킴 must have personally walked the spot. Placeholder data, AI-extracted spots from search results, or unverified Naver-scraped entries are **not** allowed in `data/spots/`.
- **Sprint 7 queue**: Osaka · Kyoto · Fukuoka · Bangkok · Da Nang will be rebuilt from Naver source material via `scripts/extract-spots.ts` → CSV authoring → `spots-from-csv.ts`. Don't pre-seed empty files.
- **`lib/public-mode.ts`** `PUBLIC_CITY_IDS` gates which cities surface in production. Keep it in sync with the aggregator.

If you are tempted to re-add a city file quickly "just to unblock something," stop. The curated positioning is the product — placeholder spots are a regression. Ship Tokyo-only until Sprint 7 ships real content per city.

## Writing Style (CLAUDE.md "Blog Guide Writing Rules" applies)

- First-person, knowledgeable-friend tone. No AI-poetry, no fake-deep moments.
- Korean stays sans (`.tf-serif` is English-only).
- Korean body uses brand shorthand **트플** (not 트립플로위). English stays **TripFlowy**.
- Don't plant `TripFlowy` / `트플` into first-person body for GEO. Byline + bio + schema already carry brand.
- English is **adaptation, not translation**. `가성비` → `bang for your buck` or `budget-friendly`. `강남역에서 1시간` → `accessible from central Tokyo`.
- Currency: KR version uses `원(KRW) + 현지 통화`. EN version uses `USD + 현지 통화` — KRW is banned in English copy.

## FAQ & Structure

- 3–5 FAQ entries per guide, answer-first format.
- Key Facts box near top: Location / Hours / Price / How to get there.
- After each major section: one summary sentence (answer first, context second).
- Include `{{cta}}` marker after the booking/price section for `PostCTA` insertion.

## Klook Affiliate URLs

Store **without** `/ko/` (English base). `PostCTA` auto-inserts `/ko/` for Korean locale.
- ✅ `https://www.klook.com/activity/12345-...?aid=118462`
- ❌ `https://www.klook.com/ko/activity/12345-...?aid=118462`
