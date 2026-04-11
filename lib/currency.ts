import type { Locale } from "@/types";

/** City → local currency code */
export const cityToCurrency: Record<string, string> = {
  // Vietnam
  danang: "VND", nhatrang: "VND",
  // Thailand
  bangkok: "THB", pattaya: "THB", chiangmai: "THB", phuket: "THB",
  // Indonesia
  bali: "IDR",
  // Japan
  tokyo: "JPY", osaka: "JPY", kyoto: "JPY", fukuoka: "JPY",
  // Europe
  paris: "EUR", rome: "EUR", florence: "EUR", venice: "EUR",
  barcelona: "EUR",
  london: "GBP",
  // China
  shanghai: "CNY", beijing: "CNY",
  // USA
  la: "USD", lasvegas: "USD", newyork: "USD", seattle: "USD", boston: "USD",
  // Türkiye
  istanbul: "TRY", cappadocia: "TRY", antalya: "TRY",
};

/** Exchange rates to 1 KRW (approximate, update periodically) */
const toKRW: Record<string, number> = {
  KRW: 1,
  USD: 1380,
  EUR: 1520,
  GBP: 1750,
  JPY: 9.2,
  CNY: 190,
  THB: 39,
  VND: 0.057,
  IDR: 0.087,
  TRY: 42,
};

/** Exchange rates to 1 USD */
const toUSD: Record<string, number> = {
  USD: 1,
  KRW: 0.00072,
  EUR: 1.10,
  GBP: 1.27,
  JPY: 0.0067,
  CNY: 0.14,
  THB: 0.028,
  VND: 0.000041,
  IDR: 0.000063,
  TRY: 0.031,
};

/** Currency symbols */
const symbols: Record<string, string> = {
  KRW: "₩", USD: "$", EUR: "€", GBP: "£",
  JPY: "¥", CNY: "¥", THB: "฿", VND: "₫",
  IDR: "Rp", TRY: "₺",
};

/**
 * Convert an amount from one currency to the display currency based on locale.
 * - Korean locale → KRW
 * - English locale → USD
 */
export function convertToDisplay(amount: number, fromCurrency: string, locale: Locale): number {
  if (locale === "ko") {
    const rate = toKRW[fromCurrency] ?? 1;
    return Math.round(amount * rate);
  } else {
    const rate = toUSD[fromCurrency] ?? 1;
    return Math.round(amount * rate * 100) / 100;
  }
}

/**
 * Format a number as currency string for display.
 */
export function formatCurrency(amount: number, locale: Locale): string {
  if (locale === "ko") {
    // Korean: ₩1,380,000
    return `₩${amount.toLocaleString("ko-KR")}`;
  } else {
    // English: $56.00
    return `$${amount.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
  }
}

/**
 * Convert and format in one step.
 */
export function displayPrice(amount: number, fromCurrency: string, locale: Locale): string {
  const converted = convertToDisplay(amount, fromCurrency, locale);
  return formatCurrency(converted, locale);
}

/**
 * Format a price range.
 */
export function displayPriceRange(min: number, max: number, fromCurrency: string, locale: Locale): string {
  const cMin = convertToDisplay(min, fromCurrency, locale);
  const cMax = convertToDisplay(max, fromCurrency, locale);
  const sym = locale === "ko" ? "₩" : "$";
  if (locale === "ko") {
    return `${sym}${cMin.toLocaleString("ko-KR")} ~ ${sym}${cMax.toLocaleString("ko-KR")}`;
  }
  return `${sym}${cMin.toLocaleString("en-US")} ~ ${sym}${cMax.toLocaleString("en-US")}`;
}

/** Get currency code for a city */
export function getCurrencyForCity(cityId: string): string {
  return cityToCurrency[cityId] ?? "USD";
}
