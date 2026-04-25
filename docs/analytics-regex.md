# Analytics 봇 / LLM 식별 규칙 (TripFlowy)

> Sprint 1 산출물. SoT는 코드 (`/lib/analytics/log-schema.ts`) — 이 문서는 사람-읽기용 reference.
> 코드와 doc이 어긋나면 **코드가 정답**. 새 패턴 추가 시 두 곳 동시 업데이트.

## AI 크롤러 (User-Agent 매치)

대시보드 `log:agg:bot:{date}` hash + `log:agg:daily:{date}` 의 `bot` 카운터에 집계.

| 식별자 (저장값) | UA 정규식 | 운영 주체 | 용도 |
|---|---|---|---|
| `GPTBot` | `/GPTBot/i` | OpenAI | LLM 학습 크롤러 |
| `ChatGPT-User` | `/ChatGPT-User/i` | OpenAI | ChatGPT 사용자 브라우징 |
| `OAI-SearchBot` | `/OAI-SearchBot/i` | OpenAI | SearchGPT 인덱싱 |
| `ClaudeBot` | `/ClaudeBot/i` | Anthropic | LLM 학습 크롤러 |
| `Claude-Web` | `/Claude-Web/i` | Anthropic | claude.ai 브라우징 |
| `anthropic-ai` | `/anthropic-ai/i` | Anthropic | API 시 fetch |
| `PerplexityBot` | `/PerplexityBot/i` | Perplexity | 인덱싱 |
| `Perplexity-User` | `/Perplexity-User/i` | Perplexity | 사용자 onbehalf 페치 |
| `Google-Extended` | `/Google-Extended/i` | Google | Gemini 학습 (별도 opt-out) |
| `Bytespider` | `/Bytespider/i` | ByteDance | TikTok / Doubao |
| `CCBot` | `/CCBot/i` | Common Crawl | 다수 LLM 학습 데이터셋 원천 |
| `Applebot-Extended` | `/Applebot-Extended/i` | Apple | Apple Intelligence 학습 |
| `Applebot` | `/Applebot/i` | Apple | Spotlight / Siri |
| `Googlebot` | `/Googlebot/i` | Google | 일반 검색 (대조군) |
| `Bingbot` | `/Bingbot/i` | Microsoft | Bing 검색 (대조군) |
| `DuckDuckBot` | `/DuckDuckBot/i` | DuckDuckGo | 일반 검색 (대조군) |
| `YandexBot` | `/YandexBot/i` | Yandex | 일반 검색 (대조군) |
| `NaverBot` (Yeti) | `/Yeti/i` | Naver | 한국 검색 (대조군, 매우 중요) |

**매치 순서**: 위에서 아래로 first-match-wins. `Applebot-Extended`가 `Applebot`보다 위에 있어야 함 (longer-prefix-first).

**대조군 (일반 검색 봇) 의미**: AI 크롤러 vs 전통 검색 비율 모니터링. `Googlebot` 트래픽이 `GPTBot`의 N배인지가 GEO 진척도 1차 지표.

## AI Assistant Referrals (referer 호스트 매치)

대시보드 `log:agg:llm:{date}` hash + `log:agg:daily:{date}` 의 `llm` 카운터.

화이트리스트 (Set 기반, 정확히 일치):

| 호스트 | 서비스 |
|---|---|
| `chatgpt.com` | ChatGPT (현행) |
| `chat.openai.com` | ChatGPT (legacy) |
| `perplexity.ai` | Perplexity |
| `www.perplexity.ai` | Perplexity (www) |
| `claude.ai` | Claude |
| `gemini.google.com` | Gemini (현행) |
| `bard.google.com` | Bard (legacy) |
| `copilot.microsoft.com` | Microsoft Copilot |
| `you.com` | You.com |
| `phind.com` | Phind |

**파싱**: `new URL(referer).hostname.toLowerCase()` → Set 멤버십 체크. 파싱 실패(잘못된 referer 헤더)는 `null` 반환, silent skip.

## UTM 집계 키

`log:agg:utm:{date}` hash 의 field 형식: `${utm_source}/${utm_medium}/${utm_campaign}` (없는 값은 `-`로 대체). raw entry는 `utm_content`, `utm_term` 까지 다 보관 — 집계 키에선 cardinality 폭증 방지로 상위 3개만 사용.

명명 규칙: `/docs/utm-convention.md`.

## 변경 / 확장 절차

새 봇 또는 LLM 호스트가 등장하면:

1. `lib/analytics/log-schema.ts` 의 `BOT_PATTERNS` 또는 `LLM_HOSTS`에 항목 추가.
2. 이 문서에 표 줄 추가.
3. (옵션) `public/robots.txt`에 해당 UA 별 `Allow:` 블록 추가 (LLM 학습 허용 정책 유지).
4. `npx tsc --noEmit` + `npm run build` 통과 확인.

## 변경 이력

- 2026-04-25 — Sprint 1 초안. 18 봇 패턴, 10 LLM 호스트.
