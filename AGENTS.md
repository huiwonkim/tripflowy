<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

---

# TripFlowy — Root Agent Rules

Short, project-wide rules only. Directory-specific rules live in `/<dir>/AGENTS.md`. Content writing rules live in `/content/AGENTS.md`.

## 1. Project Overview

TripFlowy (tripflowy.com) is a **human-curated travel itinerary platform**. Founder: **책킴 (Check Kim)** — Korean travel creator covering Asia since 2007. The product matches destination + duration + style to spots that have been personally walked and tested; business model is curated content + affiliate revenue (Klook primary).

**Not an AI planner.** Never position the product as "AI travel planner," "AI가 짜주는 일정," etc. The engine may be described as *smart matching* / *preference-matching*, but the headline promise is field-tested human curation. See `/content/brand.ts` → `BRAND.forbiddenPhrases`.

## 2. Tech Stack

- **Framework**: Next.js 16.2.2 (App Router, breaking changes vs. training data — read `node_modules/next/dist/docs/` if unsure)
- **Language**: TypeScript 5.9 strict, React 19.2
- **i18n**: `next-intl` with `/app/[locale]/...`, locales `en` (default) and `ko`
- **Styling**: Tailwind v4 (PostCSS plugin), `.tf-serif` class for English serif headings only
- **Data/storage**: `@vercel/kv` for shared state; static spot data lives in `/data/spots/<city>.ts`
- **Maps**: `@vis.gl/react-google-maps` (awareness: each `<Map>` = 1 billable Load — avoid Directions API)
- **Path alias**: `@/*` → repo root

## 3. Single Source of Truth — `/content/brand.ts`

All brand-facing strings (name, taglines, meta descriptions, hero copy, founder bio, trust phrases, affiliate disclosure) are exported constants from `/content/brand.ts`. **Never hardcode these values** in components, JSON-LD, metadata, or markdown frontmatter — always `import { BRAND, FOUNDER, META_DESCRIPTIONS, HERO, COMPARISON_HEADINGS, TRUST_PHRASES, AFFILIATE_DISCLOSURE } from '@/content/brand'`.

If a string feels brand-shaped but is missing from `brand.ts`, add it to `brand.ts` first, then import.

## 4. Entity Consistency (LLM entity resolution)

- Korean primary name: **책킴**
- English primary name: **Check Kim**
- Legal name (B2B / contracts only): **Huiwon Kim**
- `Person.alternateName` is **always an array**: `["Check Kim", "책킴", "travelkkkim", "Huiwon Kim", "Chaekkim"]` — import `FOUNDER.alternateName`, never inline as a string.
- `jobTitle`: `TripFlowy Founder · 여행 크리에이터` (ko) / `Founder, TripFlowy · Travel Creator` (en)
- Korean author box must show both names: `책킴 (Check Kim)`.
- `Patrick Kim` is obsolete — if it appears anywhere, delete it.

## 5. Positioning & Copy Rules

- **Respect bloggers/YouTubers.** Check Kim is a Naver blogger and collaborates with creators. Never use "blog 그만 보세요" / "Stop scrolling blogs" or anything hostile to other creators. TripFlowy *organizes* blog + YouTube + guidebook info into one route — we're a curator, not a replacement.
- **Korean original → English adaptation (not translation).** User writes Korean; EN is adapted so an English-speaking traveler reads it as natively written. Replace Korea-specific context ("강남역에서 1시간" → "accessible from central Tokyo"), idioms ("가성비" → "bang for your buck" / "budget-friendly", never literal "cost-effective").
- **Korean brand shorthand**: in Korean body copy use **트플**, not 트립플로위. English stays **TripFlowy**.
- **Don't plant brand mentions into first-person prose** for GEO. Byline + bio + schema already carry the brand.
- **Korean stays sans, not serif.** `.tf-serif` is applied only when `locale === "en"`.

## 6. MVP Scope

V1 focuses on: matching engine + content + affiliate links. **Collaboration features (swipe-to-vote, group planning, etc.) are deferred to V1.1** (~3 months out, gated on V1 traction criteria in the master plan).

Bug fixes should be bug fixes — don't refactor surrounding code, don't introduce abstractions for hypothetical future needs.

## 7. Key Workflows

- **Blog guides**: user provides Korean guide → produce BOTH ko + en per `/content/AGENTS.md` writing rules. Ask before writing if prices/hours/how-to are missing.
- **Spots**: user edits Google Sheets → Claude translates → `scripts/spots-from-csv.ts` regenerates `data/spots/<city>.ts`. Feature flag `NEXT_PUBLIC_USE_SPOT_ENGINE=true` in `.env.local` is required for new spots to appear. **Tokyo-only in V1** — `/data/spots/index.ts` aggregates tokyo alone; adding a city requires the full CSV pipeline + 책킴 field-verification + `lastVerified` per spot. See `/content/AGENTS.md` → "Spot Data Curation Policy".
- **Batches**: group related changes into numbered batches, commit per batch at the user's checkpoint ("커밋하고 다음으로 가자").
- **Deploy**: build first (`npm run build`), do **not** push until the user says "배포해".

## 8. Context Economy

Read the `AGENTS.md` of the directory you're touching — don't re-read this root file every session. Claude's memory at `~/.claude/projects/-Users-macbook-Desktop-Tripflowy/memory/MEMORY.md` auto-loads and carries cross-session context; don't duplicate memory content here.

## 9. Sprint Tracking

Active sprint state lives in `/.progress.md`. Full sprint structure and copy-paste prompts live in `/docs/tripflowy-master-plan.md`. Update `.progress.md` as tasks complete.

## 10. CLAUDE.md Compatibility

Root `CLAUDE.md` is a **symlink** to this file. AGENTS.md is the multi-agent standard (Cursor, Aider, Codex, …); the symlink keeps Claude Code compatible without duplicating content. Don't edit CLAUDE.md directly — edit AGENTS.md.
