# TripFlowy Analytics Schema (Sprint 1)

> **Status**: 책킴 검토용 design doc (2026-04-25 작성).
> Sign-off 받으면 middleware → 대시보드 → docs → smoke test 순으로 구현.
>
> **Storage**: Upstash Redis (Vercel Marketplace 통합) via `@upstash/redis`.
> Vercel KV는 2024년 단종 — 마스터 플랜 Sprint 1 섹션은 2026-04-25 minor edit 완료 (Upstash Redis + `proxy.ts` 명시).
>
> **Runtime**: Edge runtime (`middleware.ts`). `@upstash/redis`는 REST 기반이라 Edge 호환.
>
> **Env vars** (Vercel Marketplace 통합 시 자동 주입): `KV_REST_API_URL`, `KV_REST_API_TOKEN`. (Vercel은 KV→Upstash 마이그레이션 중 legacy KV-prefix 환경변수명을 그대로 유지 — 코드는 이 이름으로 read.)

---

## A. 키 네이밍 컨벤션

| 키 | 자료형 | 용도 | 예시 |
|---|---|---|---|
| `log:raw:{YYYY-MM-DD}` | list | 일별 raw entry append (debug + rebuild) | `log:raw:2026-04-25` |
| `log:agg:daily:{YYYY-MM-DD}` | hash | 일별 톱-라인 카운터 (총 요청·봇·LLM·UTM 트래픽) | `log:agg:daily:2026-04-25` |
| `log:agg:path:{YYYY-MM-DD}` | hash | 일별 path별 카운터 (`field=path`, `value=count`) | `log:agg:path:2026-04-25` |
| `log:agg:bot:{YYYY-MM-DD}` | hash | 일별 봇 식별자별 카운터 (GPTBot, ClaudeBot, …) | `log:agg:bot:2026-04-25` |
| `log:agg:llm:{YYYY-MM-DD}` | hash | 일별 LLM referrer별 카운터 (chatgpt.com, perplexity.ai, …) | `log:agg:llm:2026-04-25` |
| `log:agg:utm:{YYYY-MM-DD}` | hash | 일별 UTM campaign 카운터 (`field=src/med/camp`, `value=count`) | `log:agg:utm:2026-04-25` |
| `log:index:dates` | sorted set | 가용한 날짜 인덱스 (score=epoch, member=YYYY-MM-DD) | 대시보드 날짜 셀렉터용 |

**원칙**:
- prefix `log:` 단일 네임스페이스로 통합 — 향후 `cache:` / `flag:` 와 충돌 방지.
- raw vs agg 구분 → 대시보드는 agg만 read (commands 절약), raw는 디버그/rebuild 시에만.
- 날짜 단위 키 → TTL 적용 단순화 + 날짜 prune 쉬움.

---

## B. raw entry 스키마

JSON 문자열로 list에 push. 키 이름은 짧게 — Redis 저장 비용 절약.

```ts
type RawEntry = {
  ts: string;          // ISO8601 (UTC)
  path: string;        // 요청 path (쿼리스트링 제외)
  ref: string | null;  // referer (없으면 null)
  ua: string;          // User-Agent 원문 (200자 잘라서 저장)
  bot: string | null;  // 봇 식별자 ("GPTBot", "ClaudeBot", "PerplexityBot", ...) 또는 null
  llm: string | null;  // LLM referrer 호스트 ("chatgpt.com", "perplexity.ai", "claude.ai", ...) 또는 null
  utm_s: string | null;   // utm_source
  utm_m: string | null;   // utm_medium
  utm_c: string | null;   // utm_campaign
  utm_co: string | null;  // utm_content
  utm_t: string | null;   // utm_term (유료 캠페인 키워드 — 지금은 미사용, 나중 마이그레이션 비용 회피용으로 스키마에 미리 포함)
};
```

**저장 예시** (raw list 1 entry, ~270 bytes):

```json
{"ts":"2026-04-25T03:14:22Z","path":"/ko/posts/tokyo-disneyland-guide","ref":"https://chatgpt.com/","ua":"Mozilla/5.0 ... Safari","bot":null,"llm":"chatgpt.com","utm_s":null,"utm_m":null,"utm_c":null,"utm_co":null,"utm_t":null}
```

**ua 저장 정책**: 원문 200자까지 저장 (대부분 UA가 200자 이내, 봇 UA는 더 짧음). 추후 트래픽 폭증 시 `bot` 필드만 의존하고 ua 자체는 drop 검토.

**저장 안 하는 것** (정책):
- IP — 저장 안 함 (개인정보 + ToS 부담).
- 쿠키·세션 ID — 저장 안 함 (V1 범위 외).
- 쿼리스트링 raw — utm_* 만 파싱해서 저장, 그 외는 drop.

---

## C. TTL / 보관 정책

| 키 패턴 | TTL | 근거 |
|---|---|---|
| `log:raw:{date}` | **30일** (`EXPIRE 2592000`) | 디버그·rebuild용. 30일 이상 raw 유지할 시나리오 없음. |
| `log:agg:daily:{date}` | **365일** (`EXPIRE 31536000`) | 장기 톱-라인 트렌드 (월별/계절별). |
| `log:agg:path:{date}` | **90일** (`EXPIRE 7776000`) | 페이지별 인기도 — 분기 단위 비교까지. |
| `log:agg:bot:{date}` | **365일** | AI 크롤러 트렌드는 장기 추적 가치 큼. |
| `log:agg:llm:{date}` | **365일** | AI assistant referral 장기 추적. |
| `log:agg:utm:{date}` | **180일** | 캠페인 ROI 분석. |
| `log:index:dates` | TTL 없음 | 작은 sorted set, 영구 보관. |

**TTL 적용 타이밍**: 키 첫 write 시 `EXPIRE` 1회 호출. 이미 존재하는 키엔 `EXPIRE`만 멱등으로 다시 set해도 무방 (Redis 표준).

---

## D. write 전략 (middleware 부담 최소화)

### 요청당 commands

**일반 page hit (1 request)** — EXPIRE 최적화 적용 시:
1. `LPUSH log:raw:{date} {json}` — raw entry 추가
2. `HINCRBY log:agg:daily:{date} total 1`
3. `HINCRBY log:agg:path:{date} {path} 1`
4. (날짜 첫 요청만) `EXPIRE log:raw:{date} 2592000` + `EXPIRE log:agg:daily:{date} 31536000` + `EXPIRE log:agg:path:{date} 7776000` + `ZADD log:index:dates {epoch} {date} NX`

→ **3 commands/request** (정상 케이스) + 인스턴스 콜드스타트 직후 첫 요청에만 +4 commands.

봇/LLM/UTM은 해당될 때만 추가:

5. (봇이면) `HINCRBY log:agg:bot:{date} {botName} 1` (+ 첫 호출만 EXPIRE)
6. (LLM ref면) `HINCRBY log:agg:llm:{date} {host} 1` (+ 첫 호출만 EXPIRE)
7. (UTM 있으면) `HINCRBY log:agg:utm:{date} {key} 1` (+ 첫 호출만 EXPIRE)

**일반** ≈ **3 commands/request** (콜드스타트 후 안정 상태).
**최악 시나리오** (봇 + LLM + UTM 동시) ≈ **6 commands/request** (안정 상태).

### EXPIRE 최적화 구현 방식

Edge runtime 인스턴스 내부에 `Set<string>` 캐시로 "오늘 EXPIRE 이미 호출한 키" 추적:

```ts
const expiredToday = new Set<string>();  // module-level, 인스턴스 lifetime

function ensureExpire(pipe, key, ttl) {
  if (expiredToday.has(key)) return;
  pipe.expire(key, ttl);
  expiredToday.add(key);
}
```

**트레이드오프**:
- **(c) in-memory Set** (채택): commands 진짜 절감, but Edge 인스턴스 재시작 시 Set 초기화되어 콜드스타트마다 EXPIRE 1회 재호출. Vercel Edge는 트래픽에 따라 다중 인스턴스 → 인스턴스별 1회씩 발생 가능.
- **(b) `EXPIRE NX`** (보조): Redis 7+ 옵션, TTL 미설정인 키에만 적용. (c)와 결합해 멱등성 보장. **단** Upstash 빌링이 NX-noop도 1 command 카운트하면 절감 효과 없음 → 측정 후 판단.
- **(a) Lua script** (불채택): atomic하지만 EVAL 1 command + 스크립트 관리 부담. (c)+(b)로 충분.

**구현 결정**: (c) in-memory Set + (b) `EXPIRE NX`. middleware 첫 배포 후 Upstash 대시보드에서 일 commands 사용량 모니터링하고, NX가 카운트되는지 확인.

### Upstash 파이프라이닝

`@upstash/redis`는 `redis.pipeline()` 지원 → 1 HTTP round-trip으로 N commands. middleware latency 영향 최소화.

```ts
const pipe = redis.pipeline();
pipe.lpush(`log:raw:${date}`, JSON.stringify(entry));
pipe.expire(`log:raw:${date}`, 30 * 86400);
pipe.hincrby(`log:agg:daily:${date}`, "total", 1);
// ...
await pipe.exec();
```

### Free 티어 한도 시뮬레이션 (Upstash Free = 10,000 commands/day)

EXPIRE 최적화 적용 (안정 상태 평균 3 commands/req):

| 시나리오 | 일 요청수 | 평균 commands/req | 일 commands | Free 한도 |
|---|---:|---:|---:|---|
| 현재 (Sprint A 직후) | ~700 | 3 | 2,100 | ✅ 21% 사용 |
| Sprint 4 완료 (허브 페이지 trickle) | ~1,500 | 3 | 4,500 | ✅ 45% 사용 |
| Sprint 7 풀 가동 (도시 6개 콘텐츠) | ~5,000 | 3 | 15,000 | ⚠️ Pay-as-you-go 전환 필요 (월 ~$1) |
| Sprint 7 + 봇 트래픽 폭증 | ~10,000 | 4 | 40,000 | Pay-as-you-go ($0.08/일 수준) |

(콜드스타트 EXPIRE 오버헤드는 인스턴스 수 × 키 종류 × 1회로 무시 가능 수준 — 일 100 commands 미만.)

**대응 플랜**:
- **Sprint 4 진입 직전** Free → Pay-as-you-go 전환 검토 (Upstash는 $0.2/100k commands 수준, 월 ~$3 예상).
- 그 전이라도 일 요청 1,000 도달 시 batch write (5초 윈도우 누적 후 flush)로 commands 절반 절감 가능 — **단 Edge runtime은 in-memory batch가 인스턴스별로 분산되므로 효과 제한적**. 실효성은 측정 후 판단.

### 실패 처리

middleware에서 Redis write 실패 시 **요청 자체는 막지 않음**. `try/catch` + `console.warn` (Vercel logs). 분석 데이터 누락 < 사이트 다운, 명확한 우선순위.

---

## E. 인덱싱 전략

V1 단순함 우선 — sorted set 도입 없이 hash + 클라이언트 sort.

- **"AI 크롤러 Top 10 paths"** 같은 쿼리는 대시보드에서 `HGETALL log:agg:path:{date}` 후 `Object.entries().sort().slice(0, 10)` — 일별 path 수가 수백 단위면 충분.
- 트렌드 비교는 날짜별 hash N개 fetch (N≤30) 후 메모리 머지.
- 일별 path 수가 수천 단위로 늘면 그때 sorted set 추가 (`ZINCRBY log:rank:path:{date} 1 {path}`).

---

## F. 봇 / 유저 분리 결정

**추천**: V1은 **모두 로깅** (sampling 없음).

근거:
- 현재 트래픽이 Free 티어 안에 충분히 들어감 (시뮬레이션 D 참고).
- 일반 유저 트래픽 자체가 작은 시점에 sampling 도입하면 **데이터 노이즈 + 측정 신뢰도 하락**.
- Sprint 7 풀 가동 시점에 commands 한도 압박 오면 그때 sampling 도입 (e.g. 일반 유저 50% sample, 봇·LLM-ref·UTM은 100%).

**책킴 결정 필요**: 위 추천대로 진행할지, 아니면 처음부터 봇/LLM-ref/UTM만 로깅할지.

---

## 봇 / LLM 식별 규칙 (참고)

`/docs/analytics-regex.md`로 분리 예정 (Sprint 1 산출물). 핵심:

**AI 크롤러** (UA 매치):
- `GPTBot` (OpenAI)
- `ClaudeBot`, `Claude-Web`, `anthropic-ai` (Anthropic)
- `PerplexityBot` (Perplexity)
- `Google-Extended` (Google AI)
- `Bytespider` (TikTok/Doubao)
- `CCBot` (Common Crawl)
- `Applebot-Extended` (Apple Intelligence)

**AI assistant referral** (referer host 매치):
- `chatgpt.com`, `chat.openai.com`
- `perplexity.ai`, `www.perplexity.ai`
- `claude.ai`
- `gemini.google.com`, `bard.google.com`
- `copilot.microsoft.com`

**일반 검색 referral** (대조군):
- `google.com`, `naver.com`, `bing.com`, `duckduckgo.com`

---

## 결정 요약 (책킴 sign-off용)

**책킴 sign-off (2026-04-25)**:

A. 키 네이밍 ✅ 확정.
B. raw 스키마 ✅ 확정 — `utm_t` (utm_term) 필드 추가됨.
C. TTL ✅ 확정.
D. write 전략 ✅ 확정 — EXPIRE 최적화 ((c) in-memory Set + (b) `EXPIRE NX`) 추가됨. 안정 상태 일반 요청 6 → 3 commands.
E. 인덱싱 ✅ 확정.
F. 모두 로깅 ✅ 확정.

→ Step 2 (middleware 구현)로 진행.
