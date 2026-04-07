"use client";

import { Suspense, useMemo, useState, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { Link, useRouter } from "@/i18n/navigation";
import { SlidersHorizontal, X, ChevronDown, MapPin, Clock, Users, Zap, ArrowRight, ExternalLink } from "lucide-react";
import { buildItinerary, getMatchedTours, getMatchedHotels } from "@/lib/itinerary-builder";
import { getCityInfo } from "@/data/city-info";
import { countries, durationOptions, travelerTypeOptions, styleOptions } from "@/data/destinations";
import { durationLabel, styleLabel, travelerLabel } from "@/lib/utils";
import { DayPlanSection } from "@/components/itinerary/DayPlanSection";
import { BudgetSection } from "@/components/itinerary/BudgetSection";
import { FAQSection } from "@/components/itinerary/FAQSection";
import { TourCard } from "@/components/tours/TourCard";
import { HotelCard } from "@/components/hotels/HotelCard";
import { Badge } from "@/components/ui/Badge";
import type { TravelerType, TravelStyle, Locale, GeneratedItinerary } from "@/types";

function ItinerariesContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const locale = useLocale() as Locale;
  const t = useTranslations("itineraries");
  const tDetail = useTranslations("detail");
  const [destOpen, setDestOpen] = useState(false);
  const destRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (destRef.current && !destRef.current.contains(e.target as Node)) setDestOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const destinations = searchParams.get("destinations")?.split(",").filter(Boolean) ?? [];
  const duration = searchParams.get("duration") ?? "";
  const style = (searchParams.get("style") as TravelStyle) ?? undefined;
  const travelerType = (searchParams.get("travelerType") as TravelerType) ?? undefined;

  const hasParams = destinations.length > 0 && duration;

  const itinerary = useMemo<GeneratedItinerary | null>(() => {
    if (!hasParams) return null;
    return buildItinerary({
      destinations,
      duration: Number(duration) + 1, // nights → days
      style,
      travelerType,
    });
  }, [destinations.join(","), duration, style, travelerType]);

  const matchedTours = itinerary ? getMatchedTours(itinerary) : [];
  const matchedHotels = itinerary ? getMatchedHotels(itinerary) : [];
  const cityInfos = itinerary ? [...new Set(itinerary.cities)].map(getCityInfo).filter(Boolean) : [];

  const allCities = countries.flatMap((c) => c.cities);

  function updateParams(key: string, value: string | string[]) {
    const params = new URLSearchParams(searchParams.toString());
    if (Array.isArray(value)) {
      if (value.length > 0) params.set(key, value.join(","));
      else params.delete(key);
    } else if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`/itineraries?${params.toString()}` as never, { scroll: false });
  }

  function toggleDest(cityId: string) {
    const next = destinations.includes(cityId)
      ? destinations.filter((d) => d !== cityId)
      : [...destinations, cityId];
    updateParams("destinations", next);
  }

  const selectBase = "bg-white border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-800 appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition cursor-pointer";

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">{t("heading")}</h1>
        <p className="text-gray-500 mt-2">{t("subheading")}</p>
      </div>

      {/* Filters */}
      <div className="bg-white border border-gray-100 rounded-2xl p-4 mb-8 shadow-sm">
        <div className="flex items-center gap-2 mb-3">
          <SlidersHorizontal className="w-4 h-4 text-gray-400" />
          <span className="text-sm font-medium text-gray-700">{t("filterLabel")}</span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {/* Multi-destination dropdown */}
          <div className="relative" ref={destRef}>
            <button type="button" onClick={() => setDestOpen((o) => !o)}
              className={`${selectBase} w-full text-left flex items-center min-h-[40px] pr-8`}>
              {destinations.length === 0
                ? <span className="text-gray-400">{t("allDestinations")}</span>
                : <span className="truncate">{destinations.map((id) => allCities.find((c) => c.id === id)?.label[locale] ?? id).join(", ")}</span>}
            </button>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
              <ChevronDown className={`w-4 h-4 transition-transform ${destOpen ? "rotate-180" : ""}`} />
            </div>
            {destOpen && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg z-50 max-h-64 overflow-y-auto min-w-[220px]">
                {countries.map((c) => (
                  <div key={c.id}>
                    <p className="px-3 py-1.5 text-xs font-medium text-gray-400 bg-gray-50 sticky top-0">{c.emoji} {c.label[locale]}</p>
                    {c.cities.map((city) => (
                      <label key={city.id} className="flex items-center gap-2.5 px-3 py-2 hover:bg-blue-50 cursor-pointer text-sm">
                        <input type="checkbox" checked={destinations.includes(city.id)} onChange={() => toggleDest(city.id)}
                          className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                        <span className={destinations.includes(city.id) ? "font-medium text-gray-900" : "text-gray-700"}>{city.label[locale]}</span>
                      </label>
                    ))}
                  </div>
                ))}
              </div>
            )}
          </div>

          <select className={`${selectBase} pr-8`} value={duration} onChange={(e) => updateParams("duration", e.target.value)}>
            <option value="">{t("anyDuration")}</option>
            {durationOptions.map((d) => (<option key={d.value} value={d.value}>{d.label[locale]}</option>))}
          </select>
          <select className={`${selectBase} pr-8`} value={travelerType ?? ""} onChange={(e) => updateParams("travelerType", e.target.value)}>
            <option value="">{t("anyTraveler")}</option>
            {travelerTypeOptions.map((tt) => (<option key={tt.value} value={tt.value}>{tt.emoji} {tt.label[locale]}</option>))}
          </select>
          <select className={`${selectBase} pr-8`} value={style ?? ""} onChange={(e) => updateParams("style", e.target.value)}>
            <option value="">{t("anyStyle")}</option>
            {styleOptions.map((s) => (<option key={s.value} value={s.value}>{s.label[locale]}</option>))}
          </select>
        </div>

        {destinations.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-3">
            {destinations.map((id) => {
              const city = allCities.find((c) => c.id === id);
              return city ? (
                <span key={id} className="inline-flex items-center gap-1 bg-blue-100 text-blue-700 text-xs font-medium px-2.5 py-1 rounded-full">
                  {city.label[locale]}
                  <button type="button" onClick={() => toggleDest(id)} className="hover:text-blue-900"><X className="w-3 h-3" /></button>
                </span>
              ) : null;
            })}
          </div>
        )}
      </div>

      {/* Result */}
      {!hasParams && (
        <div className="text-center py-20">
          <MapPin className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-lg font-medium text-gray-600 mb-2">
            {locale === "ko" ? "여행지와 기간을 선택하세요" : "Select destinations and duration"}
          </p>
          <p className="text-sm text-gray-400">
            {locale === "ko" ? "조건에 맞는 일정을 자동으로 조합해드립니다" : "We'll automatically build an itinerary for you"}
          </p>
        </div>
      )}

      {hasParams && !itinerary && (
        <div className="text-center py-20">
          <p className="text-lg font-medium text-gray-600 mb-2">{t("noMatch")}</p>
          <p className="text-sm text-gray-400">
            {locale === "ko" ? "선택한 도시에 등록된 코스가 아직 없습니다" : "No courses available for the selected cities yet"}
          </p>
        </div>
      )}

      {itinerary && (
        <div className="space-y-8">
          {/* Summary header */}
          <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-3xl p-8 text-white">
            <div className="flex flex-wrap gap-2 mb-4">
              {itinerary.cities.map((c) => {
                const city = allCities.find((ci) => ci.id === c);
                return <span key={c} className="bg-white/20 backdrop-blur-sm text-white text-xs font-medium px-3 py-1 rounded-full">{city?.label[locale] ?? c}</span>;
              })}
              <span className="bg-white/20 backdrop-blur-sm text-white text-xs font-medium px-3 py-1 rounded-full">
                {durationLabel(Number(duration), locale)}
              </span>
            </div>
            <h2 className="text-2xl font-bold mb-2">
              {locale === "ko"
                ? `${itinerary.cities.map((c) => allCities.find((ci) => ci.id === c)?.label.ko ?? c).join(" + ")} ${duration}박${Number(duration) + 1}일 일정`
                : `${itinerary.cities.map((c) => allCities.find((ci) => ci.id === c)?.label.en ?? c).join(" + ")} ${itinerary.duration}-Day Itinerary`}
            </h2>
            <p className="text-blue-200 text-sm">
              {locale === "ko"
                ? `${itinerary.duration}개 코스가 자동으로 조합되었습니다`
                : `${itinerary.duration} day courses auto-assembled for you`}
            </p>
          </div>

          {/* Day-by-day */}
          {itinerary.days.map((day) => {
            const cityLabel = allCities.find((c) => c.id === day.city)?.label[locale] ?? day.city;
            const prevCity = day.dayNumber > 1 ? itinerary.days[day.dayNumber - 2]?.city : null;
            const isCityChange = prevCity && prevCity !== day.city;

            return (
              <div key={day.dayNumber}>
                {isCityChange && (
                  <div className="flex items-center gap-3 mb-4 py-3 px-4 bg-amber-50 border border-amber-100 rounded-xl">
                    <MapPin className="w-4 h-4 text-amber-600" />
                    <span className="text-sm font-medium text-amber-800">
                      {locale === "ko" ? `${cityLabel}(으)로 이동` : `Travel to ${cityLabel}`}
                    </span>
                  </div>
                )}
                <DayPlanSection
                  day={{
                    day: day.dayNumber,
                    title: day.course.title,
                    subtitle: { en: cityLabel, ko: cityLabel },
                    activities: day.course.activities,
                  }}
                  locale={locale}
                />
              </div>
            );
          })}

          {/* Budget — merge city infos */}
          {cityInfos.length > 0 && cityInfos[0] && (
            <BudgetSection items={cityInfos[0].budget} locale={locale} />
          )}

          {/* FAQ */}
          {cityInfos.length > 0 && cityInfos[0] && cityInfos[0].faq.length > 0 && (
            <FAQSection items={cityInfos[0].faq} locale={locale} />
          )}

          {/* Tours */}
          {matchedTours.length > 0 && (
            <section className="mt-8">
              <div className="mb-4">
                <p className="text-sm font-medium text-amber-600 mb-1">{tDetail("toursLabel")}</p>
                <h2 className="text-xl font-bold text-gray-900">{tDetail("toursHeading")}</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {matchedTours.map((tour) => <TourCard key={tour.id} tour={tour} locale={locale} />)}
              </div>
            </section>
          )}

          {/* Hotels */}
          {matchedHotels.length > 0 && (
            <section className="mt-8">
              <div className="mb-4">
                <p className="text-sm font-medium text-blue-600 mb-1">{tDetail("hotelsLabel")}</p>
                <h2 className="text-xl font-bold text-gray-900">{tDetail("hotelsHeading")}</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {matchedHotels.map((h) => <HotelCard key={h.id} hotel={h} locale={locale} />)}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
}

export default function ItinerariesPage() {
  return (
    <Suspense fallback={<div className="max-w-5xl mx-auto px-4 py-10 text-gray-400">Loading...</div>}>
      <ItinerariesContent />
    </Suspense>
  );
}
