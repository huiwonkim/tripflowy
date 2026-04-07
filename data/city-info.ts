import type { CityInfo } from "@/types";

export const cityInfos: CityInfo[] = [
  {
    cityId: "danang",
    info: {
      visa: { en: "E-visa available (30 days). Many nationalities visa-free for 15-45 days.", ko: "한국 여권 45일 무비자. 대부분 국적 30일 전자비자 가능." },
      timezone: { en: "UTC+7 (Indochina Time)", ko: "한국보다 2시간 느림 (UTC+7)" },
      currency: { en: "Vietnamese Dong (VND)", ko: "베트남 동 (VND)" },
      language: { en: "Vietnamese", ko: "베트남어" },
      voltage: { en: "220V, 50Hz. Type A/C/G plugs.", ko: "220V, 50Hz. 한국 플러그 사용 가능." },
      climate: {
        tempHigh: [25, 26, 28, 31, 33, 34, 34, 34, 32, 29, 27, 25],
        tempLow:  [19, 20, 22, 24, 25, 26, 26, 25, 24, 23, 22, 20],
        rain:     [96, 33, 22, 27, 62, 87, 86, 103, 350, 613, 366, 199],
      },
      bestMonths: [2, 3, 4, 5, 6, 7, 8],
    },
    faq: [
      { question: { en: "Do I need a visa for Vietnam?", ko: "베트남 비자가 필요한가요?" }, answer: { en: "Most nationalities can get a 30-day e-visa online. Korean passport holders get 45 days visa-free.", ko: "대부분의 국적은 30일 전자비자를 온라인으로 받을 수 있습니다. 한국 여권 소지자는 45일 무비자입니다." } },
      { question: { en: "What currency should I bring?", ko: "어떤 통화를 가져가야 하나요?" }, answer: { en: "Vietnamese Dong (VND). Exchange at the airport or local gold shops.", ko: "베트남 동(VND). 공항이나 현지 골드숍에서 환전." } },
      { question: { en: "Is Grab available in Da Nang?", ko: "다낭에서 그랩을 쓸 수 있나요?" }, answer: { en: "Yes, Grab works well in Da Nang and for trips to Hoi An.", ko: "네, 다낭과 호이안 이동 시 그랩이 잘 작동합니다." } },
    ],
  },
  {
    cityId: "bangkok",
    info: {
      visa: { en: "Visa-free for most nationalities (30-90 days).", ko: "한국 여권 90일 무비자." },
      timezone: { en: "UTC+7 (Indochina Time)", ko: "한국보다 2시간 느림 (UTC+7)" },
      currency: { en: "Thai Baht (THB)", ko: "태국 바트 (THB)" },
      language: { en: "Thai", ko: "태국어" },
      voltage: { en: "220V, 50Hz. Type A/B/C plugs.", ko: "220V, 50Hz. 한국 플러그 대부분 사용 가능." },
      climate: {
        tempHigh: [32, 33, 34, 35, 34, 33, 33, 33, 32, 32, 32, 31],
        tempLow:  [21, 23, 25, 26, 26, 25, 25, 25, 25, 24, 23, 21],
        rain:     [9, 30, 29, 65, 220, 149, 155, 197, 344, 242, 48, 10],
      },
      bestMonths: [11, 12, 1, 2, 3],
    },
    faq: [
      { question: { en: "Is Bangkok safe for solo travelers?", ko: "방콕은 혼자 여행하기 안전한가요?" }, answer: { en: "Yes, very safe. Stick to well-lit areas at night and use Grab.", ko: "네, 매우 안전합니다. 밤에는 밝은 곳에 머무르고 그랩을 이용하세요." } },
      { question: { en: "What's the best way to get around?", ko: "이동은 어떻게 하나요?" }, answer: { en: "BTS Skytrain for main areas, river boats for riverside, Grab for everywhere else.", ko: "주요 지역은 BTS, 강변 명소는 보트, 나머지는 그랩." } },
    ],
  },
  {
    cityId: "bali",
    info: {
      visa: { en: "Visa on arrival ($35, 30 days) for most nationalities.", ko: "한국 여권 30일 무비자. 대부분 국적 도착 비자 $35." },
      timezone: { en: "UTC+8 (Central Indonesia Time)", ko: "한국보다 1시간 느림 (UTC+8)" },
      currency: { en: "Indonesian Rupiah (IDR)", ko: "인도네시아 루피아 (IDR)" },
      language: { en: "Indonesian / Balinese", ko: "인도네시아어 / 발리어" },
      voltage: { en: "230V, 50Hz. Type C/F plugs.", ko: "230V, 50Hz. 한국 플러그 어댑터 필요." },
      climate: {
        tempHigh: [30, 30, 31, 31, 31, 30, 29, 30, 30, 31, 31, 30],
        tempLow:  [24, 24, 24, 24, 24, 23, 23, 23, 23, 24, 24, 24],
        rain:     [345, 274, 234, 88, 93, 53, 55, 25, 47, 63, 179, 276],
      },
      bestMonths: [4, 5, 6, 7, 8, 9, 10],
    },
    faq: [
      { question: { en: "Do I need a visa for Bali?", ko: "발리 비자가 필요한가요?" }, answer: { en: "Most nationalities: visa on arrival ($35, 30 days). Korean passport: 30 days visa-free.", ko: "한국 여권 30일 무비자. 대부분 국적 도착 비자 $35." } },
      { question: { en: "Is it safe to rent a scooter?", ko: "스쿠터 대여가 안전한가요?" }, answer: { en: "If not confident, hire a private driver ($30-50/day).", ko: "자신 없으면 프라이빗 드라이버($30-50/일)를 고용하세요." } },
    ],
  },
  {
    cityId: "tokyo",
    info: {
      visa: { en: "Visa-free for most nationalities (90 days).", ko: "한국 여권 90일 무비자." },
      timezone: { en: "UTC+9 (Japan Standard Time)", ko: "한국과 시차 없음 (UTC+9)" },
      currency: { en: "Japanese Yen (JPY)", ko: "일본 엔 (JPY)" },
      language: { en: "Japanese", ko: "일본어" },
      voltage: { en: "100V, 50/60Hz. Type A plugs. Adapter needed for most.", ko: "100V, 50/60Hz. 한국 플러그 어댑터 필요." },
      climate: {
        tempHigh: [10, 10, 14, 19, 23, 26, 30, 31, 27, 22, 17, 12],
        tempLow:  [1, 2, 5, 10, 15, 19, 23, 24, 21, 15, 9, 4],
        rain:     [52, 56, 118, 125, 138, 168, 154, 168, 210, 198, 93, 51],
      },
      bestMonths: [3, 4, 5, 10, 11],
    },
    faq: [],
  },
  {
    cityId: "paris",
    info: {
      visa: { en: "Schengen visa rules. Many nationalities visa-free for 90 days.", ko: "한국 여권 90일 무비자 (쉥겐 협정)." },
      timezone: { en: "UTC+1 (CET) / UTC+2 summer", ko: "한국보다 8시간 느림 (여름 7시간)" },
      currency: { en: "Euro (EUR)", ko: "유로 (EUR)" },
      language: { en: "French", ko: "프랑스어" },
      voltage: { en: "230V, 50Hz. Type C/E plugs.", ko: "230V, 50Hz. 한국 플러그 어댑터 필요." },
      climate: {
        tempHigh: [7, 8, 12, 16, 20, 23, 25, 25, 21, 16, 11, 7],
        tempLow:  [2, 2, 5, 7, 11, 14, 16, 16, 13, 9, 5, 3],
        rain:     [51, 41, 48, 52, 63, 50, 62, 53, 55, 62, 51, 58],
      },
      bestMonths: [4, 5, 6, 9, 10],
    },
    faq: [],
  },
  {
    cityId: "istanbul",
    info: {
      visa: { en: "E-visa required for some nationalities. Many visa-free for 90 days.", ko: "한국 여권 90일 무비자." },
      timezone: { en: "UTC+3 (Turkey Time)", ko: "한국보다 6시간 느림 (UTC+3)" },
      currency: { en: "Turkish Lira (TRY)", ko: "터키 리라 (TRY)" },
      language: { en: "Turkish", ko: "튀르키예어" },
      voltage: { en: "230V, 50Hz. Type C/F plugs.", ko: "230V, 50Hz. 한국 플러그와 모양 동일." },
      climate: {
        tempHigh: [9, 9, 12, 17, 22, 27, 29, 29, 26, 20, 15, 11],
        tempLow:  [3, 3, 5, 9, 13, 18, 21, 21, 17, 13, 9, 5],
        rain:     [105, 78, 72, 43, 35, 25, 15, 15, 42, 70, 96, 119],
      },
      bestMonths: [4, 5, 6, 9, 10],
    },
    faq: [],
  },
  {
    cityId: "newyork",
    info: {
      visa: { en: "ESTA required for Visa Waiver Program countries. Others need B1/B2 visa.", ko: "한국 여권 ESTA 필요 (90일, 전자여행허가)." },
      timezone: { en: "UTC-5 (EST) / UTC-4 summer", ko: "한국보다 14시간 느림 (여름 13시간)" },
      currency: { en: "US Dollar (USD)", ko: "미국 달러 (USD)" },
      language: { en: "English", ko: "영어" },
      voltage: { en: "120V, 60Hz. Type A/B plugs.", ko: "120V, 60Hz. 한국 플러그 어댑터 필요." },
      climate: {
        tempHigh: [4, 5, 10, 17, 22, 27, 30, 29, 25, 19, 12, 6],
        tempLow:  [-3, -2, 2, 7, 13, 18, 21, 21, 17, 11, 5, 0],
        rain:     [93, 78, 111, 114, 106, 112, 117, 113, 109, 112, 102, 102],
      },
      bestMonths: [4, 5, 6, 9, 10],
    },
    faq: [],
  },
];

export function getCityInfo(cityId: string): CityInfo | undefined {
  return cityInfos.find((c) => c.cityId === cityId);
}
