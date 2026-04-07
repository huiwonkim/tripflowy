import type { CityInfo } from "@/types";

export const cityInfos: CityInfo[] = [
  {
    cityId: "danang",
    budget: [
      { category: { en: "Flights (round trip)", ko: "항공권 (왕복)" }, min: 200, max: 450, currency: "USD" },
      { category: { en: "Accommodation (per night)", ko: "숙소 (1박)" }, min: 30, max: 120, currency: "USD" },
      { category: { en: "Food (per day)", ko: "식비 (1일)" }, min: 15, max: 40, currency: "USD" },
      { category: { en: "Tours & activities", ko: "투어 & 액티비티" }, min: 10, max: 45, currency: "USD" },
      { category: { en: "Local transport (per day)", ko: "현지 교통비 (1일)" }, min: 5, max: 15, currency: "USD" },
    ],
    faq: [
      { question: { en: "Do I need a visa for Vietnam?", ko: "베트남 비자가 필요한가요?" }, answer: { en: "Most nationalities can get a 30-day e-visa online. Korean passport holders get 45 days visa-free.", ko: "대부분의 국적은 30일 전자비자를 온라인으로 받을 수 있습니다. 한국 여권 소지자는 45일 무비자입니다." } },
      { question: { en: "What currency should I bring?", ko: "어떤 통화를 가져가야 하나요?" }, answer: { en: "Vietnamese Dong (VND). Exchange at the airport or local gold shops for best rates.", ko: "베트남 동(VND). 공항이나 현지 골드숍에서 환전하면 좋습니다." } },
      { question: { en: "Is Grab available in Da Nang?", ko: "다낭에서 그랩을 쓸 수 있나요?" }, answer: { en: "Yes, Grab works well in Da Nang and for trips to Hoi An. Much cheaper than hotel taxis.", ko: "네, 다낭과 호이안 이동 시 그랩이 잘 작동합니다." } },
    ],
  },
  {
    cityId: "bangkok",
    budget: [
      { category: { en: "Flights (round trip)", ko: "항공권 (왕복)" }, min: 180, max: 400, currency: "USD" },
      { category: { en: "Accommodation (per night)", ko: "숙소 (1박)" }, min: 20, max: 80, currency: "USD" },
      { category: { en: "Food (per day)", ko: "식비 (1일)" }, min: 10, max: 25, currency: "USD", note: { en: "Street food is very affordable", ko: "길거리 음식은 매우 저렴" } },
      { category: { en: "Tours & activities", ko: "투어 & 액티비티" }, min: 10, max: 30, currency: "USD" },
      { category: { en: "Local transport (per day)", ko: "현지 교통비 (1일)" }, min: 3, max: 10, currency: "USD", note: { en: "BTS + boats + Grab", ko: "BTS + 보트 + 그랩" } },
    ],
    faq: [
      { question: { en: "Is Bangkok safe for solo travelers?", ko: "방콕은 혼자 여행하기 안전한가요?" }, answer: { en: "Yes, Bangkok is very safe for solo travelers. Stick to well-lit areas at night and use registered taxis/Grab.", ko: "네, 방콕은 혼자 여행하기 매우 안전합니다." } },
      { question: { en: "What's the best way to get around?", ko: "이동은 어떻게 하나요?" }, answer: { en: "BTS Skytrain for main areas, river boats for riverside attractions, Grab for everywhere else.", ko: "주요 지역은 BTS, 강변 명소는 보트, 나머지는 그랩." } },
      { question: { en: "Is Chatuchak only on weekends?", ko: "짜뚜짝 시장은 주말에만 열리나요?" }, answer: { en: "The full market only opens on weekends (Sat-Sun). Weekday sections are limited.", ko: "전체 시장은 주말(토-일)에만 열립니다." } },
    ],
  },
  {
    cityId: "bali",
    budget: [
      { category: { en: "Flights (round trip)", ko: "항공권 (왕복)" }, min: 250, max: 550, currency: "USD" },
      { category: { en: "Accommodation (per night)", ko: "숙소 (1박)" }, min: 25, max: 100, currency: "USD" },
      { category: { en: "Food (per day)", ko: "식비 (1일)" }, min: 15, max: 40, currency: "USD" },
      { category: { en: "Tours & activities", ko: "투어 & 액티비티" }, min: 20, max: 65, currency: "USD" },
      { category: { en: "Local transport (per day)", ko: "현지 교통비 (1일)" }, min: 8, max: 20, currency: "USD", note: { en: "Scooter rental or private driver", ko: "스쿠터 렌트 또는 프라이빗 드라이버" } },
    ],
    faq: [
      { question: { en: "Do I need a visa for Bali?", ko: "발리 비자가 필요한가요?" }, answer: { en: "Most nationalities can get a 30-day visa on arrival ($35). Korean passport holders get 30 days visa-free.", ko: "대부분의 국적은 도착 비자 30일($35). 한국 여권 소지자는 30일 무비자입니다." } },
      { question: { en: "Is it safe to rent a scooter?", ko: "스쿠터 대여가 안전한가요?" }, answer: { en: "If you're not confident, hire a private driver ($30-50/day) instead.", ko: "자신 없으면 프라이빗 드라이버($30-50/일)를 고용하세요." } },
      { question: { en: "How fit do I need to be for Mt. Batur?", ko: "바투르 산 체력이 많이 필요한가요?" }, answer: { en: "Moderate fitness is enough. It's a 2-hour uphill hike on a marked trail.", ko: "보통 체력이면 충분합니다. 표시된 등산로를 따라 2시간 오르막." } },
    ],
  },
];

export function getCityInfo(cityId: string): CityInfo | undefined {
  return cityInfos.find((c) => c.cityId === cityId);
}
