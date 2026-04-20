/**
 * One-off: fill description_ko/en and tips_ko/en for Tokyo spots that have
 * a matching post in the user's own blog dump (/Users/macbook/Downloads/Tokyo.txt).
 *
 * Only overwrites rows whose description_ko is "테스트" (placeholder) — rows
 * already edited by the user are left alone. Rows with no matching blog post
 * are also left alone so the user can fill them in manually in the sheet.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { CSV_COLUMNS, encodeCsvRow, parseCsv } from "./spots-csv-shared";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, "..");
const csvPath = path.join(ROOT, "data", "sheets", "tokyo-spots.csv");

type Content = {
  description_ko: string;
  description_en: string;
  tips_ko: string[];
  tips_en: string[];
};

/**
 * Spot id → distilled content from the user's blog posts.
 * Descriptions are one-sentence factual summaries; tips are 2-3 practical bullets.
 */
const FILL: Record<string, Content> = {
  "tokyo-odaiba-teamlabplanet": {
    description_ko: "신토요스역 근처의 몰입형 디지털 아트 전시. 맨발로 물속을 걷는 체험이 대표적.",
    description_en: "Immersive digital art museum near Shin-Toyosu Station — signature water-wading room where you walk barefoot.",
    tips_ko: [
      "입장권은 일주일 전에 매진되니 미리 클룩에서 예약 (할인쿠폰 적용 시 더 저렴)",
      "예약 시간 정각에 입장 시작 — 일찍 가도 입장 안 됨",
      "보더리스보다 체험형이 강하고 인기 많음 — 최소 1시간 이상 체류",
    ],
    tips_en: [
      "Tickets sell out a week ahead — book on Klook with the coupon codes for a discount",
      "Entry starts exactly at your reservation time — arriving early won't get you in faster",
      "More hands-on than Borderless and more popular — allow at least 1 hour inside",
    ],
  },
  "tokyo-roppongi-teamlab-boderless": {
    description_ko: "아자부다이 힐즈 B1의 경계 없는 디지털 아트 뮤지엄. 정해진 동선 없이 발길 가는 대로 이동.",
    description_en: "Borderless digital art museum at Azabudai Hills B1 — no set route, wander as the works bleed into each other.",
    tips_ko: [
      "시내 중심가라 긴자·롯폰기에서 쉽게 접근 가능 (플래닛보다 위치 유리)",
      "티켓팅이 플래닛보다 수월 — 급하면 이쪽이 대안",
      "매트릭스 느낌의 LED 줄 공간이 포토스팟 — 불이 밝아질 때 촬영",
    ],
    tips_en: [
      "Central Azabudai Hills location — easy from Ginza/Roppongi (better than Planets)",
      "Ticketing is less competitive than Planets — go here if you're last-minute",
      "The Matrix-style LED cable room is the signature photo spot — wait for a bright moment",
    ],
  },
  "tokyo-roppongi-cityview-skydeck": {
    description_ko: "롯폰기 힐즈 모리타워 52층의 전망대. 공식 명칭은 '도쿄시티뷰'. 옥상 스카이덱 별도 요금.",
    description_en: "Observation deck on the 52nd floor of Roppongi Hills Mori Tower — officially Tokyo City View. Open-air Sky Deck costs extra.",
    tips_ko: [
      "공홈보다 클룩 예약이 할인쿠폰과 함께 쓰면 저렴",
      "간판에는 '도쿄시티뷰'로 표시돼 있으니 그 표지판 따라가기",
      "예약이 빨리 마감되니 일주일 전에는 확보",
    ],
    tips_en: [
      "Klook with the discount coupon runs cheaper than the official site",
      "Signage says 'Tokyo City View' — follow that name, not 'Roppongi Hills Observatory'",
      "Books up fast — reserve at least a week out",
    ],
  },
  "tokyo-odaiba-disneyland": {
    description_ko: "마이하마역 바로 앞의 도쿄 디즈니랜드. 퍼레이드·공연 퀄리티가 세계 디즈니 중 상위권.",
    description_en: "Tokyo Disneyland at Maihama Station — parades and stage shows are among the best across Disney parks worldwide.",
    tips_ko: [
      "파크호퍼 티켓 사면 하루에 디즈니씨까지 둘 다 가능 (2026년 3월까지)",
      "미녀와 야수 등 인기 어트랙션은 DPA(유료 패스)로 대기 단축",
      "식사는 1인 1~2만원 이상 생각 — 내부 물가 비쌈",
    ],
    tips_en: [
      "Park Hopper gets you into both parks in one day (valid through March 2026)",
      "Grab a paid DPA for top rides like Beauty and the Beast to skip the queue",
      "Budget ~₩10-20k per person for meals — in-park prices are steep",
    ],
  },
  "tokyo-odaiba-disneysea": {
    description_ko: "마이하마역에서 모노레일로 한 정거장. 디즈니랜드와 달리 해양 테마, 성인 취향 놀이기구 위주.",
    description_en: "One monorail stop from Maihama Station — ocean-themed, ride lineup skews more adult than Disneyland.",
    tips_ko: [
      "디즈니랜드와 다른 파크 — 입장권을 따로 사거나 파크호퍼로 둘 다 커버",
      "모노레일은 추가 요금 — 패스 없으면 현장 지불",
      "DPA는 입장 후에 구매 가능, 한정 수량이라 오픈런 권장",
    ],
    tips_en: [
      "Separate from Disneyland — buy a separate ticket or a Park Hopper to cover both",
      "The monorail between parks costs extra if you don't have a pass",
      "DPA is sold only after entering the park and has a daily cap — arrive early",
    ],
  },
  "tokyo-asakusa-skytree-tower": {
    description_ko: "634m 높이 도쿄 스카이트리 전망대. 텐보데크(350m)와 텐보갤러리아(450m) 2단계 구성.",
    description_en: "The 634m Tokyo Skytree — two observation decks (Tembo Deck 350m, Tembo Galleria 450m).",
    tips_ko: [
      "일몰 시간 1시간 전 입장 — 덴보데크에서 갤러리아 가는 엘리베이터 대기가 김",
      "가장 위층까지 가는 통합 티켓으로 구매 추천",
      "내부 동선 복잡해 최소 1시간은 잡고 방문",
    ],
    tips_en: [
      "Arrive an hour before sunset — the Tembo Deck → Galleria lift has a long queue",
      "Buy the combo ticket that includes the upper Galleria deck",
      "Allow at least an hour — the floors are more complex than they look",
    ],
  },
  "tokyo-roppongi-tokyo-tower": {
    description_ko: "333m 높이 도쿄타워 전망대. Main Deck와 상층 Top Deck 2단계, Top Deck는 예약 필수.",
    description_en: "The 333m Tokyo Tower — two decks (Main Deck and the upper Top Deck). Top Deck requires a timed reservation.",
    tips_ko: [
      "Top Deck는 예약 시간 30분 전 도착 (입장 프로세스 때문)",
      "야경 보려면 일몰 30분 전 시간대 예약",
      "예약 매진 빠름 — 코스 확정되면 바로 티켓팅",
    ],
    tips_en: [
      "Arrive 30 minutes before your Top Deck slot — there's a check-in process",
      "For night views, book a slot starting ~30 minutes before sunset",
      "Slots sell out quickly — book as soon as your itinerary is locked",
    ],
  },
  "tokyo-shibuya-shibuyasky": {
    description_ko: "시부야 스크램블 스퀘어 옥상 전망대. 야외 오픈 에어 데크에서 스크램블 교차로 직상 조망.",
    description_en: "Rooftop deck at Shibuya Scramble Square — open-air platform directly above the Scramble Crossing.",
    tips_ko: [
      "일몰·야경 시간대는 2주 전 00시에 예약해야 확보 가능",
      "도쿄타워 방향 코너에 소파·테이블 공간 — 그쪽에서 보는 뷰 추천",
      "건물 외부에 14층 직통 엘리베이터 있음 — 내부 줄 피하기",
    ],
    tips_en: [
      "Sunset/night slots open 2 weeks ahead at midnight — book the moment they drop",
      "The corner facing Tokyo Tower has sofas and tables — quietest viewpoint",
      "There's a direct 14F lift outside the building — skip the main-lobby line",
    ],
  },
  "tokyo-shibuya-donkihote": {
    description_ko: "시부야역 근처 24시간 영업 대형 돈키호테. 7층 면세 카운터, 지하 1층부터 올라가는 동선.",
    description_en: "Massive 24-hour Don Quijote near Shibuya Station — tax-free counter on 7F, shop from B1 upward.",
    tips_ko: [
      "면세는 7층 카운터 — 지하 1층부터 쇼핑하며 올라가는 동선이 효율적",
      "저녁·새벽 모두 혼잡 — 비교적 여유로운 오전 추천",
      "시부야 스카이 일정과 묶으면 동선 좋음",
    ],
    tips_en: [
      "Tax-free counter is on 7F — start at B1 and work your way up",
      "Busy evening and overnight both — mornings are the calmest window",
      "Pair with Shibuya Sky for an efficient Shibuya day",
    ],
  },
  "tokyo-roppongi-donkihote-roppongi": {
    description_ko: "롯폰기점. 롯폰기 힐즈 근처. 24시간이지만 새벽엔 의약품 판매 제한.",
    description_en: "Roppongi branch near Roppongi Hills. 24 hours, though pharmacy sales stop overnight.",
    tips_ko: [
      "시부야·신주쿠 지점보다 한산해서 쇼핑 여유 있음",
      "면세는 5천 엔 이상부터 적용",
      "새벽 시간대 의약품 코너 닫히는 경우 많음",
    ],
    tips_en: [
      "Quieter than the Shibuya and Shinjuku branches — easier browsing",
      "Tax-free applies from ¥5,000 of purchases onward",
      "Medicine aisle often closed late at night",
    ],
  },
  "tokyo-ginza-donkihote-ginza": {
    description_ko: "긴자 본관. 24시간 운영. 시부야·신주쿠 지점에 비해 관광객이 적어 쇼핑 여유로움.",
    description_en: "Ginza flagship Don Quijote — 24/7, noticeably calmer than the Shibuya/Shinjuku branches.",
    tips_ko: [
      "쇼핑 여유로운 편이라 선물·기념품 찬찬히 고르기 좋음",
      "5천 엔 이상 구매해야 면세 적용",
      "24시간이지만 새벽엔 일부 코너 닫힘",
    ],
    tips_en: [
      "Good for relaxed gift shopping — far less chaotic than other branches",
      "Need to spend ¥5,000+ to qualify for tax-free",
      "24/7 in theory, but some aisles close overnight",
    ],
  },
  "tokyo-shinjuku-donkihote-gabukicho": {
    description_ko: "신주쿠 돈키호테 3개 지점 중 가장 인기. 가부키초 한가운데 위치, 24시간 영업.",
    description_en: "The busiest of Shinjuku's three Don Quijote branches — right in Kabukicho, open 24 hours.",
    tips_ko: [
      "이른 아침이나 늦은 밤이 덜 복잡 — 낮·저녁엔 인산인해",
      "쇼핑리스트 미리 정리해서 방문 시간 단축",
      "신주쿠 숙소 손님은 여기서 화장품 몰아 구매",
    ],
    tips_en: [
      "Early morning and late night are the quiet windows — day and evening are packed",
      "Come with a list — browsing without one eats an hour easily",
      "Convenient haul stop if you're staying in Shinjuku",
    ],
  },
  "tokyo-shinjuku-harrypotter": {
    description_ko: "이케부쿠로 인근 토시마엔 부지에 개장한 워너브라더스 스튜디오 투어 도쿄. 런던 스튜디오의 아시아판.",
    description_en: "Warner Bros. Studio Tour Tokyo on the former Toshimaen site near Ikebukuro — the Asian edition of the London studio tour.",
    tips_ko: [
      "지팡이 살 사람은 입장 전 외부 숍 들러서 구매 — 내부 결제 줄 김",
      "오전 타임이 비교적 한산",
      "공식 가격은 공홈에서 확인 (클룩 경유가 가끔 더 저렴)",
    ],
    tips_en: [
      "Buy wands at the outside shop before entry — the in-studio checkout queue is long",
      "Morning slots are the calmer option",
      "Check the official site for the real price — Klook sometimes beats it",
    ],
  },
  "tokyo-shibuya-matuya-shibuyacenter": {
    description_ko: "마츠야 시부야센터점. 요시노야·스키야와 함께 일본 3대 규동 체인.",
    description_en: "Matsuya Shibuya Center — one of Japan's big-three gyudon chains alongside Yoshinoya and Sukiya.",
    tips_ko: [
      "오전 11시~오후 3시 런치세트 주문 가능 — 가격 저렴",
      "키오스크 주문이라 일본어 몰라도 OK",
      "혼밥·빠른 점심에 적합",
    ],
    tips_en: [
      "Lunch sets available 11:00-15:00 — best value window",
      "Ticket machine ordering — no Japanese needed",
      "Good for a quick solo lunch",
    ],
  },
  "tokyo-shibuya-bigcamera": {
    description_ko: "시부야 빅카메라. 전자제품·주류·화장품 면세 쇼핑, 특히 위스키·양주 가성비 좋음.",
    description_en: "Bic Camera Shibuya — tax-free electronics, liquor, and cosmetics. Whiskey and spirits are particularly well-priced.",
    tips_ko: [
      "면세 혜택 받으려면 실물 여권 필수",
      "주류 코너 면세 한도까지 채워 사오는 게 이득",
      "현대카드 할인 등 카드 혜택은 직원마다 인지도 다름 — 여러 직원에 확인",
    ],
    tips_en: [
      "Bring your physical passport — tax-free requires the original",
      "Fill your liquor allowance here — prices are notably cheap",
      "Card-specific discounts vary by clerk knowledge — ask more than one",
    ],
  },
  "tokyo-tokyo-station-kitte": {
    description_ko: "도쿄역 바로 앞 상업시설 킷테 마루노우치. 6층 루프탑 가든에서 도쿄역 전경과 야경 조망.",
    description_en: "KITTE Marunouchi directly across from Tokyo Station — the 6F rooftop garden frames Tokyo Station and its nighttime lighting.",
    tips_ko: [
      "루프탑 가든은 무료 — 도쿄역 야경 포토스팟",
      "평일 저녁이 주말보다 한산하고 뷰 좋음",
      "도쿄역·긴자 동선에 끼워넣기 좋음",
    ],
    tips_en: [
      "The rooftop garden is free — best free Tokyo Station night-view spot",
      "Weekday evenings are calmer and clearer than weekends",
      "Easy to slot into a Tokyo Station or Ginza evening",
    ],
  },
  "tokyo-asakusa-sensoji": {
    description_ko: "아사쿠사의 도쿄 최고(最古) 사찰. 카미나리몬(雷門) 대등과 나카미세 쇼핑거리로 유명.",
    description_en: "Tokyo's oldest temple in Asakusa — famous for the Kaminarimon gate lantern and the Nakamise shopping street leading up to it.",
    tips_ko: [
      "이른 아침이 한적 — 6시부터 본당 개방 (겨울 6:30)",
      "입장료 무료 — 본당 마감은 오후 5시",
      "나카미세에서 길거리 간식·기념품 쇼핑",
    ],
    tips_en: [
      "Early morning is quiet — main hall opens 06:00 (06:30 in winter)",
      "No admission fee — main hall closes at 17:00",
      "Grab snacks and souvenirs along Nakamise-dori on the way in",
    ],
  },
  "tokyo-shinjuku-kyoen": {
    description_ko: "신주쿠 한복판의 대형 정원. 일본·프랑스·영국식 정원과 대형 온실로 구성.",
    description_en: "Large landscape garden in central Shinjuku — three styles (Japanese, French, English) plus a sizable greenhouse.",
    tips_ko: [
      "내부 스타벅스 가려면 오픈 직후에 — 낮엔 1시간 대기",
      "벚꽃 시즌에만 예약 필요, 평소엔 현장 구매 OK",
      "계절별 운영시간 다르니 방문 전 체크 (온실 별도)",
    ],
    tips_en: [
      "The in-garden Starbucks has a ~1-hour wait by midday — go right at opening",
      "Advance booking is only needed in cherry-blossom season — walk-in works otherwise",
      "Hours shift by season — check the current schedule (greenhouse has its own)",
    ],
  },
  "tokyo-shinjuku-buchiuyama": {
    description_ko: "신주쿠 히로시마식 오코노미야끼 가게 '부치우마야'. 카운터석 위주로 셰프가 앞에서 굽는 형식.",
    description_en: "Buchiumaya in Shinjuku — Hiroshima-style okonomiyaki cooked counter-side by the chef in front of you.",
    tips_ko: [
      "현금 결제만 가능 — 미리 현금 준비",
      "오사카식보다 훨씬 풍성한 히로시마식 경험",
      "파가 들어간 '네기야키'가 치즈보다 더 추천",
    ],
    tips_en: [
      "Cash only — withdraw before you go",
      "Hiroshima-style is heartier than the Osaka version — good intro to the style",
      "The negi (green onion) variant beats the cheese one",
    ],
  },
  "tokyo-shinjuku-ichiran-ramen-juohigashi": {
    description_ko: "신주쿠 주오히가시구치점 이치란 라멘. 개인 부스에서 먹는 일본식 톤코츠 라멘.",
    description_en: "Ichiran Shinjuku Chuo-Higashi — single-seat booth ramen, the classic intro to Japanese tonkotsu.",
    tips_ko: [
      "라멘 입문자에게 이치란 하나면 충분",
      "웨이팅 있으니 점심 피크 피하거나 아침·심야 방문",
      "주문은 자판기 — 맵기·토핑 커스터마이즈 가능",
    ],
    tips_en: [
      "Fine as your only ramen stop if you're new to Japanese ramen",
      "Always a queue — skip the lunch peak, go early morning or late night",
      "Order by ticket machine — customize spice level and toppings",
    ],
  },
  "tokyo-shinjuku-tenkichiya": {
    description_ko: "신주쿠 텐동 맛집 텐키치야. 바삭한 튀김 위에 달달한 소스가 올라간 텐동 전문.",
    description_en: "Tenkichiya in Shinjuku — specialist tendon, crispy tempura over rice with the signature sweet sauce.",
    tips_ko: [
      "피크 시간대 웨이팅 — 오픈 직후나 2시 이후 추천",
      "세트 메뉴가 단품보다 가성비 좋음",
      "신주쿠 숙소 손님에게 아침·이른 점심 옵션",
    ],
    tips_en: [
      "Queue at peak hours — go right at opening or after 2pm",
      "Set menus give better value than à la carte",
      "Good breakfast/early-lunch option if you're based in Shinjuku",
    ],
  },
};

// ────────────────────────────────────────────────────────
// Apply to CSV
// ────────────────────────────────────────────────────────

const ARRAY_SEP = "|";
const raw = fs.readFileSync(csvPath, "utf8");
const rows = parseCsv(raw);
const headers = rows[0];

for (const col of CSV_COLUMNS) {
  if (!headers.includes(col)) {
    console.error(`CSV missing required column: ${col}`);
    process.exit(1);
  }
}

const iId = headers.indexOf("id");
const iDescKo = headers.indexOf("description_ko");
const iDescEn = headers.indexOf("description_en");
const iTipsKo = headers.indexOf("tips_ko");
const iTipsEn = headers.indexOf("tips_en");

let updated = 0;
const skipped: string[] = [];
const missing: string[] = [];

const seenIds = new Set<string>();
for (let i = 1; i < rows.length; i++) {
  const row = rows[i];
  if (row.every((c) => c.trim() === "")) continue;
  const id = (row[iId] ?? "").trim();
  if (!id) continue;
  seenIds.add(id);
  const content = FILL[id];
  if (!content) continue;

  // Only overwrite if description_ko is still "테스트" — respect user edits
  const currentDescKo = (row[iDescKo] ?? "").trim();
  if (currentDescKo !== "테스트" && currentDescKo !== "") {
    skipped.push(`${id}  (already edited: "${currentDescKo.slice(0, 30)}...")`);
    continue;
  }

  row[iDescKo] = content.description_ko;
  row[iDescEn] = content.description_en;
  row[iTipsKo] = content.tips_ko.join(ARRAY_SEP);
  row[iTipsEn] = content.tips_en.join(ARRAY_SEP);
  updated++;
}

for (const id of Object.keys(FILL)) {
  if (!seenIds.has(id)) missing.push(id);
}

const out = rows.map((r) => encodeCsvRow(r)).join("\n");
fs.writeFileSync(csvPath, "\uFEFF" + out + "\n", "utf8");

console.log(`filled ${updated} spots with blog-derived content`);
if (skipped.length > 0) {
  console.log("\nSkipped (already had content):");
  for (const s of skipped) console.log("  " + s);
}
if (missing.length > 0) {
  console.log("\nMapping ids not found in CSV (typo?):");
  for (const m of missing) console.log("  " + m);
}
