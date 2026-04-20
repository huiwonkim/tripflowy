"use client";

import { Suspense, useState, useRef, useEffect, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { MapPin, Clock, Users, Zap, Search, Check, ChevronDown, X, ExternalLink, Lock, Unlock, RefreshCw, ArrowUp, ArrowDown, Map as MapIcon, Calendar, Gauge, Plane } from "lucide-react";
import { countries, durationOptions, travelerTypeOptions, styleOptions, airports } from "@/data/destinations";
import { buildItinerary, getMatchedTours, getMatchedHotels } from "@/lib/itinerary-builder";
import { buildItineraryFromSpotIds } from "@/lib/spot-builder";
import { decodeItinerary } from "@/lib/itinerary-encoding";
import { AccommodationPicker } from "@/components/planner/AccommodationPicker";
import { TemplateRecommendations, type TemplateApplyTarget } from "@/components/planner/TemplateRecommendations";
import type { DayTemplate } from "@/types/spot";
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
import { DayRouteMap } from "@/components/map/DayRouteMap";
import { generateTripJsonLd } from "@/lib/jsonld";
import type { PlannerInput, TravelerType, TravelStyle, Locale, GeneratedItinerary, GeneratedDay, AccommodationInput } from "@/types";
import type { Pace } from "@/types/spot";

const emptyInput: PlannerInput = { destinations: [], duration: "", travelerType: "", styles: [], pace: "balanced" };

const paceOptions: { value: Pace; emoji: string; label: { en: string; ko: string }; sub: { en: string; ko: string } }[] = [
  { value: "relaxed", emoji: "🌿", label: { en: "Relaxed", ko: "여유롭게" }, sub: { en: "3 sights/day", ko: "하루 3곳" } },
  { value: "balanced", emoji: "⚖️", label: { en: "Balanced", ko: "적당히" }, sub: { en: "4 sights/day", ko: "하루 4곳" } },
  { value: "packed", emoji: "⚡", label: { en: "Packed", ko: "알차게" }, sub: { en: "6 sights/day", ko: "하루 6곳" } },
];

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

  // `forcedSpots` is set when the user arrives via a v2 share URL. In that case
  // we bypass the engine's random scoring and rebuild the itinerary from the
  // exact spot ids the sharer saw.
  const [forcedSpots, setForcedSpots] = useState<{ spots: string[][]; cities: string[] } | null>(null);

  // Read URL params on mount. Supports two shapes:
  //   1) v2 shared URL: `?v=2&s=<base64>` — restores exact itinerary + input
  //   2) Legacy QuickPlanner redirect: `?destinations=tokyo&duration=2&…`
  // The old `?courses=...` URL is intentionally unsupported (see plan §6).
  useEffect(() => {
    // v2 shared URL first
    const version = searchParams.get("v");
    const encoded = searchParams.get("s");
    if (version === "2" && encoded) {
      const payload = decodeItinerary(encoded);
      if (payload) {
        const accommodations: Record<string, { label: string; location: { lat: number; lng: number }; source: "manual" }> = {};
        if (payload.ac) {
          for (const [city, [lat, lng]] of Object.entries(payload.ac)) {
            accommodations[city] = { label: "", location: { lat, lng }, source: "manual" };
          }
        }
        const next: PlannerInput = {
          destinations: payload.d,
          duration: String(payload.n),
          travelerType: (payload.t as TravelerType) ?? "",
          styles: payload.st ?? [],
          pace: payload.p ?? "balanced",
          ...(payload.sd ? { startDate: payload.sd } : {}),
          ...(Object.keys(accommodations).length > 0 ? { accommodations } : {}),
        };
        setInput(next);
        setCommittedInput(next);
        setForcedSpots({ spots: payload.sp, cities: payload.cp ?? [] });
        setSearched(true);
        setTimeout(() => resultRef.current?.scrollIntoView({ behavior: "smooth" }), 300);
        return;
      }
    }

    // Legacy params (homepage redirect etc.)
    const destinations = searchParams.get("destinations")?.split(",").filter(Boolean) ?? [];
    const duration = searchParams.get("duration") ?? "";
    const travelerType = (searchParams.get("travelerType") as TravelerType) ?? "";
    const styles = searchParams.get("styles")?.split(",").filter(Boolean) as TravelStyle[] ?? [];
    const paceParam = searchParams.get("pace") as Pace | null;
    const pace: Pace = paceParam === "relaxed" || paceParam === "balanced" || paceParam === "packed"
      ? paceParam
      : "balanced";
    const startDate = searchParams.get("startDate") ?? undefined;
    const arrAirport = searchParams.get("arrAirport") ?? undefined;
    const arrTime = searchParams.get("arrTime") ?? undefined;
    const depAirport = searchParams.get("depAirport") ?? undefined;
    const depTime = searchParams.get("depTime") ?? undefined;
    if (destinations.length > 0 || duration) {
      const next: PlannerInput = {
        destinations, duration, travelerType, styles, pace,
        ...(startDate ? { startDate } : {}),
        ...(arrAirport || arrTime ? { arrival: { airport: arrAirport, time: arrTime } } : {}),
        ...(depAirport || depTime ? { departure: { airport: depAirport, time: depTime } } : {}),
      };
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

  // Airports limited to cities the traveler has actually selected.
  // Empty until at least one city is picked — avoids dumping every JP airport
  // in the dropdown up front.
  const relevantAirports = useMemo(
    () => airports.filter((a) => input.destinations.includes(a.cityId)),
    [input.destinations],
  );

  // Split flight time into hour + minute selects. Each dropdown stays
  // short (24 / 4 items) so users don't have to scroll through a 48-item
  // list. Stored value is combined as "HH:MM" — same format the engine parses.
  const flightHourOptions = useMemo(
    () => Array.from({ length: 24 }, (_, h) => String(h).padStart(2, "0")),
    [],
  );
  const flightMinuteOptions = useMemo(() => ["00", "15", "30", "45"], []);

  function parseHHMM(t: string | undefined): { h: string; m: string } {
    if (!t) return { h: "", m: "" };
    const [h, m] = t.split(":");
    return { h: h ?? "", m: m ?? "" };
  }
  function joinHHMM(h: string, m: string): string | undefined {
    if (!h && !m) return undefined;
    // Fill the missing half with "00" so the select sticks immediately after
    // the user's first pick. Previously we required both parts which caused
    // the dropdown to visually reset (no commit → next render read h="" back).
    return `${h || "00"}:${m || "00"}`;
  }

  // If the user deselects a city and the previously-chosen airport belonged
  // to it, clear the stale selection so the form doesn't silently carry a
  // now-invalid airport code into the engine.
  useEffect(() => {
    const validCodes = new Set(relevantAirports.map((a) => a.code));
    setInput((p) => {
      let next = p;
      if (p.arrival?.airport && !validCodes.has(p.arrival.airport)) {
        next = { ...next, arrival: { ...next.arrival, airport: undefined } };
      }
      if (p.departure?.airport && !validCodes.has(p.departure.airport)) {
        next = { ...next, departure: { ...next.departure, airport: undefined } };
      }
      return next;
    });
  }, [relevantAirports]);

  const itinerary = useMemo<GeneratedItinerary | null>(() => {
    if (!searched || !committedInput.destinations.length || !committedInput.duration) return null;
    const locked = lockedDays.size > 0
      ? Array.from(lockedDays.entries()).map(([dayNumber, { courseId, city }]) => ({ dayNumber, courseId, city }))
      : undefined;

    // Build accommodations once — reused whether the itinerary is forced (shared URL)
    // or freshly generated by the engine.
    const citiesFlatEarly = countries.flatMap((c) => c.cities);
    const accommodationCoordsShared: Record<string, { lat: number; lng: number }> = {};
    for (const cityId of committedInput.destinations) {
      const acc = committedInput.accommodations?.[cityId];
      if (acc?.location) {
        accommodationCoordsShared[cityId] = acc.location;
      } else {
        const city = citiesFlatEarly.find((c) => c.id === cityId);
        if (city?.defaultAccommodation) {
          accommodationCoordsShared[cityId] = city.defaultAccommodation.location;
        }
      }
    }

    // v2 share URL path — reconstruct the exact shared itinerary from spot IDs
    if (forcedSpots && forcedSpots.spots.length > 0) {
      return buildItineraryFromSpotIds({
        spotsPerDay: forcedSpots.spots,
        cityPerDay: forcedSpots.cities.length > 0 ? forcedSpots.cities : undefined,
        styles: committedInput.styles.length > 0 ? committedInput.styles : undefined,
        travelerType: committedInput.travelerType || undefined,
        accommodations: Object.keys(accommodationCoordsShared).length > 0 ? accommodationCoordsShared : undefined,
        pace: committedInput.pace,
        arrival: committedInput.arrival,
        departure: committedInput.departure,
      });
    }
    return buildItinerary({
      destinations: committedInput.destinations,
      duration: Number(committedInput.duration) + 1,
      styles: committedInput.styles.length > 0 ? committedInput.styles : undefined,
      travelerType: committedInput.travelerType || undefined,
      lockedDays: locked,
      pace: committedInput.pace,
      accommodations: Object.keys(accommodationCoordsShared).length > 0 ? accommodationCoordsShared : undefined,
      startDate: committedInput.startDate,
      arrival: committedInput.arrival,
      departure: committedInput.departure,
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searched, committedInput, refreshKey, forcedSpots, lockedDays]);

  // Sync dayOrder whenever the itinerary is (re)built.
  useEffect(() => {
    if (!itinerary) return;
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

  /**
   * Apply a recommended template to either an existing Day (overwrite) or append
   * it as a new Day (duration +1). Snapshots the current spots/cities from
   * displayDays and patches just the targeted day — the rest of the itinerary
   * stays intact.
   */
  function applyTemplate(template: DayTemplate, target: TemplateApplyTarget) {
    const baseDays = dayOrder.length > 0 ? dayOrder : (itinerary?.days ?? []);
    if (baseDays.length === 0) return;

    const currentSpots: string[][] = baseDays.map((d) =>
      d.course.activities
        .map((a) => a.spotId)
        .filter((x): x is string => !!x),
    );
    const currentCities: string[] = baseDays.map((d) => d.city);

    if (target === "new") {
      currentSpots.push(template.spotIds);
      currentCities.push(template.city);
      // duration stores nights, so +1 day = +1 night
      setCommittedInput((p) => ({ ...p, duration: String(Number(p.duration || "0") + 1) }));
      setInput((p) => ({ ...p, duration: String(Number(p.duration || "0") + 1) }));
    } else {
      const idx = target - 1; // dayNumber → array index
      if (idx < 0 || idx >= currentSpots.length) return;
      currentSpots[idx] = template.spotIds;
      currentCities[idx] = template.city;
    }

    setForcedSpots({ spots: currentSpots, cities: currentCities });
    setLockedDays(new Map()); // dayNumber renumbering would invalidate locks
  }

  const displayDays = dayOrder.length > 0 ? dayOrder : (itinerary?.days ?? []);

  // Primary city (most days) drives the banner hero image — matches BudgetSection.
  const primaryCityId = useMemo(() => {
    if (displayDays.length === 0) return null;
    const counts: Record<string, number> = {};
    for (const d of displayDays) counts[d.city] = (counts[d.city] ?? 0) + 1;
    return Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0] ?? null;
  }, [displayDays]);

  const heroImageUrl = primaryCityId
    ? countries.flatMap((c) => c.cities).find((c) => c.id === primaryCityId)?.heroImage
    : undefined;
  const [heroImageFailed, setHeroImageFailed] = useState(false);
  // Reset the failed flag whenever the target URL changes so a new city gets a fresh try.
  useEffect(() => {
    setHeroImageFailed(false);
  }, [heroImageUrl]);
  const showHeroImage = Boolean(heroImageUrl) && !heroImageFailed;

  const matchedTours = itinerary ? getMatchedTours(itinerary) : [];
  const matchedHotels = itinerary ? getMatchedHotels(itinerary) : [];
  const cityInfos = itinerary ? [...new Set(itinerary.cities)].map(getCityInfo).filter(Boolean) : [];
  const allCities = countries.flatMap((c) => c.cities);

  // Inject Trip JSON-LD when itinerary is available (client-side)
  useEffect(() => {
    const id = "tripflowy-trip-jsonld";
    const existing = document.getElementById(id);
    if (!itinerary) {
      existing?.remove();
      return;
    }
    const cityLabels = [...new Set(itinerary.cities)].map(
      (cId) => allCities.find((c) => c.id === cId)?.label[locale] ?? cId,
    );
    const jsonLd = generateTripJsonLd(itinerary, locale as "en" | "ko", cityLabels);
    const script = (existing as HTMLScriptElement | null) ?? document.createElement("script");
    script.id = id;
    script.type = "application/ld+json";
    script.textContent = JSON.stringify(jsonLd);
    if (!existing) document.head.appendChild(script);
    return () => { document.getElementById(id)?.remove(); };
  }, [itinerary, locale, allCities]);
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
    setForcedSpots(null); // discard any shared-URL restore so the engine picks fresh spots
    // Update URL so back button preserves results
    const params = new URLSearchParams();
    if (input.destinations.length) params.set("destinations", input.destinations.join(","));
    if (input.duration) params.set("duration", input.duration);
    if (input.travelerType) params.set("travelerType", input.travelerType);
    if (input.styles.length) params.set("styles", input.styles.join(","));
    if (input.pace && input.pace !== "balanced") params.set("pace", input.pace);
    if (input.startDate) params.set("startDate", input.startDate);
    if (input.arrival?.airport) params.set("arrAirport", input.arrival.airport);
    if (input.arrival?.time) params.set("arrTime", input.arrival.time);
    if (input.departure?.airport) params.set("depAirport", input.departure.airport);
    if (input.departure?.time) params.set("depTime", input.departure.time);
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
  const optionSelected = "border-blue-600 bg-blue-50 ring-4 ring-blue-500/10";
  const optionDefault = "border-gray-200 bg-white hover:border-gray-300";

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-14">
      {/* Header — soft brand hero */}
      <div className="relative text-center mb-14">
        <span aria-hidden className="pointer-events-none absolute left-1/2 -translate-x-1/2 -top-8 w-[32rem] h-[32rem] max-w-[90vw] rounded-full bg-gradient-to-br from-blue-100/70 via-indigo-100/40 to-transparent blur-3xl" />
        <div className="relative">
          <div className="inline-flex items-center gap-2 bg-white border border-blue-100 text-blue-700 text-xs font-semibold uppercase tracking-[0.12em] px-3.5 py-1.5 rounded-full mb-5 shadow-card">
            <Zap className="w-3.5 h-3.5" />{t("badge")}
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 tracking-tight leading-[1.1] mb-4">{t("heading")}</h1>
          <p className="text-gray-500 text-lg max-w-xl mx-auto">{t("subheading")}</p>
        </div>
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
                        selected ? "border-blue-600 bg-blue-50 text-blue-700 ring-4 ring-blue-500/10" : "border-gray-200 bg-white text-gray-700 hover:border-gray-300"
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

        {/* Duration + Start date — side-by-side on md+, stacked on mobile */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Duration — dropdown for 2~9 nights */}
          <div className="flex flex-col gap-3">
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-900">
              <Clock className="w-4 h-4 text-blue-600" />{t("howLong")}
            </label>
            <div className="relative w-full">
              <select
                value={input.duration}
                onChange={(e) => setInput((p) => ({ ...p, duration: e.target.value }))}
                className={`w-full appearance-none px-4 py-3 pr-10 rounded-xl border-2 bg-white text-sm font-medium text-gray-900 focus:border-blue-500 focus:outline-none cursor-pointer transition-colors ${
                  input.duration ? "border-blue-600" : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <option value="">{locale === "ko" ? "기간 선택" : "Select duration"}</option>
                {durationOptions.map((d) => (
                  <option key={d.value} value={d.value}>
                    {d.label[locale]}
                    {d.minCities > 1
                      ? locale === "ko" ? ` · 도시 ${d.minCities}개+` : ` · ${d.minCities}+ cities`
                      : ""}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            </div>
          </div>

          {/* Start date (optional) */}
          <div className="flex flex-col gap-3">
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-900">
              <Calendar className="w-4 h-4 text-blue-600" />
              {locale === "ko" ? "출발일 (선택)" : "Start date (optional)"}
              <span className="text-xs font-normal text-gray-400 ml-2 hidden lg:inline">
                {locale === "ko" ? "정기휴무일 자동 제외" : "Skips closed days"}
              </span>
            </label>
            <input
              type="date"
              value={input.startDate ?? ""}
              onChange={(e) => setInput((p) => ({ ...p, startDate: e.target.value || undefined }))}
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 bg-white text-sm text-gray-900 focus:border-blue-500 focus:outline-none transition-colors"
            />
          </div>
        </div>

        {/* Arrival / Departure flight info (optional)
            Two rows, each: [direction label] [airport select (flex-grow)] [time input].
            Much less visual weight than the previous two-card grid. */}
        <div className="flex flex-col gap-3">
          <label className="flex items-center gap-2 text-sm font-semibold text-gray-900">
            <Plane className="w-4 h-4 text-blue-600" />
            {locale === "ko" ? "입·출국 정보 (선택)" : "Arrival / Departure (optional)"}
            <span className="text-xs font-normal text-gray-400 ml-2">
              {locale === "ko" ? "첫·마지막 날 시간 계산용" : "Adjusts first/last day"}
            </span>
          </label>

          {([
            {
              kind: "arrival" as const,
              label: locale === "ko" ? "입국" : "Arrival",
              airport: input.arrival?.airport ?? "",
              time: input.arrival?.time ?? "",
            },
            {
              kind: "departure" as const,
              label: locale === "ko" ? "출국" : "Departure",
              airport: input.departure?.airport ?? "",
              time: input.departure?.time ?? "",
            },
          ]).map((row) => (
            <div key={row.kind} className="flex items-center gap-2">
              <span className="w-12 text-xs font-semibold text-gray-600 flex-shrink-0">
                {row.label}
              </span>
              <div className="relative flex-1 min-w-0">
                <select
                  value={row.airport}
                  onChange={(e) => {
                    const val = e.target.value || undefined;
                    setInput((p) =>
                      row.kind === "arrival"
                        ? { ...p, arrival: { ...p.arrival, airport: val } }
                        : { ...p, departure: { ...p.departure, airport: val } },
                    );
                  }}
                  disabled={relevantAirports.length === 0}
                  className="w-full appearance-none px-3 py-2 pr-8 rounded-lg border-2 border-gray-200 bg-white text-sm text-gray-900 focus:border-blue-500 focus:outline-none disabled:bg-gray-50 disabled:text-gray-400 transition-colors"
                >
                  <option value="">
                    {relevantAirports.length === 0
                      ? locale === "ko" ? "도시 먼저" : "Pick a city"
                      : locale === "ko" ? "공항" : "Airport"}
                  </option>
                  {relevantAirports.map((a) => (
                    <option key={a.code} value={a.code}>{a.label[locale]}</option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
              </div>
              {(() => {
                const { h, m } = parseHHMM(row.time || undefined);
                const updateTime = (nextH: string, nextM: string) => {
                  const val = joinHHMM(nextH, nextM);
                  setInput((p) =>
                    row.kind === "arrival"
                      ? { ...p, arrival: { ...p.arrival, time: val } }
                      : { ...p, departure: { ...p.departure, time: val } },
                  );
                };
                return (
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <div className="relative w-[72px]">
                      <select
                        value={h}
                        onChange={(e) => updateTime(e.target.value, m)}
                        className="w-full appearance-none px-2.5 py-2 pr-6 rounded-lg border-2 border-gray-200 bg-white text-sm text-gray-900 focus:border-blue-500 focus:outline-none transition-colors"
                      >
                        <option value="">{locale === "ko" ? "시" : "HH"}</option>
                        {flightHourOptions.map((v) => (
                          <option key={v} value={v}>{v}</option>
                        ))}
                      </select>
                      <ChevronDown className="pointer-events-none absolute right-1.5 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-400" />
                    </div>
                    <span className="text-gray-400 text-sm">:</span>
                    <div className="relative w-[72px]">
                      <select
                        value={m}
                        onChange={(e) => updateTime(h, e.target.value)}
                        className="w-full appearance-none px-2.5 py-2 pr-6 rounded-lg border-2 border-gray-200 bg-white text-sm text-gray-900 focus:border-blue-500 focus:outline-none transition-colors"
                      >
                        <option value="">{locale === "ko" ? "분" : "MM"}</option>
                        {flightMinuteOptions.map((v) => (
                          <option key={v} value={v}>{v}</option>
                        ))}
                      </select>
                      <ChevronDown className="pointer-events-none absolute right-1.5 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-400" />
                    </div>
                  </div>
                );
              })()}
            </div>
          ))}
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

        {/* Pace — how packed the day is */}
        <div className="flex flex-col gap-3">
          <label className="flex items-center gap-2 text-sm font-semibold text-gray-900">
            <Gauge className="w-4 h-4 text-blue-600" />
            {locale === "ko" ? "하루 페이스" : "Daily pace"}
          </label>
          <div className="grid grid-cols-3 gap-2">
            {paceOptions.map((p) => {
              const selected = (input.pace ?? "balanced") === p.value;
              return (
                <button key={p.value} type="button"
                  onClick={() => setInput((prev) => ({ ...prev, pace: p.value }))}
                  className={`flex flex-col items-center gap-1 p-3 rounded-xl border-2 cursor-pointer transition-all ${selected ? optionSelected : optionDefault}`}>
                  <span className="text-lg">{p.emoji}</span>
                  <span className="text-sm font-semibold text-gray-900">{p.label[locale]}</span>
                  <span className="text-xs text-gray-400">{p.sub[locale]}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Accommodation per city */}
        {input.destinations.length > 0 && (
          <AccommodationPicker
            destinations={input.destinations}
            accommodations={input.accommodations}
            onChange={(acc) => setInput((p) => ({ ...p, accommodations: acc }))}
            locale={locale}
          />
        )}

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
                    selected ? "border-blue-600 bg-blue-50 text-blue-700 ring-4 ring-blue-500/10" : disabled ? "border-gray-100 bg-gray-50 text-gray-300 cursor-not-allowed" : "border-gray-200 bg-white text-gray-700 hover:border-gray-300"
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
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-600 via-blue-700 to-violet-800 text-white px-6 py-8 sm:px-10 sm:py-12 shadow-hero">
              {/* Hero city image (primary city). Silently falls back to the
                  gradient-only design when the image file is missing.
                  Uses a plain <img> instead of next/image so that onError
                  fires cleanly for 404s without engaging the optimizer. */}
              {showHeroImage && heroImageUrl && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={heroImageUrl}
                  alt=""
                  className="absolute inset-0 w-full h-full object-cover"
                  onError={() => setHeroImageFailed(true)}
                  aria-hidden="true"
                />
              )}
              {/* Left-weighted dark gradient — strong behind the text area,
                  fading out toward the right so the city photo stays visible.
                  Only applied when a hero image is actually showing; without
                  the image we fall back to the outer div's full gradient. */}
              {showHeroImage && (
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(to right, rgba(15, 23, 42, 0.9) 0%, rgba(15, 23, 42, 0.7) 30%, rgba(15, 23, 42, 0.25) 65%, rgba(15, 23, 42, 0) 100%)",
                  }}
                />
              )}
              {/* Bottom-left violet accent — enhances the text zone without
                  bleeding into the photo on the right. The old top-right
                  blob was removed because it covered the image. */}
              {!showHeroImage && (
                <div aria-hidden="true" className="pointer-events-none absolute -top-16 -right-12 w-48 h-48 bg-blue-400/20 rounded-full blur-3xl" />
              )}
              <div aria-hidden="true" className="pointer-events-none absolute -bottom-16 -left-10 w-40 h-40 bg-violet-500/25 rounded-full blur-3xl" />
              {/* Subtle dot pattern overlay */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 opacity-[0.07]"
                style={{
                  backgroundImage: "radial-gradient(rgba(255,255,255,0.9) 1px, transparent 1px)",
                  backgroundSize: "16px 16px",
                }}
              />

              <div className="relative z-10 max-w-2xl">
                {/* Small top label */}
                <div className="inline-flex items-center gap-1.5 bg-white/15 backdrop-blur-sm text-[11px] font-semibold uppercase tracking-[0.12em] px-3 py-1 rounded-full border border-white/15 mb-4">
                  <Zap className="w-3 h-3" />
                  {locale === "ko" ? "나만의 여행 일정" : "Your Itinerary"}
                </div>

                {/* Title — cities prominent */}
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-[1.1] tracking-tight mb-2">
                  {itinerary.cities.map((c) => allCities.find((ci) => ci.id === c)?.label[locale] ?? c).join(" + ")}
                </h2>

                {/* Duration subtitle */}
                <p className="text-lg sm:text-xl font-semibold text-blue-100 mb-5">
                  {locale === "ko"
                    ? `${committedInput.duration}박 ${Number(committedInput.duration) + 1}일 여행`
                    : `${itinerary.duration}-Day Trip`}
                </p>

                {/* Metadata icon row */}
                <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-blue-100/90 mb-4">
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
                      <span key={s} className="bg-white/15 backdrop-blur-sm border border-white/20 text-white text-xs font-medium px-3 py-1 rounded-full">
                        {styleLabel(s, locale)}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Overview map — day zones */}
            <OverviewMap days={displayDays} locale={locale} />

            {/* Recommended day templates for the current cities */}
            <TemplateRecommendations
              input={committedInput}
              days={displayDays}
              locale={locale}
              onApply={applyTemplate}
            />

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

              {/* Refresh unlocked — shown from the start so users can
                  reshuffle without needing to lock a day first. Hidden only
                  when every day is already locked. */}
              {lockedDays.size < displayDays.length && (
                <div className="px-5 py-3 border-t border-gray-100">
                  <button
                    onClick={() => { setForcedSpots(null); setRefreshKey((k) => k + 1); }}
                    className="w-full flex items-center justify-center gap-2 bg-blue-50 hover:bg-blue-100 text-blue-700 text-sm font-medium py-2.5 px-4 rounded-xl transition-colors"
                  >
                    <RefreshCw className="w-4 h-4" />
                    {lockedDays.size === 0
                      ? locale === "ko"
                        ? "전체 일정 다시 추천받기"
                        : "Reshuffle all days"
                      : locale === "ko"
                        ? `마음에 안 드는 ${displayDays.length - lockedDays.size}개 일정만 다시 추천받기`
                        : `Reshuffle ${displayDays.length - lockedDays.size} unlocked days`}
                  </button>
                </div>
              )}

              {/* Save itinerary */}
              <SaveItineraryDropdown locale={locale} days={displayDays} duration={committedInput.duration} itinerary={itinerary} input={committedInput} />
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
                      {/* Per-day map:
                          1) static mapImage (legacy hand-curated DayCourse)
                          2) interactive DayRouteMap (spots with GPS coordinates)
                          3) placeholder (neither) */}
                      {(() => {
                        if (day.course.mapImage?.[locale]) {
                          return (
                            <div className="relative w-full rounded-xl overflow-hidden border border-gray-100" style={{ aspectRatio: "800 / 280" }}>
                              <Image
                                src={day.course.mapImage[locale]}
                                alt={locale === "ko" ? `Day ${day.dayNumber} ${day.course.title.ko} 지도` : `Day ${day.dayNumber} ${day.course.title.en} map`}
                                fill
                                sizes="(max-width: 768px) 100vw, 800px"
                                className="object-cover"
                              />
                            </div>
                          );
                        }
                        const hasCoords = day.course.activities.some((a) => a.location);
                        if (hasCoords) {
                          const accCoord = committedInput.accommodations?.[day.city]?.location
                            ?? allCities.find((c) => c.id === day.city)?.defaultAccommodation?.location;
                          return (
                            <DayRouteMap
                              activities={day.course.activities}
                              accommodation={accCoord}
                              locale={locale}
                              dayIndex={day.dayNumber - 1}
                            />
                          );
                        }
                        return (
                          <div className="h-[200px] rounded-xl bg-gray-50 border border-dashed border-gray-200 flex items-center justify-center">
                            <div className="text-center px-4">
                              <MapIcon className="w-7 h-7 text-gray-300 mx-auto mb-1.5" />
                              <p className="text-sm text-gray-400">
                                {locale === "ko" ? "일자별 지도 준비 중" : "Day map coming soon"}
                              </p>
                            </div>
                          </div>
                        );
                      })()}
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
