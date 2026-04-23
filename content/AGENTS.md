# /content — Content & Brand Rules

Rules for everything under `/content`, including `brand.ts`, guides, and any future markdown. Root rules in `/AGENTS.md` still apply.

## Source of Truth

- `/content/brand.ts` is the **single source of truth** for brand strings. Do not edit scattered copies — fix the constant and let imports propagate.
- Any brand-shaped string used in the app (taglines, meta descriptions, founder bio, trust phrases, disclosure text) must live here first, then be imported by components / metadata / JSON-LD.

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

Before publishing any guide or component copy, grep against `BRAND.forbiddenPhrases`:

```bash
# en
grep -nE "AI travel planner|AI-powered planner|GPT-based|auto-generates plans|Stop scrolling blogs" <file>
# ko
grep -nE "AI가 짜주는|AI 자동 추천 플래너|GPT 기반|자동 생성 플래너|블로그 그만 보세요|유튜브 그만 보세요" <file>
```

If any match → rewrite. The engine may be described as `smart matching` / `스마트 매칭` / `preference-matching` (see `BRAND.allowedEngineDescription`), but the headline never positions the product as AI-first.

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
