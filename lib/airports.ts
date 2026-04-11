/** City ID → IATA airport code */
export const cityToAirport: Record<string, string> = {
  // Vietnam
  danang: "DAD",
  nhatrang: "CXR",
  // Thailand
  bangkok: "BKK",
  pattaya: "BKK",    // uses Bangkok airport
  chiangmai: "CNX",
  phuket: "HKT",
  // Indonesia
  bali: "DPS",
  // Japan
  tokyo: "NRT",
  osaka: "KIX",
  kyoto: "KIX",      // uses Osaka airport
  fukuoka: "FUK",
  // France
  paris: "CDG",
  // Italy
  rome: "FCO",
  florence: "FLR",
  venice: "VCE",
  // UK
  london: "LHR",
  // Spain
  barcelona: "BCN",
  // China
  shanghai: "PVG",
  beijing: "PEK",
  // USA
  la: "LAX",
  lasvegas: "LAS",
  newyork: "JFK",
  seattle: "SEA",
  boston: "BOS",
  // Türkiye
  istanbul: "IST",
  cappadocia: "ASR",
  antalya: "AYT",
};

/** All city IDs that have airport mappings */
export const allCityIds = Object.keys(cityToAirport);
