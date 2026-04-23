// /content/brand.ts
//
// Single source of truth for all brand-facing strings.
// Never hardcode these values in components, metadata, or JSON-LD — import them.
// Sprint 0 (2026-04-23) generated this file from docs/tripflowy-master-plan.md Part B.

export const BRAND = {
  name: "TripFlowy",
  alternateNames: ["트플"],
  domain: "tripflowy.com",

  // Category definition — used in JSON-LD and meta descriptions
  categoryEn: "Human-curated travel itinerary platform",
  categoryKo: "사람이 직접 큐레이션한 여행 일정 플랫폼",

  // Forbidden phrases (auto-detect with grep during reviews)
  forbiddenPhrases: {
    en: [
      "AI travel planner",
      "AI-powered planner",
      "GPT-based",
      "auto-generates plans",
      "Stop scrolling blogs", // respect bloggers
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

  // Allowed engine descriptions (for technical copy, NOT hero)
  allowedEngineDescription: {
    en: ["smart matching", "intelligent matching", "preference-matching engine"],
    ko: ["스마트 매칭", "조건 매칭", "맞춤 매칭"],
  },
} as const;

export const FOUNDER = {
  // Public-facing primary names
  nameKo: "책킴",
  nameEn: "Check Kim",

  // Legal name (business registration, contracts)
  legalName: "Huiwon Kim",

  // For LLM entity resolution — always emit as an array
  alternateName: [
    "Check Kim",
    "책킴",
    "travelkkkim",
    "Huiwon Kim",
    "Chaekkim",
  ],

  // Korean keeps "Founder" in English inside the Korean string (brand consistency)
  jobTitleEn: "Founder, TripFlowy · Travel Creator",
  jobTitleKo: "TripFlowy Founder · 여행 크리에이터",

  // Bio — Japan authority + Asia-wide expansion + day-trip angle
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

  // Profile URLs (sameAs) — some are [TODO], to be filled in Sprint 6.
  // Filter out [TODO] entries before emitting JSON-LD in production pages.
  profiles: {
    instagram: "https://instagram.com/travelkkkim",
    naverBlog: "https://blog.naver.com/[TODO]",
    youtube: "https://youtube.com/@travelkkkim",
    linkedin: "https://linkedin.com/in/[TODO]",
    crunchbase: "https://crunchbase.com/person/[TODO]",
    wikidata: "https://wikidata.org/wiki/[TODO]",
  },

  // Trust stats (used in home hero and author boxes)
  stats: [
    { ko: "일본 20+ 방문 · 아시아 15개국 50+ 도시", en: "20+ trips to Japan · 15+ countries, 50+ cities in Asia" },
    { ko: "2025년 비행기 64회", en: "64 flights in 2025" },
    { ko: "검증 스팟 200+", en: "200+ verified spots" },
  ],
} as const;

// Meta descriptions (40–80 word extraction chunks)
export const META_DESCRIPTIONS = {
  homeKo: "직접 다녀온 사람이 검증한 여행 일정 템플릿. 도시·기간·스타일을 입력하면 실제로 걸어보고 검증된 하루 코스로 맞춤 일정을 만들어드립니다.",
  homeEn: "Verified travel itinerary templates from a real traveler. Tell us your destination, duration, and style — we match you with day-by-day routes that have been walked and tested in person.",

  plannerKo: "여행지·기간·스타일을 입력하면 책킴이 직접 검증한 스팟으로 하루 코스 기반 일정을 짜드립니다. 회원가입 없이, 양식 작성 없이, 기다림 없이.",
  plannerEn: "Enter your destination, duration, and travel style to get a day-by-day itinerary built from spots Check Kim has personally walked and tested. No accounts, no forms, no waiting.",

  dayTripsKo: "도시 근교로 떠나는 당일치기 여행 코스. 실제 동선, 이동 시간, 시즌별 추천, 교통 패스까지 책킴이 직접 다녀와 정리한 1일 루트.",
  dayTripsEn: "Day trips from major Asian cities. Real routes, travel times, seasonal recommendations, and transit passes — all walked and tested by Check Kim.",
} as const;

// Hero copy — respects bloggers/YouTubers as fellow creators
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
} as const;

// Comparison section H2 (English pattern retro-applied to Korean)
export const COMPARISON_HEADINGS = {
  ko: "AI 생성 일정 vs 현장 검증 코스",
  en: "AI-Generated Plans vs Field-Tested Routes",
} as const;

// Trust-signal phrases — every guide must use at least one naturally
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
} as const;

// Affiliate disclosure (FTC-compliant)
export const AFFILIATE_DISCLOSURE = {
  ko: "제휴 공개: 일부 링크를 통해 소정의 수수료를 받을 수 있으며, 이용자에게 추가 비용은 없습니다. 직접 방문하고 검증한 곳만 추천합니다.",
  en: "Affiliate Disclosure: Some links on this site are affiliate links — we may earn a small commission if you book through them, at no additional cost to you. We only recommend tours and accommodations we've personally tested.",
} as const;
