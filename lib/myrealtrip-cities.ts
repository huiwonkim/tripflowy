/**
 * MyRealTrip city code mapping and search keywords.
 *
 * - `cityCode`: IATA airport/city code used by MRT flight APIs
 *   (depCityCd / arrCityCds). Airport codes like ICN, NRT work.
 * - `keyword`: Korean search keyword for MRT accommodation search.
 * - `localAirlines`: Destination-country airlines known to operate direct
 *   flights from Korea. Combined with KOREAN_DIRECT_CARRIERS to filter
 *   out transit/via-third-country flights.
 */

export const MRT_ORIGIN = "ICN"; // Incheon

/**
 * Korean airlines that operate direct outbound flights.
 * These are always considered direct operators regardless of destination.
 */
export const KOREAN_DIRECT_CARRIERS = new Set([
  "KE", // Korean Air
  "OZ", // Asiana
  "7C", // Jeju Air
  "LJ", // Jin Air
  "TW", // T'way Air
  "BX", // Air Busan
  "RS", // Air Seoul
  "ZE", // Eastar Jet
  "YP", // Air Premia
]);

interface MrtCityInfo {
  cityCode: string;
  keyword: string;
  /** Destination-country airlines that operate direct from Korea. */
  localAirlines?: string[];
}

export const mrtCityCodes: Record<string, MrtCityInfo> = {
  // Vietnam — Vietnamese carriers
  danang:    { cityCode: "DAD", keyword: "다낭",     localAirlines: ["VN", "VJ", "BL", "QH"] },
  nhatrang:  { cityCode: "CXR", keyword: "나트랑",   localAirlines: ["VN", "VJ", "BL", "QH"] },
  // Thailand — Thai carriers (WE/Thai Smile operates direct ICN-BKK)
  bangkok:   { cityCode: "BKK", keyword: "방콕",     localAirlines: ["TG", "FD", "SL", "XJ", "WE"] },
  pattaya:   { cityCode: "BKK", keyword: "파타야",   localAirlines: ["TG", "FD", "SL", "XJ", "WE"] },
  chiangmai: { cityCode: "CNX", keyword: "치앙마이", localAirlines: ["TG", "FD", "SL"] },
  phuket:    { cityCode: "HKT", keyword: "푸켓",     localAirlines: ["TG", "FD", "SL"] },
  // Indonesia
  bali:      { cityCode: "DPS", keyword: "발리",     localAirlines: ["GA", "QZ", "ID", "JT"] },
  // Japan — Japanese carriers
  tokyo:     { cityCode: "NRT", keyword: "도쿄",     localAirlines: ["JL", "NH", "MM", "APJ", "GK", "ZG"] },
  osaka:     { cityCode: "KIX", keyword: "오사카",   localAirlines: ["JL", "NH", "MM", "APJ", "GK", "ZG"] },
  kyoto:     { cityCode: "KIX", keyword: "교토",     localAirlines: ["JL", "NH", "MM", "APJ", "GK", "ZG"] },
  fukuoka:   { cityCode: "FUK", keyword: "후쿠오카", localAirlines: ["JL", "NH", "APJ"] },
  // Europe — European flag carriers (some transit is unavoidable long-haul)
  paris:     { cityCode: "CDG", keyword: "파리",     localAirlines: ["AF"] },
  rome:      { cityCode: "FCO", keyword: "로마",     localAirlines: ["AZ", "ITA"] },
  florence:  { cityCode: "FLR", keyword: "피렌체",   localAirlines: ["AZ", "ITA"] },
  venice:    { cityCode: "VCE", keyword: "베니스",   localAirlines: ["AZ", "ITA"] },
  london:    { cityCode: "LHR", keyword: "런던",     localAirlines: ["BA", "VS"] },
  barcelona: { cityCode: "BCN", keyword: "바르셀로나", localAirlines: ["IB", "VY"] },
  // China — Chinese carriers
  shanghai:  { cityCode: "PVG", keyword: "상하이",   localAirlines: ["MU", "CA", "CZ", "9C", "HO", "FM"] },
  beijing:   { cityCode: "PEK", keyword: "베이징",   localAirlines: ["CA", "MU", "CZ", "HU"] },
  // USA — US carriers
  la:        { cityCode: "LAX", keyword: "로스앤젤레스", localAirlines: ["AA", "DL", "UA"] },
  lasvegas:  { cityCode: "LAS", keyword: "라스베이거스", localAirlines: ["AA", "DL", "UA"] },
  newyork:   { cityCode: "JFK", keyword: "뉴욕",     localAirlines: ["AA", "DL", "UA"] },
  seattle:   { cityCode: "SEA", keyword: "시애틀",   localAirlines: ["AA", "DL", "UA", "AS"] },
  boston:    { cityCode: "BOS", keyword: "보스턴",   localAirlines: ["AA", "DL", "UA"] },
  // Türkiye
  istanbul:  { cityCode: "IST", keyword: "이스탄불", localAirlines: ["TK"] },
  cappadocia:{ cityCode: "ASR", keyword: "카파도키아", localAirlines: ["TK"] },
  antalya:   { cityCode: "AYT", keyword: "안탈리아", localAirlines: ["TK"] },
};

export function getMrtCity(cityId: string): MrtCityInfo | undefined {
  return mrtCityCodes[cityId];
}

/**
 * Returns true if the given airline code is a known direct operator
 * for the given destination city.
 */
export function isDirectAirline(cityId: string, airline: string | null): boolean {
  if (!airline) return false;
  if (KOREAN_DIRECT_CARRIERS.has(airline)) return true;
  const city = mrtCityCodes[cityId];
  return !!city?.localAirlines?.includes(airline);
}
