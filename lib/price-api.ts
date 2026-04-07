import type { FlightEstimate, HotelEstimate } from "@/types";

/**
 * Flight price estimates by destination city.
 * Prices in KRW (from Seoul/Incheon).
 * TODO: Replace with Skyscanner API (RapidAPI key required)
 */
const flightEstimates: Record<string, FlightEstimate> = {
  // Southeast Asia
  danang:    { fsc: { min: 350000, max: 550000 }, lcc: { min: 180000, max: 320000 }, currency: "KRW", source: "estimate" },
  nhatrang:  { fsc: { min: 400000, max: 600000 }, lcc: { min: 200000, max: 350000 }, currency: "KRW", source: "estimate" },
  hanoi:     { fsc: { min: 320000, max: 500000 }, lcc: { min: 170000, max: 300000 }, currency: "KRW", source: "estimate" },
  bangkok:   { fsc: { min: 380000, max: 580000 }, lcc: { min: 190000, max: 330000 }, currency: "KRW", source: "estimate" },
  pattaya:   { fsc: { min: 380000, max: 580000 }, lcc: { min: 190000, max: 330000 }, currency: "KRW", source: "estimate" },
  chiangmai: { fsc: { min: 420000, max: 650000 }, lcc: { min: 220000, max: 380000 }, currency: "KRW", source: "estimate" },
  phuket:    { fsc: { min: 400000, max: 620000 }, lcc: { min: 210000, max: 360000 }, currency: "KRW", source: "estimate" },
  bali:      { fsc: { min: 450000, max: 700000 }, lcc: { min: 250000, max: 420000 }, currency: "KRW", source: "estimate" },
  // Japan
  tokyo:     { fsc: { min: 300000, max: 500000 }, lcc: { min: 130000, max: 250000 }, currency: "KRW", source: "estimate" },
  osaka:     { fsc: { min: 280000, max: 480000 }, lcc: { min: 120000, max: 230000 }, currency: "KRW", source: "estimate" },
  kyoto:     { fsc: { min: 280000, max: 480000 }, lcc: { min: 120000, max: 230000 }, currency: "KRW", source: "estimate" }, // via Osaka
  nagoya:    { fsc: { min: 300000, max: 500000 }, lcc: { min: 140000, max: 260000 }, currency: "KRW", source: "estimate" },
  fukuoka:   { fsc: { min: 250000, max: 420000 }, lcc: { min: 100000, max: 200000 }, currency: "KRW", source: "estimate" },
  // Europe
  paris:     { fsc: { min: 900000, max: 1500000 }, lcc: { min: 550000, max: 900000 }, currency: "KRW", source: "estimate" },
  rome:      { fsc: { min: 850000, max: 1400000 }, lcc: { min: 520000, max: 850000 }, currency: "KRW", source: "estimate" },
  florence:  { fsc: { min: 900000, max: 1500000 }, lcc: { min: 550000, max: 900000 }, currency: "KRW", source: "estimate" },
  venice:    { fsc: { min: 900000, max: 1500000 }, lcc: { min: 550000, max: 900000 }, currency: "KRW", source: "estimate" },
  london:    { fsc: { min: 950000, max: 1600000 }, lcc: { min: 580000, max: 950000 }, currency: "KRW", source: "estimate" },
  barcelona: { fsc: { min: 880000, max: 1450000 }, lcc: { min: 530000, max: 870000 }, currency: "KRW", source: "estimate" },
  // China
  shanghai:  { fsc: { min: 250000, max: 450000 }, lcc: { min: 130000, max: 250000 }, currency: "KRW", source: "estimate" },
  beijing:   { fsc: { min: 250000, max: 450000 }, lcc: { min: 130000, max: 250000 }, currency: "KRW", source: "estimate" },
  // USA
  la:        { fsc: { min: 1000000, max: 1800000 }, lcc: { min: 650000, max: 1100000 }, currency: "KRW", source: "estimate" },
  lasvegas:  { fsc: { min: 1050000, max: 1850000 }, lcc: { min: 680000, max: 1150000 }, currency: "KRW", source: "estimate" },
  newyork:   { fsc: { min: 1100000, max: 1900000 }, lcc: { min: 700000, max: 1200000 }, currency: "KRW", source: "estimate" },
  seattle:   { fsc: { min: 1000000, max: 1700000 }, lcc: { min: 650000, max: 1100000 }, currency: "KRW", source: "estimate" },
  boston:    { fsc: { min: 1100000, max: 1900000 }, lcc: { min: 700000, max: 1200000 }, currency: "KRW", source: "estimate" },
  // Türkiye
  istanbul:   { fsc: { min: 700000, max: 1200000 }, lcc: { min: 450000, max: 750000 }, currency: "KRW", source: "estimate" },
  cappadocia: { fsc: { min: 750000, max: 1300000 }, lcc: { min: 480000, max: 800000 }, currency: "KRW", source: "estimate" },
  antalya:    { fsc: { min: 750000, max: 1300000 }, lcc: { min: 480000, max: 800000 }, currency: "KRW", source: "estimate" },
};

/**
 * Hotel price estimates by city (per night).
 * Prices in KRW.
 * TODO: Replace with Booking.com/Agoda Affiliate API
 */
const hotelEstimates: Record<string, HotelEstimate> = {
  // Southeast Asia
  danang:    { budget: { min: 25000, max: 50000 }, standard: { min: 70000, max: 130000 }, luxury: { min: 200000, max: 450000 }, currency: "KRW", source: "estimate" },
  nhatrang:  { budget: { min: 20000, max: 45000 }, standard: { min: 60000, max: 120000 }, luxury: { min: 180000, max: 400000 }, currency: "KRW", source: "estimate" },
  hanoi:     { budget: { min: 20000, max: 40000 }, standard: { min: 55000, max: 110000 }, luxury: { min: 150000, max: 350000 }, currency: "KRW", source: "estimate" },
  bangkok:   { budget: { min: 20000, max: 45000 }, standard: { min: 65000, max: 130000 }, luxury: { min: 180000, max: 500000 }, currency: "KRW", source: "estimate" },
  pattaya:   { budget: { min: 20000, max: 40000 }, standard: { min: 55000, max: 110000 }, luxury: { min: 150000, max: 400000 }, currency: "KRW", source: "estimate" },
  chiangmai: { budget: { min: 15000, max: 35000 }, standard: { min: 50000, max: 100000 }, luxury: { min: 130000, max: 300000 }, currency: "KRW", source: "estimate" },
  phuket:    { budget: { min: 25000, max: 50000 }, standard: { min: 80000, max: 150000 }, luxury: { min: 250000, max: 600000 }, currency: "KRW", source: "estimate" },
  bali:      { budget: { min: 25000, max: 50000 }, standard: { min: 70000, max: 140000 }, luxury: { min: 200000, max: 500000 }, currency: "KRW", source: "estimate" },
  // Japan
  tokyo:     { budget: { min: 40000, max: 80000 }, standard: { min: 100000, max: 200000 }, luxury: { min: 300000, max: 700000 }, currency: "KRW", source: "estimate" },
  osaka:     { budget: { min: 35000, max: 70000 }, standard: { min: 90000, max: 180000 }, luxury: { min: 250000, max: 600000 }, currency: "KRW", source: "estimate" },
  kyoto:     { budget: { min: 40000, max: 80000 }, standard: { min: 100000, max: 200000 }, luxury: { min: 300000, max: 700000 }, currency: "KRW", source: "estimate" },
  nagoya:    { budget: { min: 35000, max: 65000 }, standard: { min: 80000, max: 160000 }, luxury: { min: 220000, max: 500000 }, currency: "KRW", source: "estimate" },
  fukuoka:   { budget: { min: 30000, max: 60000 }, standard: { min: 75000, max: 150000 }, luxury: { min: 200000, max: 450000 }, currency: "KRW", source: "estimate" },
  // Europe
  paris:     { budget: { min: 80000, max: 150000 }, standard: { min: 180000, max: 350000 }, luxury: { min: 500000, max: 1200000 }, currency: "KRW", source: "estimate" },
  rome:      { budget: { min: 60000, max: 120000 }, standard: { min: 150000, max: 280000 }, luxury: { min: 400000, max: 900000 }, currency: "KRW", source: "estimate" },
  florence:  { budget: { min: 65000, max: 130000 }, standard: { min: 160000, max: 300000 }, luxury: { min: 450000, max: 1000000 }, currency: "KRW", source: "estimate" },
  venice:    { budget: { min: 80000, max: 160000 }, standard: { min: 200000, max: 380000 }, luxury: { min: 550000, max: 1300000 }, currency: "KRW", source: "estimate" },
  london:    { budget: { min: 90000, max: 170000 }, standard: { min: 200000, max: 400000 }, luxury: { min: 550000, max: 1400000 }, currency: "KRW", source: "estimate" },
  barcelona: { budget: { min: 60000, max: 120000 }, standard: { min: 150000, max: 280000 }, luxury: { min: 400000, max: 900000 }, currency: "KRW", source: "estimate" },
  // China
  shanghai:  { budget: { min: 30000, max: 60000 }, standard: { min: 80000, max: 160000 }, luxury: { min: 250000, max: 550000 }, currency: "KRW", source: "estimate" },
  beijing:   { budget: { min: 30000, max: 55000 }, standard: { min: 75000, max: 150000 }, luxury: { min: 230000, max: 500000 }, currency: "KRW", source: "estimate" },
  // USA
  la:        { budget: { min: 80000, max: 150000 }, standard: { min: 180000, max: 350000 }, luxury: { min: 500000, max: 1200000 }, currency: "KRW", source: "estimate" },
  lasvegas:  { budget: { min: 50000, max: 100000 }, standard: { min: 130000, max: 250000 }, luxury: { min: 400000, max: 1000000 }, currency: "KRW", source: "estimate" },
  newyork:   { budget: { min: 100000, max: 200000 }, standard: { min: 250000, max: 450000 }, luxury: { min: 600000, max: 1500000 }, currency: "KRW", source: "estimate" },
  seattle:   { budget: { min: 80000, max: 150000 }, standard: { min: 170000, max: 320000 }, luxury: { min: 450000, max: 1000000 }, currency: "KRW", source: "estimate" },
  boston:    { budget: { min: 90000, max: 170000 }, standard: { min: 200000, max: 380000 }, luxury: { min: 500000, max: 1200000 }, currency: "KRW", source: "estimate" },
  // Türkiye
  istanbul:   { budget: { min: 30000, max: 60000 }, standard: { min: 80000, max: 160000 }, luxury: { min: 250000, max: 600000 }, currency: "KRW", source: "estimate" },
  cappadocia: { budget: { min: 40000, max: 80000 }, standard: { min: 100000, max: 200000 }, luxury: { min: 300000, max: 700000 }, currency: "KRW", source: "estimate" },
  antalya:    { budget: { min: 35000, max: 70000 }, standard: { min: 90000, max: 180000 }, luxury: { min: 250000, max: 550000 }, currency: "KRW", source: "estimate" },
};

/**
 * Get flight estimate for a destination.
 * Uses the first city in the list (primary destination).
 */
export function getFlightEstimate(cityId: string): FlightEstimate | null {
  return flightEstimates[cityId] ?? null;
}

/**
 * Get hotel estimate for a city.
 */
export function getHotelEstimate(cityId: string): HotelEstimate | null {
  return hotelEstimates[cityId] ?? null;
}
