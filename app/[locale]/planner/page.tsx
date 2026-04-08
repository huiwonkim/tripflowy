"use client";

import { Suspense, useState, useRef, useEffect, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { MapPin, Clock, Users, Zap, Search, Check, ChevronDown, X, ExternalLink } from "lucide-react";
import { countries, durationOptions, travelerTypeOptions, styleOptions } from "@/data/destinations";
import { buildItinerary, getMatchedTours, getMatchedHotels } from "@/lib/itinerary-builder";
import { getCityInfo } from "@/data/city-info";
import { durationLabel, styleLabel, travelerLabel } from "@/lib/utils";
import { DayPlanSection } from "@/components/itinerary/DayPlanSection";
import { BudgetSection } from "@/components/itinerary/BudgetSection";
import { FAQSection } from "@/components/itinerary/FAQSection";
import { TourCard } from "@/components/tours/TourCard";
import { HotelCard } from "@/components/hotels/HotelCard";
import { ItineraryMap } from "@/components/map/ItineraryMap";
import { BookingChecklist } from "@/components/itinerary/BookingChecklist";
import { CityInfoCard } from "@/components/itinerary/CityInfoCard";
import type { PlannerInput, TravelerType, TravelStyle, Locale, GeneratedItinerary } from "@/types";

const emptyInput: PlannerInput = { destinations: [], duration: "", travelerType: "", style: "" };

export default function PlannerPage() {
  return (
    <Suspense fallback={<div className="max-w-3xl mx-auto px-4 py-12 text-gray-400">Loading...</div>}>
      <PlannerContent />
    </Suspense>
  );
}

function PlannerContent() {
  const locale = useLocale() as Locale;
  const t = useTranslations("planner");
  const tDetail = useTranslations("detail");
  const searchParams = useSearchParams();
  const [input, setInput] = useState<PlannerInput>(emptyInput);
  const [searched, setSearched] = useState(false);
  const resultRef = useRef<HTMLDivElement>(null);

  // Read URL params on mount (from homepage QuickPlanner redirect)
  useEffect(() => {
    const destinations = searchParams.get("destinations")?.split(",").filter(Boolean) ?? [];
    const duration = searchParams.get("duration") ?? "";
    const travelerType = (searchParams.get("travelerType") as TravelerType) ?? "";
    const style = (searchParams.get("style") as TravelStyle) ?? "";
    if (destinations.length > 0 || duration) {
      setInput({ destinations, duration, travelerType, style });
      setSearched(true);
      setTimeout(() => resultRef.current?.scrollIntoView({ behavior: "smooth" }), 300);
    }
  }, [searchParams]);

  // Destination multi-select dropdown
  const [destOpen, setDestOpen] = useState(false);
  const destDropdownRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (destDropdownRef.current && !destDropdownRef.current.contains(e.target as Node)) setDestOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  function toggleCity(cityId: string) {
    setInput((p) => ({
      ...p,
      destinations: p.destinations.includes(cityId)
        ? p.destinations.filter((d) => d !== cityId)
        : [...p.destinations, cityId],
    }));
  }

  const itinerary = useMemo<GeneratedItinerary | null>(() => {
    if (!searched || !input.destinations.length || !input.duration) return null;
    return buildItinerary({
      destinations: input.destinations,
      duration: Number(input.duration) + 1,
      style: input.style || undefined,
      travelerType: input.travelerType || undefined,
    });
  }, [searched, input]);

  const matchedTours = itinerary ? getMatchedTours(itinerary) : [];
  const matchedHotels = itinerary ? getMatchedHotels(itinerary) : [];
  const cityInfos = itinerary ? [...new Set(itinerary.cities)].map(getCityInfo).filter(Boolean) : [];
  const allCities = countries.flatMap((c) => c.cities);
  const selectedLabels = input.destinations.map((id) => allCities.find((c) => c.id === id)?.label[locale] ?? id);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    setSearched(true);
    setTimeout(() => resultRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
  }

  const inputComplete = input.destinations.length > 0 && input.duration && input.travelerType && input.style;

  const optionBase = "flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all text-left";
  const optionSelected = "border-blue-600 bg-blue-50";
  const optionDefault = "border-gray-200 bg-white hover:border-gray-300";

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      {/* Header */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 text-xs font-medium px-3 py-1.5 rounded-full mb-4">
          <Zap className="w-3.5 h-3.5" />{t("badge")}
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-3">{t("heading")}</h1>
        <p className="text-gray-500">{t("subheading")}</p>
      </div>

      <form onSubmit={handleSearch} className="space-y-8">
        {/* Destination — multi-select with dropdown */}
        <div className="flex flex-col gap-3">
          <label className="flex items-center gap-2 text-sm font-semibold text-gray-900">
            <MapPin className="w-4 h-4 text-blue-600" />{t("whereGoing")}
          </label>

          <div className="relative" ref={destDropdownRef}>
            <button type="button" onClick={() => setDestOpen((o) => !o)}
              className="w-full bg-white border-2 border-gray-200 rounded-xl px-4 py-3 text-sm text-left flex items-center justify-between hover:border-gray-300 transition min-h-[48px]">
              {input.destinations.length === 0 ? (
                <span className="text-gray-400">{t("destination")}</span>
              ) : (
                <span className="text-gray-800 font-medium">{selectedLabels.join(", ")}</span>
              )}
              <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${destOpen ? "rotate-180" : ""}`} />
            </button>

            {destOpen && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-xl z-50 max-h-72 overflow-y-auto">
                {countries.map((c) => (
                  <div key={c.id}>
                    <p className="px-4 py-2 text-xs font-semibold text-gray-400 bg-gray-50 sticky top-0">{c.emoji} {c.label[locale]}</p>
                    {c.cities.map((city) => {
                      const checked = input.destinations.includes(city.id);
                      return (
                        <label key={city.id} className="flex items-center gap-3 px-4 py-2.5 hover:bg-blue-50 cursor-pointer text-sm">
                          <input type="checkbox" checked={checked} onChange={() => toggleCity(city.id)}
                            className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                          <span className={checked ? "font-medium text-gray-900" : "text-gray-700"}>{city.label[locale]}</span>
                        </label>
                      );
                    })}
                  </div>
                ))}
              </div>
            )}
          </div>

          {input.destinations.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {input.destinations.map((id) => {
                const city = allCities.find((c) => c.id === id);
                return city ? (
                  <span key={id} className="inline-flex items-center gap-1 bg-blue-100 text-blue-700 text-xs font-medium px-2.5 py-1 rounded-full">
                    {city.label[locale]}
                    <button type="button" onClick={() => toggleCity(id)} className="hover:text-blue-900"><X className="w-3 h-3" /></button>
                  </span>
                ) : null;
              })}
            </div>
          )}
        </div>

        {/* Duration */}
        <div className="flex flex-col gap-3">
          <label className="flex items-center gap-2 text-sm font-semibold text-gray-900">
            <Clock className="w-4 h-4 text-blue-600" />{t("howLong")}
          </label>
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
            {durationOptions.map((d) => (
              <button key={d.value} type="button" onClick={() => setInput((p) => ({ ...p, duration: d.value }))}
                className={`flex flex-col items-center gap-1 p-3 rounded-xl border-2 cursor-pointer transition-all ${input.duration === d.value ? optionSelected : optionDefault}`}>
                <span className="text-lg font-bold text-gray-900">{d.value}N</span>
                <span className="text-[11px] text-gray-500">{d.label[locale]}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Traveler type */}
        <div className="flex flex-col gap-3">
          <label className="flex items-center gap-2 text-sm font-semibold text-gray-900">
            <Users className="w-4 h-4 text-blue-600" />{t("whosTraveling")}
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {travelerTypeOptions.map((tt) => (
              <button key={tt.value} type="button" onClick={() => setInput((p) => ({ ...p, travelerType: tt.value as TravelerType }))}
                className={`${optionBase} ${input.travelerType === tt.value ? optionSelected : optionDefault} justify-center py-3`}>
                <span className="text-lg">{tt.emoji}</span>
                <span className="text-sm font-medium text-gray-900">{tt.label[locale]}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Style */}
        <div className="flex flex-col gap-3">
          <label className="flex items-center gap-2 text-sm font-semibold text-gray-900">
            <Zap className="w-4 h-4 text-blue-600" />{t("travelStyle")}
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {styleOptions.map((s) => (
              <button key={s.value} type="button" onClick={() => setInput((p) => ({ ...p, style: s.value as TravelStyle }))}
                className={`${optionBase} ${input.style === s.value ? optionSelected : optionDefault}`}>
                <div>
                  <p className="text-sm font-semibold text-gray-900">{s.label[locale]}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{s.description[locale]}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        <button type="submit" disabled={!inputComplete}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed text-white font-semibold py-4 px-6 rounded-2xl transition-colors flex items-center justify-center gap-2 text-base">
          <Search className="w-5 h-5" />
          {inputComplete ? t("findMyItinerary") : t("selectAllOptions")}
        </button>
      </form>

      {/* ═══ Results ═══ */}
      <div ref={resultRef}>
        {searched && !itinerary && (
          <div className="text-center py-16 mt-8">
            <p className="text-lg font-medium text-gray-600 mb-2">{t("noMatch")}</p>
            <p className="text-sm text-gray-400">
              {locale === "ko" ? "선택한 도시에 등록된 코스가 아직 없습니다. 다른 도시를 선택해보세요." : "No courses available for these cities yet. Try different destinations."}
            </p>
          </div>
        )}

        {itinerary && (
          <div className="mt-12 space-y-8">
            {/* Summary banner */}
            <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-3xl p-6 sm:p-8 text-white">
              <div className="flex flex-wrap gap-2 mb-3">
                {itinerary.cities.map((c) => {
                  const city = allCities.find((ci) => ci.id === c);
                  return <span key={c} className="bg-white/20 backdrop-blur-sm text-white text-xs font-medium px-3 py-1 rounded-full">{city?.label[locale] ?? c}</span>;
                })}
                <span className="bg-white/20 backdrop-blur-sm text-white text-xs font-medium px-3 py-1 rounded-full">{durationLabel(Number(input.duration), locale)}</span>
                {input.style && <span className="bg-white/20 backdrop-blur-sm text-white text-xs font-medium px-3 py-1 rounded-full">{styleLabel(input.style as TravelStyle, locale)}</span>}
              </div>
              <h2 className="text-xl sm:text-2xl font-bold mb-1">
                {locale === "ko"
                  ? `${itinerary.cities.map((c) => allCities.find((ci) => ci.id === c)?.label.ko ?? c).join(" + ")} ${input.duration}박${Number(input.duration) + 1}일`
                  : `${itinerary.cities.map((c) => allCities.find((ci) => ci.id === c)?.label.en ?? c).join(" + ")} ${itinerary.duration}-Day Trip`}
              </h2>
              <p className="text-blue-200 text-sm">
                {locale === "ko" ? `${itinerary.duration}개 코스 자동 조합` : `${itinerary.duration} courses auto-assembled`}
              </p>
            </div>

            {/* Day-by-day with per-day maps */}
            <section>
              <h2 className="text-lg font-bold text-gray-900 mb-4">{tDetail("dayByDayPlan")}</h2>
              <div className="space-y-6">
                {itinerary.days.map((day) => {
                  const cityLabel = allCities.find((c) => c.id === day.city)?.label[locale] ?? day.city;
                  const prevCity = day.dayNumber > 1 ? itinerary.days[day.dayNumber - 2]?.city : null;
                  const isCityChange = prevCity && prevCity !== day.city;
                  return (
                    <div key={day.dayNumber}>
                      {isCityChange && (
                        <div className="flex items-center gap-3 mb-3 py-2.5 px-4 bg-amber-50 border border-amber-100 rounded-xl">
                          <MapPin className="w-4 h-4 text-amber-600" />
                          <span className="text-sm font-medium text-amber-800">
                            {locale === "ko" ? `${cityLabel}(으)로 이동` : `Travel to ${cityLabel}`}
                          </span>
                        </div>
                      )}
                      {/* Per-day map */}
                      <ItineraryMap days={[day]} locale={locale} mapId={`day-${day.dayNumber}`} height={280} />
                      <div className="mt-3">
                        <DayPlanSection
                          day={{
                            day: day.dayNumber,
                            title: day.course.title,
                            subtitle: { en: cityLabel, ko: cityLabel },
                            activities: day.course.activities,
                            whyThisCourse: day.course.whyThisCourse,
                            courseType: day.course.courseType,
                            costs: day.course.costs,
                          }}
                          locale={locale}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* Budget */}
            {itinerary && (
              <BudgetSection itinerary={itinerary} locale={locale} nights={Number(input.duration)} />
            )}

            {/* City Info */}
            {cityInfos.map((ci) => {
              if (!ci?.info) return null;
              const cityLabel = allCities.find((c) => c.id === ci.cityId)?.label[locale] ?? ci.cityId;
              return <CityInfoCard key={ci.cityId} info={ci.info} cityName={cityLabel} locale={locale} />;
            })}

            {/* FAQ */}
            {cityInfos.length > 0 && cityInfos[0] && cityInfos[0].faq.length > 0 && (
              <FAQSection items={cityInfos[0].faq} locale={locale} />
            )}

            {/* Tours */}
            {matchedTours.length > 0 && (
              <section className="mt-10">
                <div className="mb-4">
                  <p className="text-sm font-medium text-amber-600 mb-1">{tDetail("toursLabel")}</p>
                  <h2 className="text-lg font-bold text-gray-900">{tDetail("toursHeading")}</h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {matchedTours.map((tour) => <TourCard key={tour.id} tour={tour} locale={locale} />)}
                </div>
              </section>
            )}

            {/* Hotels */}
            {matchedHotels.length > 0 && (
              <section className="mt-10">
                <div className="mb-4">
                  <p className="text-sm font-medium text-blue-600 mb-1">{tDetail("hotelsLabel")}</p>
                  <h2 className="text-lg font-bold text-gray-900">{tDetail("hotelsHeading")}</h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {matchedHotels.map((h) => <HotelCard key={h.id} hotel={h} locale={locale} />)}
                </div>
              </section>
            )}

            {/* Booking Checklist */}
            {itinerary && (
              <BookingChecklist itinerary={itinerary} locale={locale} />
            )}

            {/* CTA */}
            {(matchedTours.length > 0 || matchedHotels.length > 0) && (
              <div className="mt-10 bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl p-6 text-white text-center">
                <h2 className="text-xl font-bold mb-2">{tDetail("ctaHeading")}</h2>
                <p className="text-blue-200 text-sm mb-5">{tDetail("ctaSubheading")}</p>
                <div className="flex flex-wrap gap-3 justify-center">
                  {matchedTours[0] && (
                    <a href={matchedTours[0].affiliateUrl} target="_blank" rel="noopener noreferrer sponsored"
                      className="bg-amber-500 hover:bg-amber-600 text-white font-semibold px-5 py-2.5 rounded-xl transition-colors flex items-center gap-2 text-sm">
                      {tDetail("bookFirstTour")} <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                  {matchedHotels[0] && (
                    <a href={matchedHotels[0].affiliateUrl} target="_blank" rel="noopener noreferrer sponsored"
                      className="bg-white/20 hover:bg-white/30 text-white font-semibold px-5 py-2.5 rounded-xl transition-colors flex items-center gap-2 text-sm">
                      {tDetail("checkHotels")} <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
