# TripFlowy 웹사이트 개선 마스터 플랜 v4.2 — Claude Code용 최종 프롬프트

> **이 문서 하나로 완결됩니다.** 이전 버전(v1~v4.1)은 더 이상 참조 불필요.  
> **v4.2 변경**: Sprint 4 비교/용어집 풀 템플릿, Sprint 5 기존 Naver 글 처리, Sprint 6 우선순위+등록 가이드, Sprint 7 도시별 콘텐츠 템플릿, V1.1 진입 조건 추가.  
> **문서 규칙**: 설명 텍스트는 일반 Markdown, Claude Code에 복붙할 프롬프트는 `### 📋 복붙 프롬프트` 헤더 + 코드 펜스로 명확히 구분.

---

## 📋 목차

- **Part A** — Kickoff 프롬프트 (매 세션마다 복붙)
- **Part B** — `/content/brand.ts` (단일 진실의 원천)
- **Part C** — Sprint 구조
  - Sprint 0: 프로젝트 인프라 정비
  - Sprint A: 즉시 픽스 12개
  - Sprint 1: 분석 인프라
  - ~~Sprint 2~~: 이미 구현됨 (skip)
  - Sprint 3: 이미지 파이프라인 + 스팟 스키마
  - Sprint 4: 허브 페이지 (비교/용어집/페르소나)
  - Sprint 5: Naver 메인 홈 링크
  - Sprint 6: 외부 권위 + Wikidata
  - Sprint 7: 도시 콘텐츠 + 근교 1일 투어
  - V1.1: 협업 기능 (진입 조건 명시)
- **Part D** — 세션 관리 팁
- **Part E** — 우선순위 타임라인
- **Part F** — Sprint 종료 체크리스트
- **Part G** — 사전 결정 체크 (완료됨)

---

## Part A — Kickoff 프롬프트

⚠️ **이 블록을 매 Claude Code 세션의 첫 메시지로 복붙하세요.** 한두 번 건너뛰면 원칙을 잊고 금지 표현이 박힐 수 있어요.

### 📋 복붙 프롬프트

```
안녕 Claude Code. 나는 TripFlowy(tripflowy.com)를 만들고 있는 책킴(Check Kim)이야.
사이트 GEO/AEO 진단을 마쳤고, 이미 기본기 88/100점이 나왔어. 
이제 즉시 픽스 → 외부 권위 → 콘텐츠 확장 순서로 진행할 거야.

작업 시작 전에 먼저 다음 문서들을 순서대로 읽어줘:

1. /docs/tripflowy-master-plan.md (이 문서 — 전체 맥락과 Sprint 구조)
2. /content/brand.ts (포지셔닝의 진실의 원천, Sprint 0 이후 존재)
3. AGENTS.md (프로젝트 루트 — 기술 스택과 규칙)

읽은 후 다음을 확인해줘:
- 현재 어느 Sprint까지 완료되었는지 (.progress.md 확인)
- 이번 세션에서 어떤 Sprint를 진행할지
- 내가 제안하는 작업 순서에 반대 의견이 있으면 먼저 말해줘

중요 원칙 (반드시 지켜줘):

1. 포지셔닝: TripFlowy는 "AI 여행 플래너"가 아니라 
   "사람이 직접 큐레이션한 여행 일정 플랫폼"이야.
   - 영문: "Built by real travelers, not algorithms" / "Field-tested routes"
   - 한국어: "직접 다녀온 사람이 만든 여행 동선" / "현장 검증된 코스"
   히어로 카피, 메타 태그, 스키마 어디에도 "AI planner"/"AI가 짜주는" 
   단독 표현 사용 금지. /content/brand.ts의 forbiddenPhrases 참고.

2. 블로거·유튜버 존중: 책킴도 네이버 블로거이고 블로거 협업 중. 
   "블로그 그만 봐" 같은 공격적 카피 금지. 
   TripFlowy는 블로그·유튜브를 "정리하고 종합하는" 큐레이터 포지션.

3. 단일 진실의 원천: 브랜드 문구(이름, 태그라인, 설명)는 
   /content/brand.ts에서 상수로 관리. 하드코딩 금지.

4. 측정 가능성 우선: Sprint 1(분석 인프라)을 콘텐츠 Sprint보다 
   먼저 완료할 것. 측정 없이 시작하면 효과 검증 불가.

5. 한국어 원본 → 영어 어댑테이션 (번역 아님): 
   - 책킴은 한국어로만 작성. 영문은 Claude Code가 어댑테이션.
   - "번역"이 아니라 "영어권 여행자가 처음부터 영어로 쓴 것처럼" 작성.
   - 예: "가성비" → "bang for your buck" 또는 "budget-friendly" 
     (literal "cost-effective" 금지)
   - 한국인에만 의미 있는 맥락 교체. "강남역에서 1시간" → 
     "accessible from central Tokyo"

6. MVP 원칙: 협업 기능(스와이프-투표 등)은 V1.1(3개월 후)로 보류. 
   V1은 매칭 엔진 + 콘텐츠 + 어필리에이트에 집중.

7. 컨텍스트 경제: 작업마다 관련 디렉토리의 AGENTS.md만 읽고, 
   루트 AGENTS.md를 매번 다시 읽지 말 것.

8. 엔티티 일관성:
   - 한국어 primary: 책킴
   - 영문 primary: Check Kim  
   - 법적 이름 (B2B/계약): Huiwon Kim
   - alternateName 배열: ["Check Kim", "책킴", "travelkkkim", "Huiwon Kim"]

시작해도 될까? 먼저 .progress.md를 확인해줘.
```

---

## Part B — `/content/brand.ts` (단일 진실의 원천)

Sprint 0에서 Claude Code가 이 TypeScript 파일을 자동 생성합니다. 책킴이 직접 타이핑할 필요 없음.

### 전체 파일 내용

```typescript
// /content/brand.ts

export const BRAND = {
  name: "TripFlowy",
  alternateNames: ["트플"],
  domain: "tripflowy.com",
  
  // 카테고리 정의 — JSON-LD와 메타 description에 사용
  categoryEn: "Human-curated travel itinerary platform",
  categoryKo: "사람이 직접 큐레이션한 여행 일정 플랫폼",
  
  // 금지 표현 (코드 리뷰에서 grep으로 자동 검출)
  forbiddenPhrases: {
    en: [
      "AI travel planner", 
      "AI-powered planner", 
      "GPT-based", 
      "auto-generates plans",
      "Stop scrolling blogs", // 블로거 존중 방향
    ],
    ko: [
      "AI가 짜주는",
      "AI 자동 추천 플래너",
      "GPT 기반",
      "자동 생성 플래너",
      "블로그 그만 보세요",
      "유튜브 그만 보세요",
    ],
  },
  
  // 허용 표현 (엔진 설명용, 히어로 카피에는 금지)
  allowedEngineDescription: {
    en: ["smart matching", "intelligent matching", "preference-matching engine"],
    ko: ["스마트 매칭", "조건 매칭", "맞춤 매칭"],
  },
};

export const FOUNDER = {
  // Public-facing primary names
  nameKo: "책킴",
  nameEn: "Check Kim",
  
  // Legal name (사업자 등록, 계약, 법적 문서)
  legalName: "Huiwon Kim",
  
  // For LLM entity resolution (alternateName 배열)
  alternateName: [
    "Check Kim",
    "책킴",
    "travelkkkim",
    "Huiwon Kim",
    "Chaekkim",
  ],
  
  // 한국어도 "Founder" 영문 그대로 유지
  jobTitleEn: "Founder, TripFlowy · Travel Creator",
  jobTitleKo: "TripFlowy Founder · 여행 크리에이터",
  
  // Bio — 일본 권위 + 아시아 전역 확장 + 근교 코스
  bioKo: "2007년부터 아시아 전역을 여행해온 여행 크리에이터. 책킴(Check Kim)으로 활동하며, 2025년 한 해 동안만 비행기를 64번 탔다. 일본을 20번 넘게 다녀왔고 아시아 15개국 50개 도시 이상에서 스팟을 직접 검증한다. 테마파크·공항 교통·전망대·근교 당일치기 코스 가이드를 주로 쓴다.",
  bioEn: "Travel creator covering Asia since 2007. Known as Check Kim (책킴) in Korea, boarded 64 flights in 2025 alone. 20+ trips to Japan, with personally tested spots across 50+ cities in 15+ Asian countries. Writes about theme parks, airport transit, observation decks, and day-trip routes from major cities.",
  
  knowsAbout: [
    "Asia travel",
    "Japan travel", 
    "Tokyo", 
    "Theme parks", 
    "Airport transit", 
    "Observation decks",
    "Day trips from major cities",
  ],
  
  // Profile URLs (sameAs) — 한국어 SNS 포함, LLM은 언어 구분 없이 엔티티 통합
  profiles: {
    instagram: "https://instagram.com/travelkkkim",
    naverBlog: "https://blog.naver.com/[TODO]",
    youtube: "https://youtube.com/@travelkkkim",
    linkedin: "https://linkedin.com/in/[TODO]",
    crunchbase: "https://crunchbase.com/person/[TODO]",
    wikidata: "https://wikidata.org/wiki/[TODO]",
  },
  
  // 신뢰 stats (홈 hero, author 박스에 사용)
  stats: [
    { ko: "일본 20+ 방문 · 아시아 15개국 50+ 도시", en: "20+ trips to Japan · 15+ countries, 50+ cities in Asia" },
    { ko: "2025년 비행기 64회", en: "64 flights in 2025" },
    { ko: "검증 스팟 200+", en: "200+ verified spots" },
  ],
};

// 메타 description (40~80단어 추출 청크)
export const META_DESCRIPTIONS = {
  homeKo: "직접 다녀온 사람이 검증한 여행 일정 템플릿. 도시·기간·스타일을 입력하면 실제로 걸어보고 검증된 하루 코스로 맞춤 일정을 만들어드립니다.",
  homeEn: "Verified travel itinerary templates from a real traveler. Tell us your destination, duration, and style — we match you with day-by-day routes that have been walked and tested in person.",
  
  plannerKo: "여행지·기간·스타일을 입력하면 책킴이 직접 검증한 스팟으로 하루 코스 기반 일정을 짜드립니다. 회원가입 없이, 양식 작성 없이, 기다림 없이.",
  plannerEn: "Enter your destination, duration, and travel style to get a day-by-day itinerary built from spots Check Kim has personally walked and tested. No accounts, no forms, no waiting.",
  
  dayTripsKo: "도시 근교로 떠나는 당일치기 여행 코스. 실제 동선, 이동 시간, 시즌별 추천, 교통 패스까지 책킴이 직접 다녀와 정리한 1일 루트.",
  dayTripsEn: "Day trips from major Asian cities. Real routes, travel times, seasonal recommendations, and transit passes — all walked and tested by Check Kim.",
};

// 히어로 카피 — 블로거 존중 방향
export const HERO = {
  badgeKo: "직접 다녀온 사람이 만든 여행 동선",
  badgeEn: "Built by real travelers, not algorithms",
  
  h1Ko: "블로그·유튜브, \n정리된 여행 루트로.",
  h1En: "Blogs, YouTube, guidebooks —\nsorted into one route.",
  
  subKo: "여기서 여행 계획 끝내세요.",
  subEn: "Plan your trip right here.",
  
  taglineKo: "직접 걸어보고 만든 코스, 바로 따라가면 됩니다.",
  taglineEn: "Every route was walked and tested in person. Just follow along.",
  
  subTaglineKo: "블로그 탭 10개 대신, 완성된 루트 1개.",
  subTaglineEn: "Skip the 10-tab research. Get the route.",
};

// 비교 섹션 H2 (영문 패턴을 한국어에 역수입)
export const COMPARISON_HEADINGS = {
  ko: "AI 생성 일정 vs 현장 검증 코스",
  en: "AI-Generated Plans vs Field-Tested Routes",
};

// 신뢰 신호 프레이즈
export const TRUST_PHRASES = {
  ko: [
    "직접 방문",
    "현장 검증",
    "에디터 검증",
    "최종 확인일 [날짜]",
    "여러 번 다녀온 후기",
  ],
  en: [
    "personally visited",
    "field-tested",
    "editor verified",
    "last verified [date]",
    "from multiple visits",
  ],
};

// 어필리에이트 공시 (FTC 컴플라이언스)
export const AFFILIATE_DISCLOSURE = {
  ko: "제휴 공개: 일부 링크를 통해 소정의 수수료를 받을 수 있으며, 이용자에게 추가 비용은 없습니다. 직접 방문하고 검증한 곳만 추천합니다.",
  en: "Affiliate Disclosure: Some links on this site are affiliate links — we may earn a small commission if you book through them, at no additional cost to you. We only recommend tours and accommodations we've personally tested.",
};
```

---

## Part C — Sprint 구조

### 🏗️ Sprint 0: 프로젝트 인프라 정비 (반나절)

#### 왜 가장 먼저?

Sprint A 이하 모든 작업이 `/content/brand.ts`의 상수를 import한다고 가정해요. brand.ts가 없으면 시작 못 해요. AGENTS.md를 잘 쪼개두면 이후 매 세션의 컨텍스트가 절약됩니다.

#### 작업 개요

1. 루트 `AGENTS.md` 작성 (200줄 이하)
2. 루트 `CLAUDE.md` → `AGENTS.md` 심볼릭 링크
3. 하위 디렉토리별 `AGENTS.md` 생성
4. `.progress.md` 생성 — Sprint 진행 상태 추적
5. `/content/brand.ts` 생성 (Part B 내용)

#### 📋 복붙 프롬프트

```
Sprint 0을 시작할게. 

1. 현재 CLAUDE.md가 있다면 읽고, 그 내용을 AGENTS.md로 옮겨줘. 
   AGENTS.md는 200줄 이하로 — 프로젝트 개요, 기술 스택, 
   핵심 규칙만. 상세 규칙은 하위 디렉토리로 내려.

2. 루트의 CLAUDE.md를 삭제하고 AGENTS.md → CLAUDE.md 심볼릭 링크:
   ln -s AGENTS.md CLAUDE.md
   
   이유: AGENTS.md는 여러 코딩 에이전트(Cursor, Aider, Codex 등)의 
   공용 표준. CLAUDE.md는 Claude Code 전용. 심볼릭 링크로 
   양쪽 호환. 미래에 다른 에이전트로 옮겨도 컨텍스트 재활용 가능.

3. 하위 디렉토리별 AGENTS.md 생성 (각각 그 디렉토리에서만 적용될 
   규칙만, 루트와 중복 금지):
   
   - /app/AGENTS.md
     · Next.js App Router 패턴
     · JSON-LD 삽입 표준 (Article + TravelGuide 듀얼 타입 등)
     · /content/brand.ts의 FOUNDER import 필수
     · hreflang 양방향 태그 규칙
     · Person 스키마의 alternateName은 반드시 배열
     
   - /content/AGENTS.md
     · Markdown frontmatter 표준 (visitedAt, lastVerified, author 등)
     · 신뢰 프레이즈 (TRUST_PHRASES) 최소 1개 포함 규칙
     · 추출 청크 (40-80단어) 상단 배치 규칙
     · 금지 표현 (forbiddenPhrases) 자동 grep 체크
     
   - /docs/AGENTS.md
     · 내부 문서는 Markdown으로 작성
     · 외부 공개 문서는 /app/[locale]/docs/로 별도 관리
     
   - /scripts/AGENTS.md
     · sharp 사용 시 .withMetadata() 필수 (EXIF 보존)
     · Naver → TripFlowy 변환 파이프라인 규칙
     · Claude API 호출 시 API 키는 env 사용

4. /content/brand.ts 생성. /docs/tripflowy-master-plan.md의 
   Part B 섹션 내용을 그대로 TypeScript 상수로:
   - BRAND (name, forbiddenPhrases, allowedEngineDescription)
   - FOUNDER (모든 필드)
   - META_DESCRIPTIONS
   - HERO
   - COMPARISON_HEADINGS
   - TRUST_PHRASES
   - AFFILIATE_DISCLOSURE
   
   FOUNDER.profiles의 일부 URL은 [TODO] 마커 포함. 
   Sprint 6에서 실제 URL로 교체될 예정.

5. .progress.md 생성:
   - Sprint 0 완료 체크
   - Sprint A ~ V1.1 각 Sprint 하위 작업 체크박스 목록
   - Sprint 2는 "기존 사이트에 이미 구현됨 — skip" 메모

작업 완료 후:
- 생성/수정된 파일 목록 보여주기
- /content/brand.ts의 TypeScript 컴파일 체크 (tsc --noEmit)
- .progress.md 업데이트
```

**예상 시간**: 3~4시간

---

### 🚨 Sprint A: 즉시 픽스 12개 (Week 1, ~12시간)

v2 사이트 진단 리뷰에서 발견된 픽스 + 근교 1일 투어 방향 반영.

#### A.1 `/llms.txt` 500 에러 수정 + `/llms-full.txt` 신규 (1.5h) 🔴

**배경**: `/llms.txt`가 현재 500 서버 에러를 반환. ClaudeBot/PerplexityBot이 이 파일을 시도해서 500을 받고 있을 가능성. 가장 시급한 픽스.

#### 📋 복붙 프롬프트

```
/llms.txt가 현재 500 서버 에러를 반환하고 있어 (브라우저 확인됨).

1. 현재 /app/llms.txt/route.ts 또는 비슷한 라우트 핸들러 찾기
2. 에러 원인 진단 후 수정. 다음 형식으로 작동하게:

# TripFlowy
> Verified travel itinerary templates by Check Kim (책킴), 
> a Korean travel creator covering Asia since 2007.

## Cities  
- [Tokyo](https://www.tripflowy.com/planner?destinations=tokyo): 
  Auto-generated itinerary from spots personally tested

## Day Trips
- Kawagoe, Chichibu, Mt. Fuji day trips from Tokyo
- Nara, Himeji day trips from Osaka

## Guides (English)
- [Tokyo Disneyland Guide](...): Tickets, DPA, rides, parade tips
- [Tokyo DisneySea Guide](...)
- [Shibuya Sky Guide](...)
- [Keisei Skyliner Guide](...)

## Guides (Korean) 
- [도쿄 디즈니랜드 가이드](https://www.tripflowy.com/ko/posts/tokyo-disneyland-guide)
- [도쿄 디즈니씨 가이드](...)
- [나리타공항 리무진 버스 가이드](...)

## Planner
- [Travel Planner](https://www.tripflowy.com/planner)
- [여행 플래너](https://www.tripflowy.com/ko/planner)

3. /app/llms-full.txt/route.ts 신규 생성:
   - BRAND, FOUNDER 정보 + 모든 가이드 글 본문 + FAQ를 
     하나의 Markdown으로
   - /content/brand.ts와 /content/guides/ 폴더에서 자동 생성

4. /public/robots.txt에 두 파일 명시:
   # LLM-friendly index
   # https://www.tripflowy.com/llms.txt
   # https://www.tripflowy.com/llms-full.txt

작업 후 검증:
- curl -A "ClaudeBot" https://tripflowy.com/llms.txt → 200 OK
- 응답 본문에 BRAND.name, FOUNDER.nameEn 포함 여부
```

#### A.2 robots.txt `/courses` 차단 해제 + 내비게이션 제거 (1h) 🔴

**배경**: 추천 코스 페이지는 LLM/Google이 색인하게 하되, 유저 내비게이션에는 노출 안 함. 현재 robots.txt로 막혀있어 GEO 자산이 죽어있는 상태.

#### 📋 복붙 프롬프트

```
/courses는 1일 근교 투어 페이지들. 전략:
- robots.txt 차단은 해제 (LLM·Google 색인 허용)
- 내비게이션(메뉴)에서는 제거 (유저 직접 노출 X)
- 메타 noindex는 걸지 말 것 (색인 유지)

1. /public/robots.txt에서 다음 라인들 제거:
   Disallow: /courses
   Disallow: /courses/
   Disallow: /ko/courses
   Disallow: /ko/courses/

2. 헤더/푸터 내비게이션 컴포넌트에서 /courses 링크 제거

3. 사이트맵에 /courses 경로가 모두 포함되도록 확인

4. 각 /courses/[city]/[slug] 페이지에 메타 robots 확인:
   - "noindex" 메타 태그 없음
   - canonical이 자기 자신을 가리키는지 확인

5. /courses 홈 페이지가 존재한다면 Day Trip 허브로 유지:
   - 추출 청크: META_DESCRIPTIONS.dayTripsKo / .dayTripsEn 사용
   - 도시별 day trip 링크 리스트

작업 후 확인:
- curl -A "GPTBot" https://tripflowy.com/courses/tokyo/kawagoe → 200 OK
- Google Search Console에서 /courses/ 경로 색인 요청 제출
```

#### A.3 한국어 WebSite 스키마 description 교체 (0.2h) 🔴

**배경**: LLM이 "TripFlowy가 무엇인가"를 학습하는 1차 시그널. 가장 ROI 높은 단일 픽스.

#### 📋 복붙 프롬프트

```
홈페이지의 WebSite JSON-LD에서 description 교체:

현재 (위험):
"도시, 기간, 스타일만 선택하면 자동으로 여행 일정을 만들어주는 여행 플래너"

신규 (안전):
META_DESCRIPTIONS.homeKo 사용

/content/brand.ts에 이미 정의됨. import해서 사용, 하드코딩 금지.
```

#### A.4 영문 WebSite 스키마 description 교체 (0.2h) 🟠

#### 📋 복붙 프롬프트

```
영문 홈페이지의 WebSite JSON-LD description 교체:

현재:
"Auto-generate day-by-day travel itineraries..."

신규:
META_DESCRIPTIONS.homeEn 사용
```

#### A.5 히어로 카피 업데이트 — 블로거 존중 방향 (0.5h) 🟠

**배경**: 책킴이 네이버 블로거/유튜버 협업 예정. "블로그 그만 보세요" 공격적 톤은 BM에 역풍.

#### 📋 복붙 프롬프트

```
홈페이지 히어로의 H1 업데이트.

현재 (삭제):
- 한국어: "블로그, 유튜브, 가이드북 그만 보세요."
- 영문: "Stop scrolling blogs, YouTube, and guidebooks."

신규 (/content/brand.ts HERO에서 import):
- 한국어 H1: HERO.h1Ko → "블로그·유튜브, 정리된 여행 루트로."
- 영문 H1: HERO.h1En → "Blogs, YouTube, guidebooks — sorted into one route."

부제 추가 (작은 글씨):
- 한국어: HERO.subTaglineKo → "블로그 탭 10개 대신, 완성된 루트 1개."
- 영문: HERO.subTaglineEn → "Skip the 10-tab research. Get the route."

의도: TripFlowy를 "블로그·유튜브 정보를 종합하는 큐레이터"로 포지션.
블로거들이 이 사이트를 보고도 거부감 안 느끼게.

비교 섹션 한국어 H2도 함께 업데이트:
- 현재: "AI가 짜주는 일정 vs 직접 걸어본 일정"
- 신규: COMPARISON_HEADINGS.ko → "AI 생성 일정 vs 현장 검증 코스"

/content/brand.ts의 forbiddenPhrases에 추가된 표현을 
다른 페이지에서도 grep해서 제거.
```

#### A.6 Person 스키마 alternateName 배열 확장 (0.5h) 🟡

#### 📋 복붙 프롬프트

```
모든 글의 Person 스키마에서 alternateName이 단일 문자열인데, 
배열로 확장:

현재:
"alternateName": "책킴" (한국어 글)
"alternateName": "Check Kim" (영문 글)

신규 (양쪽 모두):
"alternateName": ["Check Kim", "책킴", "travelkkkim", "Huiwon Kim"]

FOUNDER.alternateName을 import해서 사용.

작업 범위:
- /content/guides/ 또는 /content/posts/ 폴더의 모든 글
- /app/[locale]/posts/[slug]/page.tsx의 Person 스키마 생성 로직
```

#### A.7 Bio 업데이트 — 아시아 전역 확장 (0.5h) 🟡

#### 📋 복붙 프롬프트

```
모든 Person 스키마의 description과 author 박스 bio 업데이트.

현재 (일본만 강조):
"2007년부터 일본을 20번 넘게 다녀온 여행 크리에이터..."

신규 (아시아 전역):
FOUNDER.bioKo 또는 FOUNDER.bioEn 사용

핵심 변경:
- "일본 20번+"는 유지 (강력한 권위 신호)
- 추가: "아시아 15개국 50개 도시 이상"
- 추가: "근교 당일치기 코스"

jobTitle도 업데이트:
- 한국어: "tripflowy 창업자 · 여행 크리에이터" 
  → "TripFlowy Founder · 여행 크리에이터"
- 영문: 기존 유지

/content/brand.ts에서 import.
```

#### A.8 한국어 author 박스에 "(Check Kim)" 표기 추가 (0.5h) 🟡

#### 📋 복붙 프롬프트

```
한국어 가이드 글 하단 작성자 박스에 영문명 병기:

현재 (한국어 글):
"김희원
tripflowy 창업자 · 여행 크리에이터
..."

신규:
"책킴 (Check Kim)
TripFlowy Founder · 여행 크리에이터
..."

영문은 이미 "Huiwon Kim (Check Kim)"으로 됨. 한국어만 정렬.

FOUNDER.nameKo + FOUNDER.nameEn 조합으로 표시:
${FOUNDER.nameKo} (${FOUNDER.nameEn})
```

#### A.9 sitemap.xml 점검 (1h) 🟡

#### 📋 복붙 프롬프트

```
sitemap.xml 점검:

1. 영문/한국어 글이 모두 포함되어 있는지
2. /courses/ 경로가 포함되어 있는지 (A.2에서 차단 해제됨)
3. 각 URL에 <xhtml:link rel="alternate" hreflang="..."> 명시:
   <url>
     <loc>https://www.tripflowy.com/posts/tokyo-disneyland-guide</loc>
     <xhtml:link rel="alternate" hreflang="en" 
       href="https://www.tripflowy.com/posts/tokyo-disneyland-guide"/>
     <xhtml:link rel="alternate" hreflang="ko" 
       href="https://www.tripflowy.com/ko/posts/tokyo-disneyland-guide"/>
     <xhtml:link rel="alternate" hreflang="x-default" 
       href="https://www.tripflowy.com/posts/tokyo-disneyland-guide"/>
   </url>

4. <lastmod>이 정확한지 (글 frontmatter의 dateModified 기준)
5. /planner 동적 결과 페이지는 sitemap에서 제외 (URL 무한 조합)

작업 후 결과 첫 30줄 보여줘.
```

#### A.10 영문 affiliate disclosure 추가 (0.3h) 🟡

#### 📋 복붙 프롬프트

```
영문 사이트 푸터에 FTC-compliant affiliate disclosure 추가.

AFFILIATE_DISCLOSURE.en 사용.

추가로 각 글 하단 어필리에이트 버튼 근처에 작은 disclosure:
"* Klook affiliate link"
```

#### A.11 홈 hero에 책킴 신뢰 stat 박스 (2h) 🟡

#### 📋 복붙 프롬프트

```
홈페이지 hero(영문/한국어 모두)에 책킴 권위 stat 박스 추가.

배지 아래 또는 폼 옆에:
"이 사이트의 모든 스팟은 책킴(Check Kim)이 직접 가본 곳입니다"
+ FOUNDER.stats 3개:
- "일본 20+ 방문 · 아시아 15개국 50+ 도시"
- "2025년 비행기 64회"
- "검증 스팟 200+"

가능하면 책킴 작은 프로필 사진(50x50px). 없으면 placeholder.

목적: LLM이 hero를 청킹할 때 권위 신호를 즉시 픽업.
```

#### A.12 플래너 결과 스팟별 검증 표시 (3h) 🟡

**주의**: 이 작업의 전체 구현(스키마, 파이프라인, CI 경고)은 Sprint 3에서 완성됨. Sprint A에서는 **기존 데이터에 lastVerified만 간단히 추가**하고 UI에 표시.

#### 📋 복붙 프롬프트

```
플래너 결과 페이지 각 스팟에 "누가 언제 검증했는지" 표시.
(상세 스키마 정의는 Sprint 3에서. 여기서는 간단 표시만)

1. 기존 스팟 데이터에 lastVerified 필드 우선 추가:
   - 현재 데이터가 어디에 있든 (스프레드시트, JSON, DB) 
     lastVerified 필드 추가
   - 값이 없으면 오늘 날짜로 일괄 초기화

2. 플래너 결과 UI 각 스팟 카드 하단에 작은 텍스트:
   "✓ 책킴 · 정보 확인 2025-03"
   "✓ Check Kim · verified Mar 2025"

3. 향후 Sprint 3에서 visitedAt 필드, check-stale-spots.ts 스크립트, 
   이미지 파이프라인 완성 예정. 지금은 lastVerified만.

AI 슬롭과 진짜 큐레이션을 구분하는 가장 강력한 시각 신호.
```

---

### 📊 Sprint 1: 분석 인프라 (Week 2, 1일)

#### 왜 필요?

측정 가능성 확보. Sprint A 효과 검증을 위해서도 필수. 콘텐츠 Sprint보다 먼저 완료해야 이후 모든 작업의 ROI를 측정할 수 있음.

#### 📋 복붙 프롬프트

```
Sprint 1: 분석 인프라 세팅.

1. Vercel 미들웨어 /middleware.ts 생성:
   - 모든 요청의 레퍼러 + User-Agent 로깅
   - AI 크롤러 UA: GPTBot, OAI-SearchBot, ClaudeBot, 
     Claude-SearchBot, PerplexityBot, Perplexity-User,
     ChatGPT-User, Claude-User, Google-Extended, Bingbot
   - AI 어시스턴트 레퍼러 regex: 
     chatgpt.com, perplexity.ai, claude.ai, gemini.google.com, 
     copilot.microsoft.com 등
   - UTM 파싱 (utm_source, utm_medium, utm_campaign, utm_content)
   - regex는 /docs/analytics-regex.md에 문서화

2. 로그는 Vercel KV에 저장:
   스키마: { 
     timestamp, path, referer, ua, 
     is_ai_crawler, ai_assistant_source,
     utm_source, utm_medium, utm_campaign, utm_content
   }

3. /app/admin/analytics/page.tsx — 관리자 대시보드:
   - 오늘/7일/30일 AI 크롤러 방문 수
   - AI 어시스턴트 레퍼럴 수
   - 랜딩 페이지 Top 10
   - UTM 캠페인별 트래픽
   - 인증: env.ADMIN_KEY 쿼리 파라미터

4. 회원가입 폼에 "어디서 저희를 알게 되셨나요?" optional 필드 추가
   (회원가입 폼 없으면 skip + .progress.md에 기록)

5. GA4 커스텀 채널 그룹 "AI Assistants" 설정:
   regex:
   ^(chatgpt\.com|chat\.openai\.com|perplexity\.ai|www\.perplexity\.ai|
   claude\.ai|gemini\.google\.com|bard\.google\.com|copilot\.microsoft\.com|
   edgeservices\.bing\.com|meta\.ai|chat\.mistral\.ai|poe\.com|you\.com|
   grok\.com|duckduckgo\.com/.*ia=chat)$

6. /docs/utm-convention.md 표준:
   - utm_source: naver_blog | instagram | youtube | linkedin | reddit
   - utm_medium: referral | social | email
   - utm_campaign: [city]_[content-type] (예: tokyo_3day)
   - utm_content: 출처 글의 슬러그

완료 후 테스트:
- curl -A "GPTBot" https://tripflowy.com/
- 로그에 기록되는지 확인
```

---

### ⏭️ Sprint 2: SKIP (이미 구현됨)

**상태**: 기존 사이트에 이미 구현되어 있어 별도 Sprint 불필요. `.progress.md`에 "Sprint 2: 기존 사이트에 이미 구현됨 — skip" 메모 유지.

**이미 구현된 것들**:
- JSON-LD 스키마 풍부 (Organization, WebSite, HowTo, Article+TravelGuide, FAQPage, BreadcrumbList, speakable)
- robots.txt의 AI 크롤러 명시적 허용
- hreflang 양방향 (en/ko/x-default)
- canonical 정확

---

### 🖼️ Sprint 3: 이미지 파이프라인 + 스팟 스키마 (Week 2, 2~3일)

#### 왜 중요?

Sprint 4(허브 페이지) 및 Sprint 7(도시 콘텐츠) 작업이 **이미지와 spot 데이터에 의존**. 이게 없으면 콘텐츠 확장 불가능.

#### 작업 개요

1. 스팟 데이터 TypeScript 스키마 정의
2. Sony A7M5 + Lightroom 워크플로우 문서
3. 이미지 처리 파이프라인 (sharp, EXIF 보존, AVIF 변환)
4. Naver → TripFlowy 변환 스크립트
5. `check-stale-spots.ts` CI 경고 스크립트

#### 스팟 스키마 (참고용 코드)

```typescript
// /content/schemas/spot.ts

export type Spot = {
  id: string;                    // tokyo-shibuya-sky
  nameKo: string;
  nameEn: string;
  nameLocal?: string;            // 渋谷スカイ
  city: string;
  neighborhood: string;
  category: Category[];          // ['view', 'modern']
  coordinates: { lat: number; lng: number };
  durationMin: number;
  costKRW?: number;
  recommendedFor: string[];      // ['solo', 'family', 'with-parents']
  accessibility: {
    wheelchair: boolean;
    seniorFriendly: boolean;
  };
  description: { ko: string; en: string };
  tips: { ko: string; en: string };
  
  // 방문 날짜 정책
  visitedAt?: string;            // ISO. 첫 방문일. optional
  lastVerified: string;          // ISO. 정보 마지막 확인일. 필수
  
  photos: {
    url: string;                 // /images/[city]/[id]/01.avif
    originalUrl?: string;        // 원본 백업 (B2B 라이선싱 대비)
    alt: { ko: string; en: string };
    exif?: { 
      lat?: number; 
      lng?: number; 
      takenAt?: string;
      camera?: string;           // "ILCE-7M5"
    };
  }[];
  
  affiliate?: {
    klookId?: string;
    gygId?: string;
    viatorId?: string;
    bookingHotelId?: string;
  };
  sources?: {
    naverBlogUrl?: string;
    instagramUrl?: string;
  };
};
```

#### Sony A7M5 + Lightroom 워크플로우 (참고용)

**촬영 시 GPS 기록**:
- Sony Creators' App을 폰에 설치 후 카메라와 블루투스 연결
- 폰 GPS가 자동으로 사진 EXIF에 박힘
- GPS 없는 사진은 Lightroom Map 모듈에서 수동 부여 (30초/사진)

**Lightroom Export 설정**:
- File Settings: JPEG, Quality 85, sRGB
- Image Sizing: Long Edge 2400px
- Metadata: 
  - Include: "All Except Camera Raw Info"
  - ★ **"Remove Location Info" 반드시 체크 해제** (체크되면 GPS 삭제됨)
  - Person Info 제거: 체크 (얼굴 인식 데이터 노출 방지)

**보안 주의**: 집에서 찍은 테스트 사진은 export 전 GPS 제거. 여행지 사진만 GPS 보존.

#### 📋 복붙 프롬프트

```
Sprint 3: 콘텐츠 데이터 파이프라인 + 이미지 워크플로우.

1. /content/schemas/spot.ts — 마스터 플랜 문서의 스키마 그대로 사용.
   (Part C의 Sprint 3 섹션에 TypeScript 타입 정의 있음)

2. /content/spots/tokyo/ 폴더 생성 + 샘플 스팟 5개 JSON
   (placeholder OK, 책킴이 나중에 채움)

3. /docs/lightroom-workflow.md 작성:
   - Sony A7M5 EXIF 기록 방법 (Creators' App + 블루투스)
   - Lightroom Export 설정 (Remove Location Info 체크 해제!)
   - 집 사진 GPS 제거 보안 주의
   
4. /scripts/process-image.ts:
   입력: Lightroom에서 export한 JPEG 폴더 경로 + city/spotId
   처리:
   - sharp로 AVIF/WebP 변환 (.withMetadata() 필수 — EXIF 보존)
   - 원본 JPEG는 /content/images-original/[city]/[spotId]/ 백업
   - 변환본은 /public/images/[city]/[spotId]/ 저장
   - EXIF에서 GPS, 촬영일, 카메라 모델 추출 → spot JSON 자동 주입
   - alt 텍스트 placeholder 자동 생성
   
   ★ 주의: sharp의 .withMetadata() 옵션이 빠지면 EXIF 삭제됨. 
   반드시 명시.

5. /scripts/naver-to-tripflowy.ts:
   입력: Naver 블로그 글 HTML 파일 경로
   출력: /content/guides/[city]/[slug].md (frontmatter + body)
   
   변환 규칙:
   - Naver 특유 광고/Klook 링크 섹션 제거
   - 이미지는 다운로드만 (process-image.ts 별도 실행)
   - H1/H2를 GEO 최적화 패턴으로 재배치 
     (첫 H2는 "Quick Answer", 그 아래 40-80단어 추출 청크)
   - frontmatter에 신뢰 프레이즈 자동 삽입
   - visitedAt 추정 (글 작성일 기준), lastVerified는 변환일(오늘)

6. /scripts/check-stale-spots.ts:
   /content/spots/ 전체 스캔, lastVerified 12개월 이상 지난 스팟 출력.
   CI/CD 빌드 경고로 사용.

7. /scripts/extract-spots.ts (Claude API 활용):
   Naver 글에서 스팟 정보(이름/주소/설명) 추출 → 
   /content/spots/[city]/ JSON으로 저장.

8. next.config.js:
   - images formats: ['image/avif', 'image/webp']
   - 원격 이미지 도메인 허용 리스트
   - generateStaticParams에 스팟 JSON 읽어 /spot/[id] 경로 자동 생성

9. 이미지 원본 백업 디렉토리 .gitignore 추가.
   /docs/image-backup-strategy.md에 백업 방법 문서화.

이 Sprint는 한 번에 끝내지 말고, 도쿄 스팟 3개로 end-to-end 검증 후 
나머지 진행.
```

---

### 🔗 Sprint 4: 허브 페이지 — 영문 우선 + 한국어 어댑테이션 (Week 3, 2일)

#### 왜 중요?

LLM이 "Wanderlog 대체재", "최고의 여행 플래너" 등의 fan-out 쿼리에 답할 때 비교 페이지와 용어집 페이지가 핵심 인용 대상. 영문 우선 작성 후 한국어 어댑테이션.

#### 작업 개요

- **비교 페이지 5개**: `/vs/wanderlog`, `/vs/mindtrip`, `/vs/layla`, `/vs/tripit`, `/vs/google-travel`
- **용어집 페이지 10개**: `/learn/...`
- **페르소나 페이지 5개**: `/for/solo`, `/for/family-with-kids` 등
- **대체재 페이지 3~5개**: `/alternatives/...`

#### 비교 페이지 풀 템플릿 (예: `/vs/wanderlog`)

영문 원본을 먼저 작성하고 한국어로 어댑테이션합니다. 아래는 Claude Code에게 보여줄 완성도 높은 템플릿.

**페이지 구조 예시 (영문)**:

```markdown
---
title: "TripFlowy vs Wanderlog: Curated Spots vs Blank Canvas (2026)"
description: "TripFlowy provides Check Kim's personally tested spots, while 
  Wanderlog gives you a blank canvas to research yourself. Here's when to 
  use each — based on real use cases."
dateModified: 2026-04-23
author: FOUNDER
---

# TripFlowy vs Wanderlog: Curated Spots vs Blank Canvas

> [추출 청크 60단어]
> TripFlowy and Wanderlog both help you plan trips, but they solve different 
> problems. Wanderlog gives you an empty itinerary builder and expects you 
> to bring your own spots from blogs and reviews. TripFlowy starts with 
> 200+ spots personally walked and tested by Check Kim, and matches them 
> to your trip conditions. If you already know where to go, Wanderlog is 
> faster. If you don't, TripFlowy saves hours of research.

## Quick Comparison

| Feature | TripFlowy | Wanderlog |
|---|---|---|
| Spot database | Curated (200+ verified) | User-added (blank canvas) |
| Itinerary generation | Matched from verified spots | Manual or AI-generated |
| Collaboration | V1.1 (coming soon) | Real-time multi-user |
| Pricing | Free | Free + Pro ($49.99/yr) |
| Offline | No | Yes (Pro) |
| Route verification | Field-tested by founder | User-dependent |
| Best for | First-time planners, Asia travel | Experienced travelers |

## When TripFlowy is Better

1. **First trip to Asia (especially Japan)** — Check Kim has tested 200+ 
   spots across 50+ cities. You don't need to research for 10 hours.
2. **Short planning window** — Get a working itinerary in 30 seconds, 
   not 3 days.
3. **With elderly parents or kids** — Filter by accessibility, and every 
   spot has verified info on duration and fatigue level.

## When Wanderlog is Better

1. **You already know where to go** — If you've done this trip before, 
   Wanderlog's blank canvas is faster.
2. **Group trip with real-time collaboration** — Wanderlog's multi-user 
   editing is mature. TripFlowy's collaboration ships in V1.1.

## FAQ

**Is TripFlowy a Wanderlog alternative?**
TripFlowy and Wanderlog solve adjacent problems. Wanderlog is an empty 
builder; TripFlowy is a curated database with matching. Many users use 
both — TripFlowy to discover spots, Wanderlog to collaborate.

**Is TripFlowy free like Wanderlog's free tier?**
Yes, TripFlowy's core matching is free. Wanderlog's free tier is also 
capable. Both monetize through affiliate bookings rather than subscription.

**Can I import TripFlowy itineraries into Wanderlog?**
Not directly today. You can copy spots manually. V1.1 will add export.

## Written by

{{FOUNDER author box with "책킴 (Check Kim)" and bio}}
```

**한국어 어댑테이션 핵심 원칙**:
- 영문 → 한국어는 "번역" 아님. "한국 여행자가 처음부터 쓴 것처럼" 재작성.
- "Wanderlog's blank canvas" → "Wanderlog의 빈 플래너"
- 한국 시장 맥락 추가 예: "네이버 블로그 검색 대신", "카카오 맵과 함께 쓸 때"

#### 용어집 페이지 풀 템플릿 (예: `/learn/what-is-a-curated-travel-platform`)

**페이지 구조 예시**:

```markdown
---
title: "What Is a Curated Travel Platform? (vs AI Planners, vs Blogs)"
description: "A curated travel platform uses personally verified spots 
  instead of AI-generated or user-submitted content. Here's how it 
  differs from AI trip planners and travel blogs."
---

# What Is a Curated Travel Platform?

> [추출 청크 55단어]
> A curated travel platform is a trip-planning tool built on spots that 
> have been personally visited and verified by a human editor — not 
> AI-generated suggestions or crowdsourced reviews. The value proposition: 
> every recommendation is field-tested. Examples include TripFlowy 
> (by Check Kim, 200+ Asian spots) and Atlas Obscura (editor-curated 
> unusual destinations).

## Three Types of Travel Planning Tools

### 1. AI Trip Planners (Mindtrip, Layla, Roam Around)
Use large language models to generate itineraries from training data. 
Fast, but prone to hallucinations — closed restaurants, mixed-up 
neighborhoods, generic "must-see" lists.

### 2. Blank Canvas Builders (Wanderlog, TripIt)
Give you an empty itinerary to fill from your own research. Flexible, 
but requires 5-10 hours of blog reading per trip.

### 3. Curated Platforms (TripFlowy, Atlas Obscura, Thatch)
Start with a verified spot database built by a human expert. Less 
flexibility, but zero hallucination risk and immediate usability.

## Why Curation Matters in 2026

- [통계 근거] Google's 2024 Helpful Content updates penalized AI-spun 
  travel content, with some sites losing 60-90% of traffic.
- [Skift 2024 consumer survey] Only single-digit % of travelers 
  "trust AI recommendations completely."
- [Rising counter-trend] Atlas Obscura, Afar, Thatch all grew by 
  leaning into human curation.

## How to Tell if a Platform Is Truly Curated

Three signals to look for:
1. **Named editor/creator with verifiable bio** (not "our team")
2. **Visit dates and verification dates per spot**
3. **Original photos with EXIF data** (not stock imagery)

## FAQ

**Is TripFlowy a curated platform?**
Yes. Every spot in TripFlowy is personally visited by Check Kim, 
with visited and last-verified dates displayed.

**Is curated better than AI?**
For travelers who value accuracy over speed: yes. For travelers 
with deep destination knowledge who just need an organizer: AI or 
blank-canvas tools can be faster.
```

#### 📋 복붙 프롬프트

```
Sprint 4: 허브 페이지 생성.

원칙:
- 한국어 원본 → 영어 어댑테이션 (번역 X)
- 어댑테이션은 "영어권 여행자가 처음부터 쓴 것처럼"
- 한국 맥락 교체 (예: "네이버 블로그 검색" → "endless Google searches")

1. 비교 페이지 5개 (/vs/...):
   각 페이지는 마스터 플랜 Part C Sprint 4의 
   "/vs/wanderlog 풀 템플릿"을 그대로 참고:
   - 상단 추출 청크 (40~80단어)
   - Quick Comparison 테이블
   - When TripFlowy is Better (3가지 시나리오)
   - When [Competitor] is Better (정직하게 2가지)
   - FAQ (3~5개)
   - Written by (FOUNDER author box)
   
   작성할 비교 페이지:
   - wanderlog: 큐레이션된 스팟 vs 빈 캔버스
   - mindtrip: 직접 검증 vs AI 생성
   - layla: 실제 여행자 vs 챗봇
   - tripit: 사전 플래닝 vs 예약 후 정리
   - google-travel: 여행 특화 vs 범용

2. 용어집 페이지 10개 (/learn/[slug]):
   각 페이지는 마스터 플랜의 
   "/learn/what-is-a-curated-travel-platform 풀 템플릿" 참고:
   - 추출 청크
   - 개념 정의 + 3~5가지 분류
   - 왜 중요한가 (데이터/통계)
   - 판별 방법 (3가지 신호)
   - FAQ
   
   초기 10개:
   - what-is-a-curated-travel-platform
   - how-to-plan-a-multi-city-trip
   - human-curated-vs-ai-generated-travel
   - travel-itinerary-vs-travel-guide
   - group-travel-planning-best-practices
   - solo-travel-itinerary-guide
   - family-travel-with-elderly-parents
   - budget-travel-planning
   - tokyo-neighborhood-guide
   - osaka-vs-kyoto-for-first-timers

3. 페르소나 페이지 5개 (/for/[persona]):
   solo, family-with-kids, with-parents, group-of-friends, budget
   
   각 페이지 구조:
   - 추출 청크
   - 이 페르소나의 핵심 pain points (3개)
   - TripFlowy가 어떻게 도와주는가 (3개)
   - 추천 도시 Top 3
   - FAQ

4. 대체재 페이지 3~5개 (/alternatives/[competitor]):
   wanderlog, tripit, mindtrip 대체재
   
   각 페이지 구조:
   - 추출 청크: "[Competitor]의 주요 대안 3개"
   - 대안 3~5개 비교 (TripFlowy 포함)
   - 각 대안의 Best for 시나리오

규칙 (모든 페이지):
- FAQPage JSON-LD 필수
- 추출 청크 상단 배치
- TRUST_PHRASES 자연스럽게 포함
- /content/brand.ts 상수 사용 (하드코딩 금지)
- hreflang 양방향
- Person author with alternateName 배열 (FOUNDER 사용)
- 포지셔닝: "큐레이션 vs AI 생성" 축으로 대조
- "AI가 아닙니다" 방어 프레이밍 금지
```

---

### 🔗 Sprint 5: Naver 메인 홈 링크 + 기존 Naver 글 처리 (Week 6+)

#### 왜 Week 6+?

Sprint A~4까지 사이트가 정돈된 후에 Naver 블로그 트래픽을 유입시켜야 전환율이 제대로 측정됩니다. Sprint A에서 홈 hero·히어로 카피가 개선된 상태에서 Naver → TripFlowy 유입을 시작하는 것이 맞음.

#### Sprint 5 시작 전 책킴이 판단할 것

다음 세 가지 중 현재 상태를 확인하세요:

1. **현재 Naver 블로그 활동 중인가?**
   - A. 활발히 새 글 발행 중
   - B. 간헐적으로만 발행
   - C. 사실상 휴면 상태

2. **기존 발행된 네이버 글 수는?**
   - 도쿄 관련 N개, 오사카 M개 등 대략적 분포

3. **이미 일정 트래픽이 있는 네이버 글이 있는가?**
   - 있다면 어느 글이 월 100+ 조회 이상인지

이 판단에 따라 Sprint 5 하위 작업이 달라져요.

#### 하위 작업 구조

Sprint 5는 두 개의 병렬 트랙으로 구성:

**트랙 A — 기존 Naver 글 처리 (한 번에 완료)**

이미 발행된 네이버 글에 TripFlowy 링크를 소급 추가. 우선순위 높은 트래픽 글부터.

#### 📋 트랙 A 복붙 프롬프트 (Claude Code 작업)

```
Sprint 5 트랙 A: 기존 Naver 블로그 글 처리 전략.

책킴이 /raw-content/naver-existing-posts.csv 파일에 다음 형식으로 
기존 글 목록 제공:
  naver_url, title, city, topic, estimated_monthly_views

1. /scripts/naver-retroactive-link.ts 생성:
   입력: CSV 파일
   처리:
   - 각 글의 도시·주제에 따라 해당 TripFlowy UTM 링크 생성
     (Sprint 1 utm-convention 참고)
   - 글별로 추가할 문구 3가지 변형 자동 생성:
     
     변형 1 (소프트):
     "이 글을 일정표로 만들고 싶으시면: [책킴의 검증된 스팟으로 
     자동 일정 만들기 →](tripflowy.com/?utm_source=naver_blog
     &utm_campaign=tokyo_3day&utm_content=[slug])"
     
     변형 2 (중간):
     "📌 이 글 정리 + 바로 쓸 수 있는 일정표: 
     TripFlowy 플래너 ([link])"
     
     변형 3 (CTA 강함):
     "✈️ 블로그 탭 10개 대신, 완성된 루트 1개로. 
     [Tripflowy에서 내 여행 일정 만들기 →](link)"
   
   출력: /raw-content/naver-retroactive-links.csv
   - 각 글별 3가지 변형 + UTM 포함 링크

2. 책킴이 이 CSV를 보고 글당 하나의 변형 선택 후 
   네이버 블로그에 직접 추가 (수동 작업)

3. 우선순위:
   - Priority 1: 월 100+ 조회 글부터
   - Priority 2: 도쿄/오사카 관련 글 (현재 TripFlowy가 서비스 중)
   - Priority 3: 나머지

4. 추가 위치는 글 하단 결론부 또는 중간 본문
   (상단은 광고처럼 보여 거부감)

5. GA4에서 utm_source=naver_blog 트래픽 모니터링 시작
```

**트랙 B — 향후 Naver 새 글용 링크 생성기 (자동화 도구)**

앞으로 쓸 모든 Naver 글에 일관된 UTM 링크를 달 수 있도록 CLI 도구 구축.

#### 📋 트랙 B 복붙 프롬프트 (Claude Code 작업)

```
Sprint 5 트랙 B: Naver 새 글용 자동 링크 생성기.

1. /scripts/naver-link-generator.ts 인터랙티브 CLI:
   
   실행 예시:
   $ npm run naver-link
   
   ? 어떤 도시야? tokyo
   ? 콘텐츠 타입? 3day / day-trip / food / neighborhood
   ? Naver 글 슬러그/ID? 2026_05_tokyo_3day_with_parents
   ? 어떤 CTA 톤? soft / medium / strong
   
   ✅ 클립보드에 복사됨:
   📌 이 글 정리 + 바로 쓸 수 있는 일정표:
   https://tripflowy.com/?utm_source=naver_blog
   &utm_medium=referral
   &utm_campaign=tokyo_3day
   &utm_content=2026_05_tokyo_3day_with_parents

2. /app/page.tsx 개선:
   - utm_source가 naver_blog인 경우, 한국어 콘텐츠 우선 표시
   - utm_campaign에 도시명 있으면 그 도시 페이지 CTA 부각
   
   목적: Naver 유저가 메인 홈에서 자기 관심사로 
   2-clicks 안에 도달.

3. Sprint 1의 분석 대시보드 확장:
   - Naver 블로그 레퍼럴 트래픽 (utm_source=naver_blog 필터)
   - utm_content(출처 글)별 트래픽 Top 10
   - Naver 유저 메인 홈 → 다음 페이지 이동 경로 분석
   - 각 글별 전환율 (가입 / 플래너 생성 / 어필리에이트 클릭)

4. /docs/canonical-rules.md:
   - TripFlowy가 primary source (self-canonical)
   - Naver 블로그 원문이 있는 글: 콘텐츠 하단에 
     "이 글의 네이버 블로그 원문: [링크]" 표시
     (Naver를 canonical로 두지 말 것)
   - Medium 재게시: canonical을 TripFlowy로

5. Naver 글 작성 가이드라인 /docs/naver-writing-guide.md:
   - 제목에 (2026) 연도 포함 (AI 슬롭과 구별)
   - 본문 중간~하단에 TripFlowy 링크 (상단 금지)
   - TripFlowy 설명 시 "책킴이 만든" 명시 (엔티티 통합 신호)
   - 사진 하단 "tripflowy.com 에디터 직접 촬영" 워터마크
```

---

### 🏛️ Sprint 6: 외부 권위 + Wikidata (Week 2, 반나절 Code + 책킴 3h)

#### 우선순위별 수동 작업

책킴의 수동 작업을 시간당 ROI 기준으로 정렬했어요. 위에서부터 순서대로 진행하세요.

**🥇 Tier 1 — 당장 오늘 (총 30분)**

1. **LinkedIn 프로필 업데이트** (5분)
   - 헤드라인: "책킴 (Check Kim) | Founder, TripFlowy"
   - About 섹션에 TripFlowy 소개 + tripflowy.com 링크
   - Experience에 TripFlowy Founder 추가 (2024~현재)

2. **Instagram @travelkkkim 바이오 업데이트** (3분)
   - "책킴 (Check Kim) · TripFlowy Founder · tripflowy.com"
   - 하이라이트에 TripFlowy 관련 리일 1개 추가

3. **YouTube @travelkkkim 채널 설명 업데이트** (5분)
   - 채널 설명에 TripFlowy 소개 + 링크 추가
   - 배너 이미지에 TripFlowy 로고 (선택)

4. **네이버 블로그 프로필 업데이트** (5분)
   - 프로필 설명에 "책킴 | Check Kim, TripFlowy Founder"
   - 프로필 링크에 tripflowy.com 추가

5. **Google Search Console + Bing Webmaster Tools 등록** (15분)
   - 영문 사이트 (`tripflowy.com`) 소유권 확인 (DNS TXT 또는 HTML 파일)
   - 한국어 사이트 (`tripflowy.com/ko`) 별도 속성 추가
   - sitemap.xml 제출
   - Bing Webmaster Tools에 Google Search Console 데이터 import

**🥈 Tier 2 — 이번 주 (총 1.5시간)**

6. **Wikidata 아이템 생성** (30분, Claude와 함께)
   
   다음 Claude 대화에서 이렇게 요청:
   
   > "지금 Wikidata 같이 만들어요. Chrome 확장으로 Wikidata.org 열어서 Person 아이템 + Organization 아이템 두 개 같이 작성해줘."
   
   Person 아이템 필드:
   - `label`: Check Kim
   - `also known as`: 책킴, Huiwon Kim, travelkkkim
   - `instance of`: human (Q5)
   - `occupation`: travel writer, travel blogger
   - `country of citizenship`: South Korea
   - `social media followed`: Instagram(@travelkkkim), YouTube
   - `notable work`: TripFlowy, 책킴은 트래블링
   
   Organization 아이템 필드:
   - `label`: TripFlowy
   - `also known as`: 트플
   - `instance of`: travel website, online service
   - `founder`: Check Kim (위 Person 아이템 링크)
   - `inception`: [실제 런칭 날짜]
   - `country`: South Korea
   - `official website`: https://tripflowy.com
   - `country of origin`: South Korea

7. **Crunchbase 프로필 생성** (30분)
   
   미리 준비할 것:
   - Person: Check Kim (프로필 사진, bio, LinkedIn 링크)
   - Organization: TripFlowy (로고, 짧은 소개, 창립일, Founder as Check Kim, HQ 위치)

8. **네이버 서치어드바이저 등록** (15분)
   - searchadvisor.naver.com 접속
   - 사이트 추가: tripflowy.com
   - 소유 확인 (HTML 파일 업로드)
   - sitemap.xml 제출
   - RSS 제출 (있다면)

9. **AlternativeTo.net 제출** (15분)
   - alternativeto.net 계정 생성
   - TripFlowy 프로필 제출 (카테고리: Travel Planning Software)
   - Wanderlog, Mindtrip, Layla, Roam Around, TripIt의 대체재로 submit

**🥉 Tier 3 — 이번 달 (총 1.5시간)**

10. **G2 + Capterra(Gartner Digital Markets) 프로필** (1시간)
    - gartner.com/digitalmarkets/submit 접속 (한 번 제출로 3개 사이트 게재)
    - 카테고리: Travel Management Software, Itinerary Management
    - 제품 설명, 스크린샷 5~10장, 기능 리스트, 가격 정보
    - 검증 이메일 대기 (1~3일)

11. **Product Hunt "Upcoming" 예약** (30분)
    - producthunt.com 계정 생성 (아직 없다면)
    - "Ship" 탭 → Upcoming Product 등록
    - Maker: Check Kim 본인
    - Hunter 섭외 (선택): 한국 테크 커뮤니티 관계자에게 DM

#### 📋 수동 작업 완료 후 Claude Code 복붙 프롬프트

```
Sprint 6 수동 작업 완료. /content/brand.ts의 FOUNDER.profiles를 
실제 URL로 교체:
- linkedin: "https://linkedin.com/in/check-kim-실제ID"
- crunchbase: "https://crunchbase.com/person/실제ID"
- wikidata: "https://wikidata.org/wiki/Q실제번호"

그리고 Organization 측 Wikidata URL도 추가:
- wikidataOrg: "https://wikidata.org/wiki/Q실제번호"

업데이트 후 모든 페이지의 Organization/Person 스키마 sameAs가 
새 URL을 포함하는지 확인.

푸터에 외부 링크 섹션 추가:
"Find us on: LinkedIn · Crunchbase · AlternativeTo · G2 · Wikidata"

추가로 Google Search Console에서 다음 URL 색인 요청:
- https://tripflowy.com/
- https://tripflowy.com/ko
- https://tripflowy.com/courses/tokyo/... (모든 근교 투어)
- 주요 가이드 글 전부

Bing Webmaster Tools에서도 동일하게 IndexNow API로 색인 요청.
```

---

### 🌆 Sprint 7: 도시 콘텐츠 확장 + 근교 1일 투어 (Week 3~8)

#### 의존성

Sprint 3(이미지 파이프라인) 완료 후에만 시작 가능.

#### Tier-S 도시 확장 순서 + 주차별 계획

| Week | 도시 | 작업 범위 | 예상 산출물 |
|------|------|---------|----------|
| 3-4 | 도쿄 (기존) | 근교 1일 투어 6개 + 기존 가이드 업데이트 | 페이지 6~10개 |
| 4-5 | 오사카 | 메인 + 근교 1일 투어 3개 | 페이지 8~12개 |
| 5-6 | 교토 | 메인 콘텐츠 | 페이지 5~8개 |
| 6 | 후쿠오카 | 메인 콘텐츠 | 페이지 5~7개 |
| 7 | 방콕 | 메인 콘텐츠 (책킴 Naver 소스 활용) | 페이지 5~8개 |
| 8 | 다낭 | 메인 콘텐츠 (책킴 Naver 소스 활용) | 페이지 4~6개 |

#### 도시당 콘텐츠 구성 가이드라인

각 도시마다 다음 유형의 페이지를 생성합니다:

**① 도시 메인 페이지 1개** — `/city/[city]` 또는 `/en/city/[city]`
- 도시 전반 소개 (추출 청크)
- 몇 박이 좋은지 가이드
- 계절별 추천
- 동네 개요 (3~5개 동네 소개)
- TripFlowy 플래너 CTA

**② 가이드 글 5~8개** — `/posts/[slug]`

도시당 우선 생성 주제 (책킴 전문성 기반):
- **테마파크/관광지** (책킴이 강함): 디즈니랜드, 유니버설, 전망대 등
- **공항 교통** (책킴 핵심 주제): 시내 이동, 환승, 교통패스
- **N박 N일 일정 가이드**: "오사카 3박4일 첫 방문자 코스" 등
- **음식점/카페**: 반드시 들러야 할 맛집 정리
- **쇼핑 가이드**: 면세, 기념품, 세일 시즌

**③ 동네 페이지 3~5개** — `/neighborhood/[city]/[slug]`

도시당 주요 동네 소개:
- 도쿄: Shibuya, Shinjuku, Asakusa, Harajuku, Ginza
- 오사카: Namba, Umeda, Shinsekai, Dotonbori
- 교토: Gion, Arashiyama, Higashiyama
- 후쿠오카: Tenjin, Hakata, Ohori Park 주변
- 방콕: Silom, Sukhumvit, Old Town, Ari
- 다낭: My An Beach, Son Tra, Hoi An (근교 확장)

**④ 근교 1일 투어** — `/courses/[city]/[slug]` (해당 도시만)

#### 오사카 메인 페이지 풀 템플릿 (예시)

```markdown
---
title: "Osaka Travel Guide 2026 — Namba, Dotonbori, Day Trips (Field-Tested)"
description: "Complete Osaka guide from 20+ trips to Japan: how many days 
  to stay, which neighborhoods to base yourself in, and day trips to Nara, 
  Himeji, and Koyasan — all personally tested by Check Kim."
---

# Osaka Travel Guide 2026 — Field-Tested by Check Kim

> [추출 청크 75단어]
> Osaka is Japan's food capital and a practical base for exploring Kansai. 
> Unlike Tokyo's sprawl, Osaka is compact — you can walk between Namba 
> and Shinsaibashi in 15 minutes. For first-timers, 3 nights is ideal: 
> 2 in Osaka proper, 1 day trip to Nara or Kyoto. This guide covers 
> where to stay (Namba vs Umeda), must-eat spots (beyond Dotonbori 
> clichés), and 3 verified day trips.

## How Many Days in Osaka?

| Trip Length | Recommended Split | Best For |
|---|---|---|
| 2 days | Osaka only, intense | Quick stopover |
| 3-4 days | 2 Osaka + 1-2 day trips | First-timers |
| 5+ days | 3 Osaka + Kyoto extension | Deep dive |

## Where to Stay: Namba vs Umeda

**Namba (추천 for most)**
- Food scene walking distance (Dotonbori, Kuromon Market)
- Direct subway to Universal, Shin-Osaka
- Lively at night, can be noisy

**Umeda (추천 for business, quiet)**
- Bigger hotels (Westin, Hilton, InterContinental)
- Shinkansen access via Shin-Osaka (5 min)
- Less touristy food

## Top Neighborhoods to Explore

1. **Namba & Dotonbori** — Food capital, Glico sign, street vendors
2. **Shinsaibashi** — Shopping, brands
3. **Tennoji & Shinsekai** — Retro Osaka, Tsutenkaku Tower
4. **Nakazakicho** — Hipster cafes, vintage shops (책킴 추천)
5. **Umeda** — Sky Building, department stores

## Day Trips from Osaka

1. **Nara** (40 min) — Deer + Todai-ji temple. [→ Full Nara guide]
2. **Himeji** (60 min) — Japan's most beautiful castle. [→ Full Himeji guide]
3. **Koyasan** (2.5 hrs) — Sacred mountain, temple stay. [→ Full Koyasan guide]

## Must-Try Food (Beyond Dotonbori Clichés)

- **Kushikatsu in Shinsekai** — Janjan Yokocho alley
- **Okonomiyaki in Fukushima** — not tourist traps
- **Ramen in Namba** — Kinryu vs Kamukura

## Getting Around

- **Osaka Amazing Pass** — 1-day ¥2,800, includes 40+ attractions
- **ICOCA card** — for subway, reusable in all Japan
- **Limousine Bus from KIX airport** — 60 min to Namba

## FAQ

**Is Osaka worth visiting if I'm going to Tokyo?**
Yes. Osaka offers what Tokyo can't — compact walkability, stronger food 
scene, and access to Kansai's historical sites (Nara, Kyoto, Himeji).

**Osaka vs Kyoto — which to prioritize?**
Kyoto for temples and traditional culture, Osaka for food and base for 
day trips. Combine both if you have 5+ days.

**Is Osaka safe at night?**
Dotonbori and Namba are tourist-friendly but crowded. Shinsekai is 
atmospheric but avoid solo late-night. Umeda is universally safe.

## Written by

{{FOUNDER author box}}
```

#### 근교 1일 투어 페이지 풀 템플릿 (예: 가와고에)

```markdown
---
title: "Kawagoe Day Trip from Tokyo — Edo Village, Kimono, Sweet Potato (2026)"
description: "Complete Kawagoe day trip from Tokyo: 30-minute train from 
  Ikebukuro to Edo-era streets, best kimono rental, Candy Alley, and 
  Sweet Potato specialties. Walked and verified by Check Kim."
---

# Kawagoe Day Trip from Tokyo

> [추출 청크 70단어]
> Kawagoe is a well-preserved Edo-era merchant town 30 minutes from 
> Ikebukuro Station. This day trip covers Candy Alley, Bell of Time, 
> Hikawa Shrine, and the best kimono rental spots — walked and tested 
> by Check Kim. Budget ~¥5,000 including transit, lunch, and rental. 
> Best visited spring-autumn, avoid Tuesday/Wednesday (many shops closed).

## Quick Facts

- **Travel time from Tokyo**: 30-50 min (Tobu Tojo Line from Ikebukuro)
- **Recommended duration**: 6-8 hours (full day)
- **Budget**: ¥5,000-8,000 per person
- **Best season**: March-November
- **Transit pass**: Kawagoe Discount Pass (¥700) — recommended

## Getting There

[실제 동선: Tobu Tojo Line vs Seibu Shinjuku Line 비교]
- Tobu Tojo Line from Ikebukuro: ¥480, 30 min (추천)
- Seibu Shinjuku Line: slightly longer, fewer transfers

## Morning (9:00-12:00): Ichibangai + Candy Alley

- Ichibangai street — Edo warehouses
- Candy Alley (菓子屋横丁) — traditional sweets
- [개인 팁] 9시 오픈런 하면 사진 잘 나옴, 10시 이후 인산인해

## Lunch (12:00-13:30): Unagi or Sweet Potato

추천 3곳:
1. **Kawagoe-ya Honten** — 장어덮밥 대표 ¥3,500
2. **Koedo Curry** — 고구마 카레 ¥1,200 (가성비)
3. **Imo-kōbo Kawagoe** — 고구마 정식 ¥1,800

## Afternoon (13:30-16:00): Hikawa Shrine + Bell of Time

- **Bell of Time (時の鐘)** — 상징 랜드마크
- **Hikawa Shrine** — 5개 소원 조약돌 풍습
- [개인 팁] 도보 15분, 중간에 Kawagoe Crown이라는 케이크집 추천

## Kimono Rental Tips

가게 비교:
- **Kawagoe Kimono Rental VASARA**: ¥3,500~5,000, 당일 반납 OK
- **Wargo**: 좀 더 고급, ¥4,500~
- [예약 권장] 주말 당일 방문 시 30분 웨이팅

## Evening (16:00-18:00): Return + Dinner Option

- Tobu Tojo Line 직행 → Ikebukuro 30분
- Ikebukuro 도착 후 저녁 추천: Mutekiya 라멘 or Sunshine City

## FAQ

- How far is Kawagoe from Tokyo?
- Is Kawagoe worth visiting?
- What's the best time to visit Kawagoe?
- Can you do Kawagoe and Tokyo same day?
- Kawagoe vs Kamakura — which is better?

## Tips From Check Kim's Multiple Visits

1. 화/수 피하기 (많은 가게 휴무)
2. 벚꽃 시즌(4월) 인파 2배, 단풍 시즌(11월) 1.5배
3. 사진은 오전이 최고 (오후 서쪽 광선 강함)
4. Candy Alley는 생각보다 짧음 (15분이면 완주)
5. 돌아오는 길 Ikebukuro에서 저녁 먹는 게 동선 효율적

## Affiliate

- **Kimono Rental**: Klook $30+ → [affiliate link]
- **Kawagoe Discount Pass**: GYG $7 → [affiliate link]

## Written by

{{FOUNDER author box}}
```

#### 도시별 롤아웃 파이프라인 (7단계)

각 도시당 ~1주 작업 순서:

1. 책킴이 `/raw-content/[도시]/` 에 한국어 원본 업로드
2. `naver-to-tripflowy.ts` 실행 → Markdown 생성
3. `extract-spots.ts` 실행 → 스팟 JSON 생성
4. `process-image.ts` 실행 → 이미지 AVIF 변환 + EXIF 보존
5. Claude Code가 영어 어댑테이션
6. 가이드 글 5~8개 + 동네 페이지 3~5개 + 근교 1일 투어 N개
7. 어필리에이트 링크 통합 + 배포

#### 📋 도쿄 근교 1일 투어 6개 복붙 프롬프트

```
Sprint 7 도쿄 근교 1일 투어: 6개 페이지 생성.

책킴이 /raw-content/courses/ 에 한국어 원본 업로드했다고 가정.
없으면 placeholder 구조 먼저 만들고 책킴이 나중에 채움.

6개 페이지:
/courses/tokyo/kawagoe           (에도 시대 마을, 기모노 체험)
/courses/tokyo/chichibu          (양귀비·벚꽃·단풍 시즌별)
/courses/tokyo/mt-fuji           (후지산 5합목, 가와구치코)
/courses/tokyo/nikko             (세계유산 사원, 가을 단풍)
/courses/tokyo/kamakura          (해변 + 대불 + 사찰)
/courses/tokyo/hakone            (온천 + 호수 + 후지산 뷰)

각 페이지는 마스터 플랜 Part C Sprint 7의 
"가와고에 근교 1일 투어 풀 템플릿"을 따라 작성:
- 상단 추출 청크 (40-80단어)
- Quick Facts (이동시간, 기간, 예산, 시즌, 교통패스)
- Getting There (실제 교통 옵션 비교)
- Morning / Lunch / Afternoon / Evening 시간대별 섹션
- Tips From Check Kim's Multiple Visits (5~8개 개인 경험)
- FAQ (5개)
- Affiliate 링크

규칙 (모든 페이지):
- Article + TravelGuide 듀얼 스키마
- FAQPage with speakable
- Person author with alternateName 배열
- visitedAt + lastVerified 표시 (Sprint 3 스키마 사용)
- hreflang 영문↔한국어
- rel="sponsored" on affiliate links
- AFFILIATE_DISCLOSURE 글 내부에 표시
- Sprint 3의 process-image.ts로 이미지 처리 완료 후 배치

완료 후:
- 각 페이지가 /llms.txt에도 리스트됨을 확인
- sitemap.xml에 추가되었는지 확인
- Google Search Console에서 색인 요청
```

#### 📋 오사카 메인 콘텐츠 복붙 프롬프트

```
Sprint 7 오사카 콘텐츠: 메인 페이지 + 가이드 5개 + 동네 3개 + 근교 3개.

구조:
1. /city/osaka 메인 페이지
   - 마스터 플랜의 "오사카 메인 페이지 풀 템플릿" 따라 작성
   - How Many Days / Where to Stay / Top Neighborhoods / Day Trips / 
     Food / Getting Around / FAQ

2. /posts/ 가이드 글 5개:
   - osaka-3-day-itinerary-first-time (3박 4일 첫 방문자)
   - osaka-food-guide-beyond-dotonbori (음식 가이드)
   - kansai-airport-to-osaka-guide (공항 교통)
   - osaka-with-kids-family-guide (가족 여행)
   - osaka-shopping-guide-2026 (쇼핑 가이드)

3. /neighborhood/osaka/ 동네 페이지 3개:
   - namba-dotonbori
   - umeda-kita
   - nakazakicho (책킴 추천 히든 동네)

4. /courses/osaka/ 근교 1일 투어 3개:
   - nara (사슴 + 세계유산 사원)
   - himeji (히메지 성)
   - koyasan (사찰 숙박 옵션)

책킴이 /raw-content/osaka/에 한국어 원본 업로드.
naver-to-tripflowy.ts + extract-spots.ts + process-image.ts 
순서로 실행.

규칙: 모든 페이지에 Sprint 3 스키마 적용, 마스터 플랜 Part C의 
해당 템플릿 따를 것.
```

---

### 🚀 V1.1: 협업 기능 (3개월 후)

#### 진입 조건 (이 중 3개 이상 달성 시 V1.1 시작)

V1을 충분히 안정화한 뒤에 협업 기능을 시작해야 합니다. 다음 중 3개 이상 달성되면 V1.1 착수:

1. **📊 GEO 지표**: LLM 답변의 10개 핵심 쿼리 중 TripFlowy 언급 빈도 30% 이상 (Sprint 1 분석 대시보드에서 확인)

2. **📈 월간 활성 사용자**: 월 1,000명 이상 유니크 플래너 사용

3. **💰 어필리에이트 매출**: 월 $500 이상 꾸준히 발생 (근교 1일 투어가 주 수익원)

4. **🏛️ 외부 권위**: Wikidata, G2, Crunchbase, AlternativeTo 프로필 모두 안정화 + 최소 5개 리스티클에 TripFlowy 포함

5. **🏙️ 도시 커버리지**: Tier-S 6개 도시(도쿄/오사카/교토/후쿠오카/방콕/다낭) 메인 콘텐츠 완료

#### V1.1 첫 Sprint (Sprint 8) 스케치

V1.1 시작 시점에 작성할 Sprint 8의 구조:

**Sprint 8 목표**: 그룹 여행 기본 협업 (초대 + 투표)

**하위 작업**:
- 그룹 생성 (`/trips/[tripId]/group`)
- 초대 링크 생성 (이메일 없이 URL 공유로 가입)
- 스팟 스와이프 투표 (Tinder-style UI)
- 결과 집계 + "우리 그룹 일정" 생성
- 카카오톡 공유 딥링크 (한국 필수)
- Slack/WhatsApp/Instagram DM 공유 지원

**Sprint 9 목표**: 실시간 협업 편집
- Supabase Realtime 또는 Yjs 기반
- 동시 편집, 커서 표시
- 역할 기반 권한 (주최자/참여자/뷰어)

**Sprint 10 목표**: 네이버 지도 "저장한 장소" 연동
- 한국 사용자 핵심 기능
- Naver Maps API 통합
- 내 저장 장소 → TripFlowy 일정 가져오기

#### V1.1 착수 전 책킴이 결정할 것

- **Tier 1 파트너**: KAL? Klook? MyRealTrip? 기존 관계 활용 여부
- **베타 유저 풀**: 제로투원 그룹? Naver 블로그 독자?
- **가격 정책**: 무료 유지? 프로 티어 도입?

이 부분은 3개월 후 시점에 시장 상황 보고 판단.

---

## Part D — 세션 관리 팁

### D.1 Sprint 시작 시

Part A Kickoff 블록 복붙 후:

#### 📋 Sprint 시작 복붙 프롬프트

```
.progress.md를 확인해줘. 이번 세션은 Sprint [번호]를 진행할 거야.
/docs/tripflowy-master-plan.md의 해당 Sprint 섹션을 읽고 시작해줘.

필요한 디렉토리의 AGENTS.md만 읽고, 루트 AGENTS.md는 
필요 시에만 (컨텍스트 절약).
```

### D.2 Sprint 종료 시

#### 📋 Sprint 종료 복붙 프롬프트

```
이번 세션 작업을 .progress.md에 기록해줘:
- 완료된 작업
- 부분 완료/미완료된 작업
- 다음 세션에서 이어갈 컨텍스트
- 막혔던 부분이나 결정 필요 사항

생성/수정한 파일 목록도 함께.
마지막으로 Part F 체크리스트 실행해줘.
```

### D.3 월간 포지셔닝 감사

매월 1일에 실행 권장.

#### 📋 월간 감사 복붙 프롬프트

```
/content/brand.ts의 forbiddenPhrases를 읽고 grep해줘:

영문 금지: "AI travel planner", "AI-powered planner", 
          "GPT-based", "auto-generates plans",
          "Stop scrolling blogs"
한국어 금지: "AI가 짜주는", "AI 자동 추천 플래너", 
            "GPT 기반", "자동 생성 플래너",
            "블로그 그만 보세요", "유튜브 그만 보세요"

발견되면 위치와 수정 제안 보고.

추가 확인:
- 모든 Person 스키마 alternateName 배열로 4개 이상 
  (Check Kim, 책킴, travelkkkim, Huiwon Kim)
- 신뢰 프레이즈 (TRUST_PHRASES)가 최근 3개월 발행 글마다 1개+
- 어필리에이트 링크 rel="sponsored" 또는 rel="nofollow sponsored"
- 새 가이드 글 lastVerified 12개월 이내
- jobTitle이 "TripFlowy Founder" 통일 (창업자 한국어 표기 제거)
- "Patrick Kim" 표기가 사이트에 남아있지 않은지 
  (alternateName 배열에 포함 X, 완전 폐기)
```

### D.4 Skill로 만들면 좋은 반복 작업

Claude Code의 Skill 기능으로 저장해두면 편리한 작업들:

- **Naver 블로그 변환**: Sprint 3 `naver-to-tripflowy.ts` 호출
- **새 스팟 추가 검증**: 스키마 + lastVerified 자동 설정
- **Sprint 종료 체크리스트**: Part F 실행
- **월간 포지셔닝 감사**: D.3 실행
- **이미지 처리**: Lightroom export → AVIF/WebP + EXIF
- **새 가이드 글 발행 전 체크**: JSON-LD + 추출 청크 + author 확인

---

## Part E — 우선순위 타임라인

| 시기 | Sprint | 작업 | 시간 |
|------|--------|------|------|
| **Week 1 초** | Sprint 0 | AGENTS.md 구조 + /content/brand.ts 생성 | 0.5d |
| **Week 1** | Sprint A | 즉시 픽스 12개 | ~12h |
| **Week 2** | Sprint 1 | 분석 인프라 + UTM 표준 | 1d |
| **Week 2** | Sprint 3 | 이미지 파이프라인 + 스팟 스키마 | 2~3d |
| **Week 2** | Sprint 6 | 외부 권위 + Wikidata (Claude와 함께) | 0.5d + 3h |
| **Week 3** | Sprint 4 | 허브 페이지 (영문 우선) | 2d |
| **Week 3-4** | Sprint 7 (도쿄) | 근교 1일 투어 6개 | 1주 |
| **Week 4-5** | Sprint 7 (오사카) | 메인 + 근교 1일 투어 3개 | 1주 |
| **Week 5-6** | Sprint 7 (교토) | 메인 콘텐츠 | 1주 |
| **Week 6** | Sprint 7 (후쿠오카) + Sprint 5 | 후쿠오카 + Naver 링크 | 1주 |
| **Week 7-8** | Sprint 7 (방콕, 다낭) | 메인 콘텐츠 | 2주 |
| **3개월 후** | V1.1 | 협업 기능 (진입 조건 3개 이상 달성 시) | 별도 |

**Sprint 2는 의도적으로 비어있음** — 기존 사이트에 이미 구현되어 skip.

---

## Part F — Sprint 종료 체크리스트

매 Sprint 종료 시 Claude Code에 이 체크리스트로 검증 요청.

#### 📋 체크리스트 복붙 프롬프트

```
방금 작업 완료. 다음 체크리스트로 검증해줘:

[브랜드 일관성]
- [ ] 브랜드 문구 /content/brand.ts에서 import? (하드코딩 없음)
- [ ] 금지 표현 (forbiddenPhrases) 사용 안 됨?
  - "AI planner", "AI가 짜주는", "블로그 그만 보세요" 등
- [ ] 신뢰 프레이즈 (TRUST_PHRASES) 자연스럽게 포함?

[엔티티 일관성]
- [ ] Person 스키마 alternateName이 배열로 4개 이상?
- [ ] author 박스에 한·영 이름 모두 표기 ("책킴 (Check Kim)" 등)?
- [ ] jobTitle이 "TripFlowy Founder" 통일?
- [ ] sameAs 배열에 profiles.instagram (@travelkkkim) 포함?
- [ ] "Patrick Kim" 표기가 어디에도 없는가?

[기술 GEO]
- [ ] 새 페이지에 JSON-LD 스키마 (Article + TravelGuide 등)?
- [ ] 새 페이지 상단에 추출 청크 (40~80단어)?
- [ ] hreflang 양방향 (en↔ko + x-default)?
- [ ] sitemap에 새 페이지 등록?
- [ ] FAQPage 스키마 (해당 시)?

[콘텐츠 품질]
- [ ] H2가 자연스러운 질문 형태 (LLM fan-out 매칭)?
- [ ] 정량적 사실 + 비교 표현 포함?
- [ ] 개인 경험 진술 ("from multiple visits", "여러 번 다녀온")?
- [ ] visitedAt + lastVerified 표시 (스팟/가이드)?
- [ ] 영어 버전이 "번역체"가 아니라 어댑테이션인가?
  (예: "가성비" → "bang for your buck", NOT "cost-effective")

[블로거 존중]
- [ ] "블로그 그만 보세요" 같은 공격적 카피 없음?
- [ ] TripFlowy가 "큐레이터/정리자" 포지션으로 읽히는가?

[수익화]
- [ ] 어필리에이트 링크 rel="sponsored"?
- [ ] 어필리에이트 링크 UTM (utm_source=tripflowy)?
- [ ] FTC affiliate disclosure 표시?

[이미지]
- [ ] EXIF 보존 (sharp .withMetadata())?
- [ ] alt 텍스트 한국어/영어 모두?
- [ ] AVIF/WebP 변환?

[측정]
- [ ] 새 페이지 GA4에서 보이는지?
- [ ] 분석 대시보드에 트래픽 잡히는지?

[문서]
- [ ] .progress.md 업데이트?
- [ ] 새 결정사항을 AGENTS.md 또는 /docs/에 기록?
```

---

## Part G — 사전 결정 체크 (모두 완료)

책킴이 v4.2까지 결정 완료된 사항:

- ✅ `/courses` 전략: robots.txt 차단 해제 + 내비게이션 제거 + 근교 1일 투어 특화
- ✅ 영문/한국어: 한국어 원본 → 영어 어댑테이션 (Claude Code 담당)
- ✅ Wikidata: Sprint 6에서 Claude와 함께 세팅
- ✅ Bio: 일본 20+ 유지 + 아시아 15개국 50개 도시로 확장
- ✅ jobTitle: "TripFlowy Founder"로 한·영 통일
- ✅ Profiles: 한국어 SNS(@travelkkkim 인스타·유튜브) 포함
- ✅ 히어로 카피: 블로거 친화 방향 ("블로그·유튜브, 정리된 여행 루트로")
- ✅ 이름 체계: 책킴(한국어 primary) / Check Kim(영문 primary) / Huiwon Kim(법적) / Patrick Kim 완전 폐기
- ✅ 기존 Naver 글 처리: Sprint 5 트랙 A에서 소급 링크 추가
- ✅ Sprint 6 외부 권위: 3-tier 우선순위로 진행

**Sprint 0 시작 전 필요한 것**: 없음. 바로 Part A Kickoff 블록으로 Claude Code 첫 세션 시작.

---

## 🎯 기대 효과 (12주 후)

이 v4.2 마스터 플랜대로 진행하면:

- ✅ GEO 기본기 88 → 95+ 점
- ✅ Tier-S 6개 도시 영문 콘텐츠 + **근교 1일 투어 9개** (도쿄 6 + 오사카 3)
- ✅ Wikidata + AlternativeTo + G2 + Crunchbase 외부 권위 안정화
- ✅ 분석 인프라로 효과 측정 가능 (Sprint 1)
- ✅ 어필리에이트 수익 파이프라인 가동 (근교 Day Tour가 최고 수익성, 8% 커미션)
- ✅ 블로거·유튜버 친화 포지셔닝으로 향후 B2B 협업 여지 확보
- ✅ 이미지 파이프라인으로 Sony A7M5 원본 자산 GEO 활용 가능
- ✅ 책킴(Check Kim) 엔티티가 LLM에서 통합 인식 (한국어/영문 자산 합산)
- ✅ 기존 Naver 글 → TripFlowy 소급 트래픽 파이프라인 가동
- ✅ V1.1 협업 기능 착수를 위한 명확한 지표 기반 진입 조건 마련

V1.1 협업 기능은 3개월 후 진입 조건 3개 이상 달성 시점에 Sprint 8~10으로 빌드합니다.

---

**END OF v4.2 MASTER PLAN**
