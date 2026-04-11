"use client";

import { Suspense, useState, useRef, useEffect, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { MapPin, Clock, Users, Zap, Search, Check, ChevronDown, X, ExternalLink, Lock, Unlock, RefreshCw, ArrowUp, ArrowDown, Map as MapIcon } from "lucide-react";
import { countries, durationOptions, travelerTypeOptions, styleOptions } from "@/data/destinations";
import { buildItinerary, getMatchedTours, getMatchedHotels } from "@/lib/itinerary-builder";
import { dayCourses } from "@/data/day-courses";
import { getCityInfo } from "@/data/city-info";
import { styleLabel, travelerLabel } from "@/lib/utils";
import { DayPlanSection } from "@/components/itinerary/DayPlanSection";
import { BudgetSection } from "@/components/itinerary/BudgetSection";
import { FAQSection } from "@/components/itinerary/FAQSection";
import { TourCard } from "@/components/tours/TourCard";
import { HotelCard } from "@/components/hotels/HotelCard";
import { BookingChecklist } from "@/components/itinerary/BookingChecklist";
import { CityInfoCard } from "@/components/itinerary/CityInfoCard";
import { SaveItineraryDropdown } from "@/components/ui/SaveItineraryDropdown";
import { OverviewMap } from "@/components/map/OverviewMap";
import type { PlannerInput, TravelerType, TravelStyle, Locale, GeneratedItinerary, GeneratedDay } from "@/types";

const emptyInput: PlannerInput = { destinations: [], duration: "", travelerType: "", styles: [] };

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
  // committedInput is the "submitted" snapshot of input that the itinerary is
  // actually built from. Updating `input` via form edits no longer rebuilds
  // the itinerary — the user has to click the search button (which copies
  // input → committedInput) to apply changes.
  const [committedInput, setCommittedInput] = useState<PlannerInput>(emptyInput);
  const [searched, setSearched] = useState(false);
  const [lockedDays, setLockedDays] = useState<Map<number, { courseId: string; city: string }>>(new Map());
  const [activeCountry, setActiveCountry] = useState(countries[0]?.id ?? "");
  const [refreshKey, setRefreshKey] = useState(0);
  const [dayOrder, setDayOrder] = useState<GeneratedDay[]>([]);
  const resultRef = useRef<HTMLDivElement>(null);

  const [initialCoursesParam] = useState(() => searchParams.get("courses"));

  // Read URL params on mount (from homepage QuickPlanner redirect)
  useEffect(() => {
    const destinations = searchParams.get("destinations")?.split(",").filter(Boolean) ?? [];
    const duration = searchParams.get("duration") ?? "";
    const travelerType = (searchParams.get("travelerType") as TravelerType) ?? "";
    const styles = searchParams.get("styles")?.split(",").filter(Boolean) as TravelStyle[] ?? [];
    if (destinations.length > 0 || duration) {
      const next = { destinations, duration, travelerType, styles };
      setInput(next);
      setCommittedInput(next);
      setSearched(true);
      setTimeout(() => resultRef.current?.scrollIntoView({ behavior: "smooth" }), 300);
    }
  }, [searchParams]);



  function toggleCity(cityId: string) {
    setInput((p) => ({
      ...p,
      destinations: p.destinations.includes(cityId)
        ? p.destinations.filter((d) => d !== cityId)
        : [...p.destinations, cityId],
    }));
  }

  const itinerary = useMemo<GeneratedItinerary | null>(() => {
    if (!searched || !committedInput.destinations.length || !committedInput.duration) return null;
    const locked = lockedDays.size > 0
      ? Array.from(lockedDays.entries()).map(([dayNumber, { courseId, city }]) => ({ dayNumber, courseId, city }))
      : undefined;
    return buildItinerary({
      destinations: committedInput.destinations,
      duration: Number(committedInput.duration) + 1,
      styles: committedInput.styles.length > 0 ? committedInput.styles : undefined,
      travelerType: committedInput.travelerType || undefined,
      lockedDays: locked,
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searched, committedInput, refreshKey]);

  // Sync dayOrder when itinerary changes, or restore from URL (once)
  useEffect(() => {
    if (!itinerary) return;
    if (initialCoursesParam) {
      const courseIds = initialCoursesParam.split(",").filter(Boolean);
      const restored = courseIds.map((id, i) => {
        const course = dayCourses.find((c) => c.id === id);
        return course ? { dayNumber: i + 1, course, city: course.city } as GeneratedDay : null;
      }).filter((d): d is GeneratedDay => d !== null);
      if (restored.length > 0) {
        setDayOrder(restored);
        return;
      }
    }
    setDayOrder(itinerary.days.map((d, i) => ({ ...d, dayNumber: i + 1 })));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [itinerary]);

  function swapDays(indexA: number, indexB: number) {
    setDayOrder((prev) => {
      const next = [...prev];
      [next[indexA], next[indexB]] = [next[indexB], next[indexA]];
      return next.map((d, i) => ({ ...d, dayNumber: i + 1 }));
    });
    setLockedDays(new Map());
  }

  const displayDays = dayOrder.length > 0 ? dayOrder : (itinerary?.days ?? []);

  const matchedTours = itinerary ? getMatchedTours(itinerary) : [];
  const matchedHotels = itinerary ? getMatchedHotels(itinerary) : [];
  const cityInfos = itinerary ? [...new Set(itinerary.cities)].map(getCityInfo).filter(Boolean) : [];
  const allCities = countries.flatMap((c) => c.cities);
  const selectedLabels = input.destinations.map((id) => allCities.find((c) => c.id === id)?.label[locale] ?? id);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    // Commit the current form state — this is the snapshot the itinerary
    // is rebuilt from. Further form edits won't touch the itinerary until
    // the user clicks search again.
    setCommittedInput(input);
    setSearched(true);
    setLockedDays(new Map());
    setDayOrder([]); // clear prior day ordering so the new committed input rebuilds freshly
    // Update URL so back button preserves results
    const params = new URLSearchParams();
    if (input.destinations.length) params.set("destinations", input.destinations.join(","));
    if (input.duration) params.set("duration", input.duration);
    if (input.travelerType) params.set("travelerType", input.travelerType);
    if (input.styles.length) params.set("styles", input.styles.join(","));
    window.history.replaceState(null, "", `?${params.toString()}`);
    setTimeout(() => resultRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
  }

  // Duration validation
  const selectedDuration = durationOptions.find((d) => d.value === input.duration);
  const minCities = selectedDuration?.minCities ?? 1;
  const needMoreCities = input.duration && input.destinations.length < minCities;
  const tooFewStyles = input.styles.length > 0 && input.styles.length < 2;
  const tooManyStyles = input.styles.length > 4;
  const inputComplete = input.destinations.length > 0 && input.duration && input.travelerType && input.styles.length >= 2 && input.styles.length <= 4 && !needMoreCities;

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
        {/* Destination — country tabs + city chips */}
        <div className="flex flex-col gap-3">
          <label className="flex items-center gap-2 text-sm font-semibold text-gray-900">
            <MapPin className="w-4 h-4 text-blue-600" />{t("whereGoing")}
            <span className="text-xs font-normal text-gray-400 ml-2">
              {locale === "ko" ? "복수 선택 가능" : "Multiple cities allowed"}
            </span>
          </label>

          {needMoreCities && (
            <p className="text-xs text-red-500 font-medium">
              {locale === "ko"
                ? `${input.duration}박 이상은 ${minCities}개 도시 이상 선택이 필요합니다`
                : `${input.duration}+ nights requires at least ${minCities} cities`}
            </p>
          )}

          {/* Country tabs */}
          <div className="flex gap-2 border-b border-gray-100 pb-2">
            {countries.map((c) => {
              const hasSelected = c.cities.some((city) => input.destinations.includes(city.id));
              return (
                <button key={c.id} type="button"
                  onClick={() => setActiveCountry(c.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    activeCountry === c.id
                      ? "bg-blue-50 text-blue-700"
                      : hasSelected ? "bg-gray-100 text-gray-800" : "text-gray-500 hover:bg-gray-50"
                  }`}>
                  <span>{c.emoji}</span>
                  <span>{c.label[locale]}</span>
                  {hasSelected && <span className="w-1.5 h-1.5 bg-blue-500 rounded-full" />}
                </button>
              );
            })}
          </div>

          {/* City chips for active country */}
          {(() => {
            const country = countries.find((c) => c.id === activeCountry);
            if (!country) return null;
            return (
              <div className="flex flex-wrap gap-2">
                {country.cities.map((city) => {
                  const selected = input.destinations.includes(city.id);
                  return (
                    <button key={city.id} type="button" onClick={() => toggleCity(city.id)}
                      className={`px-4 py-2 rounded-xl text-sm font-medium border-2 transition-all ${
                        selected ? "border-blue-600 bg-blue-50 text-blue-700" : "border-gray-200 bg-white text-gray-700 hover:border-gray-300"
                      }`}>
                      {city.label[locale]}
                    </button>
                  );
                })}
              </div>
            );
          })()}

          {/* Selected chips */}
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
                <span className="text-base font-bold text-gray-900">
                  {locale === "ko" ? `${d.value}박 ${Number(d.value) + 1}일` : `${Number(d.value) + 1} days`}
                </span>
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

        {/* Style — multi select 2~4 */}
        <div className="flex flex-col gap-3">
          <label className="flex items-center gap-2 text-sm font-semibold text-gray-900">
            <Zap className="w-4 h-4 text-blue-600" />{t("travelStyle")}
            <span className="text-xs font-normal text-gray-400">
              {locale === "ko" ? `${input.styles.length}/4 선택 (2~4개)` : `${input.styles.length}/4 selected (2-4)`}
            </span>
          </label>
          <div className="flex flex-wrap gap-2">
            {styleOptions.map((s) => {
              const selected = input.styles.includes(s.value as TravelStyle);
              const disabled = !selected && input.styles.length >= 4;
              return (
                <button key={s.value} type="button" disabled={disabled}
                  onClick={() => setInput((p) => ({
                    ...p,
                    styles: selected
                      ? p.styles.filter((st) => st !== s.value)
                      : [...p.styles, s.value as TravelStyle],
                  }))}
                  className={`px-3.5 py-2 rounded-full text-sm font-medium border-2 transition-all ${
                    selected ? "border-blue-600 bg-blue-50 text-blue-700" : disabled ? "border-gray-100 bg-gray-50 text-gray-300 cursor-not-allowed" : "border-gray-200 bg-white text-gray-700 hover:border-gray-300"
                  }`}>
                  {s.label[locale]}
                </button>
              );
            })}
          </div>
          {tooFewStyles && (
            <p className="text-xs text-red-500">{locale === "ko" ? "최소 2개 스타일을 선택하세요" : "Select at least 2 styles"}</p>
          )}
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
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 via-blue-700 to-violet-800 text-white p-8 sm:p-10">
              {/* Decorative blobs */}
              <div aria-hidden="true" className="pointer-events-none absolute -top-24 -right-20 w-72 h-72 bg-blue-400/20 rounded-full blur-3xl" />
              <div aria-hidden="true" className="pointer-events-none absolute -bottom-28 -left-16 w-64 h-64 bg-violet-500/25 rounded-full blur-3xl" />
              {/* Subtle dot pattern overlay */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 opacity-[0.08]"
                style={{
                  backgroundImage: "radial-gradient(rgba(255,255,255,0.9) 1px, transparent 1px)",
                  backgroundSize: "18px 18px",
                }}
              />

              <div className="relative z-10">
                {/* Small top label */}
                <div className="inline-flex items-center gap-1.5 bg-white/15 backdrop-blur-sm text-[11px] font-semibold uppercase tracking-[0.14em] px-3 py-1.5 rounded-full mb-6 border border-white/15">
                  <Zap className="w-3.5 h-3.5" />
                  {locale === "ko" ? "나만의 여행 일정" : "Your Itinerary"}
                </div>

                {/* Hero — city names */}
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-[1.1] tracking-tight mb-2">
                  {itinerary.cities.map((c) => allCities.find((ci) => ci.id === c)?.label[locale] ?? c).join(" + ")}
                </h2>

                {/* Duration big subtitle */}
                <p className="text-lg sm:text-xl font-semibold text-blue-100 mb-5">
                  {locale === "ko"
                    ? `${committedInput.duration}박 ${Number(committedInput.duration) + 1}일`
                    : `${itinerary.duration}-Day Trip`}
                </p>

                {/* Metadata icon row */}
                <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-blue-100/90 mb-5">
                  <span className="flex items-center gap-1.5">
                    <MapPin className="w-4 h-4" />
                    {locale === "ko"
                      ? `${itinerary.cities.length}개 도시`
                      : `${itinerary.cities.length} ${itinerary.cities.length === 1 ? "city" : "cities"}`}
                  </span>
                  {committedInput.travelerType && (
                    <span className="flex items-center gap-1.5">
                      <Users className="w-4 h-4" />
                      {travelerLabel(committedInput.travelerType as TravelerType, locale)}
                    </span>
                  )}
                </div>

                {/* Style chips */}
                {committedInput.styles.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {committedInput.styles.map((s) => (
                      <span key={s} className="bg-white/15 backdrop-blur-sm border border-white/15 text-white text-xs font-medium px-3 py-1 rounded-full">
                        {styleLabel(s, locale)}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Overview map — day zones */}
            <OverviewMap days={displayDays} locale={locale} />

            {/* Itinerary overview */}
            <section className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
              <div className="px-5 py-4 bg-gray-50 border-b border-gray-100">
                <h2 className="text-sm font-semibold text-gray-900">
                  {locale === "ko" ? "📋 전체 일정 요약" : "📋 Itinerary Overview"}
                  <span className="text-xs font-normal text-gray-400 ml-2">
                    {locale === "ko" ? "마음에 드는 코스는 고정해 보세요" : "Lock the courses you like"}
                  </span>
                </h2>
              </div>
              <div className="divide-y divide-gray-100">
                {displayDays.map((day, idx) => {
                  const cityLabel = allCities.find((c) => c.id === day.city)?.label[locale] ?? day.city;
                  const isLocked = lockedDays.has(day.dayNumber);
                  const isFirst = idx === 0;
                  const isLast = idx === displayDays.length - 1;
                  return (
                    <div key={day.dayNumber} className="flex items-center gap-2 px-5 py-3 hover:bg-gray-50 transition-colors">
                      {/* Reorder arrows */}
                      <div className="flex flex-col gap-0.5 flex-shrink-0">
                        <button onClick={() => !isFirst && swapDays(idx, idx - 1)} disabled={isFirst}
                          className={`w-5 h-5 flex items-center justify-center rounded ${isFirst ? "text-gray-200" : "text-gray-400 hover:bg-gray-200 hover:text-gray-600"}`}>
                          <ArrowUp className="w-3 h-3" />
                        </button>
                        <button onClick={() => !isLast && swapDays(idx, idx + 1)} disabled={isLast}
                          className={`w-5 h-5 flex items-center justify-center rounded ${isLast ? "text-gray-200" : "text-gray-400 hover:bg-gray-200 hover:text-gray-600"}`}>
                          <ArrowDown className="w-3 h-3" />
                        </button>
                      </div>
                      {/* Lock toggle */}
                      <button
                        onClick={() => {
                          setLockedDays((prev) => {
                            const next = new Map(prev);
                            if (next.has(day.dayNumber)) {
                              next.delete(day.dayNumber);
                            } else {
                              next.set(day.dayNumber, { courseId: day.course.id, city: day.city });
                            }
                            return next;
                          });
                        }}
                        className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors ${
                          isLocked ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-400 hover:bg-gray-200"
                        }`}
                        title={isLocked ? (locale === "ko" ? "고정 해제" : "Unlock") : (locale === "ko" ? "이 코스 고정" : "Lock this course")}
                      >
                        {isLocked ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
                      </button>
                      <a href={`#day-${day.dayNumber}`} className="flex-1 min-w-0 cursor-pointer">
                        <p className="text-sm font-medium text-gray-900 truncate">Day {day.dayNumber} · {day.course.title[locale]}</p>
                        <p className="text-xs text-gray-400 truncate">{day.course.summary[locale]}</p>
                      </a>
                      <span className="text-xs text-gray-300 flex-shrink-0">{cityLabel}</span>
                    </div>
                  );
                })}
              </div>

              {/* Refresh unlocked */}
              {lockedDays.size > 0 && lockedDays.size < displayDays.length && (
                <div className="px-5 py-3 border-t border-gray-100">
                  <button
                    onClick={() => setRefreshKey((k) => k + 1)}
                    className="w-full flex items-center justify-center gap-2 bg-blue-50 hover:bg-blue-100 text-blue-700 text-sm font-medium py-2.5 px-4 rounded-xl transition-colors"
                  >
                    <RefreshCw className="w-4 h-4" />
                    {locale === "ko"
                      ? `마음에 안 드는 ${displayDays.length - lockedDays.size}개 일정만 다시 추천받기`
                      : `Reshuffle ${displayDays.length - lockedDays.size} unlocked days`}
                  </button>
                </div>
              )}

              {/* Save itinerary */}
              <SaveItineraryDropdown locale={locale} days={displayDays} duration={committedInput.duration} itinerary={itinerary} />
            </section>

            {/* Day-by-day with per-day maps */}
            <section>
              <h2 className="text-lg font-bold text-gray-900 mb-4">{tDetail("dayByDayPlan")}</h2>
              <div className="space-y-6">
                {displayDays.map((day, idx) => {
                  const cityLabel = allCities.find((c) => c.id === day.city)?.label[locale] ?? day.city;
                  const prevCity = idx > 0 ? displayDays[idx - 1]?.city : null;
                  const isCityChange = prevCity && prevCity !== day.city;
                  return (
                    <div key={day.dayNumber} id={`day-${day.dayNumber}`} className="scroll-mt-20">
                      {isCityChange && (
                        <div className="flex items-center gap-3 mb-3 py-2.5 px-4 bg-amber-50 border border-amber-100 rounded-xl">
                          <MapPin className="w-4 h-4 text-amber-600" />
                          <span className="text-sm font-medium text-amber-800">
                            {locale === "ko" ? `${cityLabel}(으)로 이동` : `Travel to ${cityLabel}`}
                          </span>
                        </div>
                      )}
                      {/* Per-day map (user-uploaded, locale-specific). Falls back to a placeholder. */}
                      {day.course.mapImage?.[locale] ? (
                        <div className="relative w-full rounded-xl overflow-hidden border border-gray-100" style={{ aspectRatio: "800 / 280" }}>
                          <Image
                            src={day.course.mapImage[locale]}
                            alt={locale === "ko" ? `Day ${day.dayNumber} ${day.course.title.ko} 지도` : `Day ${day.dayNumber} ${day.course.title.en} map`}
                            fill
                            sizes="(max-width: 768px) 100vw, 800px"
                            className="object-cover"
                          />
                        </div>
                      ) : (
                        <div className="h-[200px] rounded-xl bg-gray-50 border border-dashed border-gray-200 flex items-center justify-center">
                          <div className="text-center px-4">
                            <MapIcon className="w-7 h-7 text-gray-300 mx-auto mb-1.5" />
                            <p className="text-sm text-gray-400">
                              {locale === "ko" ? "일자별 지도 준비 중" : "Day map coming soon"}
                            </p>
                          </div>
                        </div>
                      )}
                      <div className="mt-3">
                        <DayPlanSection
                          day={{
                            day: day.dayNumber,
                            title: day.course.title,
                            subtitle: { en: cityLabel, ko: cityLabel },
                            summary: day.course.summary,
                            activities: day.course.activities,
                            whyThisCourse: day.course.whyThisCourse,
                            courseType: day.course.courseType,
                            costs: day.course.costs,
                            googleMapsUrl: day.course.googleMapsUrl,
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
              <BudgetSection itinerary={itinerary} locale={locale} nights={Number(committedInput.duration)} />
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
