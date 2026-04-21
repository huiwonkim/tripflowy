"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Plane, Building2, MapPinned, DollarSign, ExternalLink } from "lucide-react";
import { displayPriceRange, displayPrice, convertToDisplay, formatCurrency } from "@/lib/currency";
import { getFlightEstimate, getHotelEstimate, fetchLivePrices, type LivePriceData } from "@/lib/price-api";
import type { Locale, GeneratedItinerary, FlightEstimate, HotelEstimate } from "@/types";
import { sumLocalCosts } from "@/lib/itinerary-builder";

interface BudgetSectionProps {
  itinerary: GeneratedItinerary;
  locale: Locale;
  nights: number;
}

export function BudgetSection({ itinerary, locale, nights }: BudgetSectionProps) {
  const t = useTranslations("budget");

  // Primary city = the city that appears on the most days in the itinerary.
  // Falls back to the first listed city when days aren't available.
  const primaryCity = (() => {
    if (!itinerary.days || itinerary.days.length === 0) return itinerary.cities[0];
    const counts: Record<string, number> = {};
    for (const d of itinerary.days) counts[d.city] = (counts[d.city] ?? 0) + 1;
    const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
    return sorted[0]?.[0] ?? itinerary.cities[0];
  })();

  const staticFlight = getFlightEstimate(primaryCity);
  const staticHotel = getHotelEstimate(primaryCity);

  // For ko locale, try to fetch live MyRealTrip data and MyLink affiliate URLs.
  // Falls back to static estimates if fetch fails or locale !== "ko".
  // Passes `nights` so the flight MyLink has matching return date.
  const [liveData, setLiveData] = useState<LivePriceData | null>(null);
  useEffect(() => {
    if (locale !== "ko") return;
    let cancelled = false;
    fetchLivePrices(primaryCity, locale, nights).then((data) => {
      if (!cancelled) setLiveData(data);
    });
    return () => {
      cancelled = true;
    };
  }, [primaryCity, locale, nights]);

  const flight: FlightEstimate | null = liveData?.flights && staticFlight
    ? { ...staticFlight, fsc: liveData.flights.fsc, lcc: liveData.flights.lcc, source: "api" }
    : staticFlight;

  const hotel: HotelEstimate | null = liveData?.hotels && staticHotel
    ? { ...staticHotel, budget: liveData.hotels.budget, standard: liveData.hotels.standard, luxury: liveData.hotels.luxury, source: "api" }
    : staticHotel;

  const flightBookUrl = liveData?.mylinks?.flight;
  const hotelBookUrl = liveData?.mylinks?.hotel;

  // Local costs — summed and converted to display currency
  const localCosts = sumLocalCosts(itinerary, locale);

  // Check which flight carrier types have real data (range > 0)
  const hasFsc = !!flight && (flight.fsc.min > 0 || flight.fsc.max > 0);
  const hasLcc = !!flight && (flight.lcc.min > 0 || flight.lcc.max > 0);

  // Convert everything to display currency
  const flightFsc = flight && hasFsc ? displayPriceRange(flight.fsc.min, flight.fsc.max, flight.currency, locale) : null;
  const flightLcc = flight && hasLcc ? displayPriceRange(flight.lcc.min, flight.lcc.max, flight.currency, locale) : null;

  const hotelBudget = hotel ? displayPriceRange(hotel.budget.min, hotel.budget.max, hotel.currency, locale) : null;
  const hotelStd = hotel ? displayPriceRange(hotel.standard.min, hotel.standard.max, hotel.currency, locale) : null;
  const hotelLux = hotel ? displayPriceRange(hotel.luxury.min, hotel.luxury.max, hotel.currency, locale) : null;

  // Local costs — already converted to display currency
  const localTotal = localCosts.food + localCosts.activity + localCosts.transport + localCosts.etc;

  // Grand total estimates (budget / luxury tier)
  const calcTotal = (flightRange: { min: number; max: number } | undefined, hotelRange: { min: number; max: number } | undefined, flightCur: string, hotelCur: string) => {
    if (!flightRange || !hotelRange) return null;
    const fMin = convertToDisplay(flightRange.min, flightCur, locale);
    const fMax = convertToDisplay(flightRange.max, flightCur, locale);
    const hMin = convertToDisplay(hotelRange.min * nights, hotelCur, locale);
    const hMax = convertToDisplay(hotelRange.max * nights, hotelCur, locale);
    return {
      min: fMin + hMin + localTotal,
      max: fMax + hMax + localTotal,
    };
  };

  // For totals: prefer LCC for budget tier and FSC for luxury tier, but fall back
  // to the other carrier type if one is missing (only one result class available).
  const budgetFlightRange = hasLcc ? flight?.lcc : hasFsc ? flight?.fsc : undefined;
  const luxuryFlightRange = hasFsc ? flight?.fsc : hasLcc ? flight?.lcc : undefined;
  const totalBudget = flight && hotel ? calcTotal(budgetFlightRange, hotel.budget, flight.currency, hotel.currency) : null;
  const totalLuxury = flight && hotel ? calcTotal(luxuryFlightRange, hotel.luxury, flight.currency, hotel.currency) : null;

  return (
    <section className="mt-10">
      <div className="mb-5">
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-emerald-600 mb-1.5">{t("label")}</p>
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">{t("heading")}</h2>
      </div>

      <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-card divide-y divide-gray-100">
        {/* Flights */}
        {flight && (
          <div className="p-5">
            <div className="flex items-center gap-2 mb-3">
              <Plane className="w-4 h-4 text-blue-500" />
              <h3 className="text-base font-semibold text-gray-900">{t("flights")}</h3>
              <span className="text-xs text-gray-400 ml-auto">{t("flightsNote")}</span>
            </div>
            <div className="space-y-2">
              {hasFsc && (
                <div className="flex justify-between items-center">
                  <div>
                    <span className="text-sm text-gray-700">FSC</span>
                    <span className="text-xs text-gray-400 ml-1.5">{locale === "ko" ? "(대한항공, 아시아나 등)" : "(Korean Air, Asiana, etc.)"}</span>
                  </div>
                  <span className="text-sm font-semibold text-gray-900">{flightFsc}</span>
                </div>
              )}
              {hasLcc && (
                <div className="flex justify-between items-center">
                  <div>
                    <span className="text-sm text-gray-700">LCC</span>
                    <span className="text-xs text-gray-400 ml-1.5">{locale === "ko" ? "(진에어, 티웨이 등)" : "(Jin Air, T'way, etc.)"}</span>
                  </div>
                  <span className="text-sm font-semibold text-gray-900">{flightLcc}</span>
                </div>
              )}
            </div>
            {flightBookUrl && (
              <a
                href={flightBookUrl}
                target="_blank"
                rel="noopener sponsored"
                className="mt-4 flex items-center justify-center gap-1.5 w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
              >
                항공권 가격 보기 <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
          </div>
        )}

        {/* Hotels */}
        {hotel && (
          <div className="p-5">
            <div className="flex items-center gap-2 mb-3">
              <Building2 className="w-4 h-4 text-purple-500" />
              <h3 className="text-base font-semibold text-gray-900">{t("hotels")}</h3>
              <span className="text-xs text-gray-400 ml-auto">{t("perNight")}</span>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-700">{t("hotelBudget")}</span>
                <span className="text-sm font-semibold text-gray-900">{hotelBudget}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-700">{t("hotelStandard")}</span>
                <span className="text-sm font-semibold text-gray-900">{hotelStd}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-700">{t("hotelLuxury")}</span>
                <span className="text-sm font-semibold text-gray-900">{hotelLux}</span>
              </div>
            </div>
            {hotelBookUrl && (
              <a
                href={hotelBookUrl}
                target="_blank"
                rel="noopener sponsored"
                className="mt-4 flex items-center justify-center gap-1.5 w-full py-2.5 bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium rounded-lg transition-colors"
              >
                숙소 가격 보기 <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
          </div>
        )}

        {/* Local costs */}
        {localTotal > 0 && (
          <div className="p-5">
            <div className="flex items-center gap-2 mb-3">
              <MapPinned className="w-4 h-4 text-emerald-500" />
              <h3 className="text-base font-semibold text-gray-900">{t("localCosts")}</h3>
              <span className="text-xs text-gray-400 ml-auto">{itinerary.duration}{locale === "ko" ? "일 합산" : "-day total"}</span>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-700">{t("food")}</span>
                <span className="text-sm font-semibold text-gray-900">{formatCurrency(localCosts.food, locale)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-700">{t("activity")}</span>
                <span className="text-sm font-semibold text-gray-900">{formatCurrency(localCosts.activity, locale)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-700">{t("transport")}</span>
                <span className="text-sm font-semibold text-gray-900">{formatCurrency(localCosts.transport, locale)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-700">{t("etc")}</span>
                <span className="text-sm font-semibold text-gray-900">{formatCurrency(localCosts.etc, locale)}</span>
              </div>
            </div>
          </div>
        )}

        {/* Grand total */}
        {(totalBudget || totalLuxury) && (
          <div className="p-5 bg-gradient-to-br from-emerald-50 to-emerald-100/50">
            <div className="flex items-center gap-2 mb-3">
              <DollarSign className="w-4 h-4 text-emerald-600" />
              <h3 className="text-base font-bold text-emerald-900">{t("grandTotal")}</h3>
            </div>
            <div className="space-y-2.5">
              {totalBudget && (
                <div className="flex justify-between items-baseline">
                  <span className="text-sm text-emerald-700">{t("budgetTier")}</span>
                  <span className="text-lg font-bold text-emerald-900 tracking-tight">
                    {formatCurrency(totalBudget.min, locale)} ~ {formatCurrency(totalBudget.max, locale)}
                  </span>
                </div>
              )}
              {totalLuxury && (
                <div className="flex justify-between items-baseline">
                  <span className="text-sm text-emerald-700">{t("luxuryTier")}</span>
                  <span className="text-lg font-bold text-emerald-900 tracking-tight">
                    {formatCurrency(totalLuxury.min, locale)} ~ {formatCurrency(totalLuxury.max, locale)}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        <p className="px-5 py-3 text-xs text-gray-400 bg-gray-50">
          {t("disclaimer")}
        </p>
      </div>
    </section>
  );
}
