"use client";

import { Suspense, useMemo, useEffect, useState, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { SlidersHorizontal, X, ChevronDown } from "lucide-react";
import { ItineraryCard } from "@/components/itinerary/ItineraryCard";
import { itineraries } from "@/data/itineraries";
import { countries, durationOptions, travelerTypeOptions, styleOptions } from "@/data/destinations";
import type { TravelerType, TravelStyle, Locale } from "@/types";

interface Filters {
  destinations: string[];
  country: string;
  duration: string;
  travelerType: string;
  style: string;
}

const emptyFilters: Filters = { destinations: [], country: "", duration: "", travelerType: "", style: "" };

function ItinerariesContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const locale = useLocale() as Locale;
  const t = useTranslations("itineraries");
  const [filters, setFilters] = useState<Filters>(emptyFilters);
  const [destOpen, setDestOpen] = useState(false);
  const destRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (destRef.current && !destRef.current.contains(e.target as Node)) setDestOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  useEffect(() => {
    const destinations = searchParams.get("destinations")?.split(",").filter(Boolean) ?? [];
    setFilters({
      destinations,
      country: searchParams.get("country") ?? "",
      duration: searchParams.get("duration") ?? "",
      travelerType: searchParams.get("travelerType") ?? "",
      style: searchParams.get("style") ?? "",
    });
  }, [searchParams]);

  const filtered = useMemo(() => {
    return itineraries.filter((itin) => {
      if (filters.destinations.length > 0 && !filters.destinations.includes(itin.destination)) return false;
      if (filters.country) {
        const countryObj = countries.find((c) => c.id === filters.country);
        if (countryObj && !countryObj.cities.some((city) => city.id === itin.destination)) return false;
      }
      if (filters.duration && itin.duration !== Number(filters.duration)) return false;
      if (filters.travelerType && !itin.travelerType.includes(filters.travelerType as TravelerType)) return false;
      if (filters.style && itin.style !== (filters.style as TravelStyle)) return false;
      return true;
    });
  }, [filters]);

  function toggleCity(cityId: string) {
    const next = {
      ...filters,
      country: "",
      destinations: filters.destinations.includes(cityId)
        ? filters.destinations.filter((d) => d !== cityId)
        : [...filters.destinations, cityId],
    };
    setFilters(next);
    pushFilters(next);
  }

  function updateFilter(key: string, value: string) {
    const next = { ...filters, [key]: value };
    setFilters(next);
    pushFilters(next);
  }

  function pushFilters(f: Filters) {
    const params = new URLSearchParams();
    if (f.destinations.length) params.set("destinations", f.destinations.join(","));
    if (f.country) params.set("country", f.country);
    if (f.duration) params.set("duration", f.duration);
    if (f.travelerType) params.set("travelerType", f.travelerType);
    if (f.style) params.set("style", f.style);
    router.push(`/itineraries?${params.toString()}` as never, { scroll: false });
  }

  function clearFilters() {
    setFilters(emptyFilters);
    router.push("/itineraries" as never, { scroll: false });
  }

  const hasFilters = filters.destinations.length > 0 || filters.country || filters.duration || filters.travelerType || filters.style;
  const allCities = countries.flatMap((c) => c.cities);
  const selectedLabels = filters.destinations.map((id) => allCities.find((c) => c.id === id)?.label[locale] ?? id);

  const selectBase =
    "bg-white border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-800 appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition cursor-pointer pr-8";

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      <div className="mb-8">
        <p className="text-sm font-medium text-blue-600 mb-1">{t("browseAll")}</p>
        <h1 className="text-3xl font-bold text-gray-900">{t("heading")}</h1>
        <p className="text-gray-500 mt-2">{t("subheading")}</p>
      </div>

      <div className="bg-white border border-gray-100 rounded-2xl p-4 mb-8 shadow-sm">
        <div className="flex items-center gap-2 mb-3">
          <SlidersHorizontal className="w-4 h-4 text-gray-400" />
          <span className="text-sm font-medium text-gray-700">{t("filterLabel")}</span>
          {hasFilters && (
            <button onClick={clearFilters} className="ml-auto flex items-center gap-1 text-xs text-gray-400 hover:text-gray-600 transition-colors">
              <X className="w-3.5 h-3.5" /> {t("clearFilters")}
            </button>
          )}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {/* Destination multi-select dropdown */}
          <div className="relative" ref={destRef}>
            <button type="button" onClick={() => setDestOpen((o) => !o)}
              className={`${selectBase} w-full text-left flex items-center min-h-[40px]`}>
              {filters.destinations.length === 0 ? (
                <span className="text-gray-400">{t("allDestinations")}</span>
              ) : (
                <span className="truncate">{selectedLabels.join(", ")}</span>
              )}
            </button>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
              <ChevronDown className={`w-4 h-4 transition-transform ${destOpen ? "rotate-180" : ""}`} />
            </div>
            {destOpen && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg z-50 max-h-64 overflow-y-auto min-w-[220px]">
                {countries.map((c) => (
                  <div key={c.id}>
                    <p className="px-3 py-1.5 text-xs font-medium text-gray-400 bg-gray-50 sticky top-0">{c.emoji} {c.label[locale]}</p>
                    {c.cities.map((city) => {
                      const checked = filters.destinations.includes(city.id);
                      return (
                        <label key={city.id} className="flex items-center gap-2.5 px-3 py-2 hover:bg-blue-50 cursor-pointer text-sm">
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

          <select className={selectBase} value={filters.duration} onChange={(e) => updateFilter("duration", e.target.value)}>
            <option value="">{t("anyDuration")}</option>
            {durationOptions.map((d) => (<option key={d.value} value={d.value}>{d.label[locale]}</option>))}
          </select>

          <select className={selectBase} value={filters.travelerType} onChange={(e) => updateFilter("travelerType", e.target.value)}>
            <option value="">{t("anyTraveler")}</option>
            {travelerTypeOptions.map((tt) => (<option key={tt.value} value={tt.value}>{tt.emoji} {tt.label[locale]}</option>))}
          </select>

          <select className={selectBase} value={filters.style} onChange={(e) => updateFilter("style", e.target.value)}>
            <option value="">{t("anyStyle")}</option>
            {styleOptions.map((s) => (<option key={s.value} value={s.value}>{s.label[locale]}</option>))}
          </select>
        </div>

        {/* Selected city chips */}
        {filters.destinations.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-3">
            {filters.destinations.map((id) => {
              const city = allCities.find((c) => c.id === id);
              if (!city) return null;
              return (
                <span key={id} className="inline-flex items-center gap-1 bg-blue-100 text-blue-700 text-xs font-medium px-2.5 py-1 rounded-full">
                  {city.label[locale]}
                  <button type="button" onClick={() => toggleCity(id)} className="hover:text-blue-900"><X className="w-3 h-3" /></button>
                </span>
              );
            })}
          </div>
        )}
      </div>

      <p className="text-sm text-gray-500 mb-6">
        {filtered.length} {filtered.length === 1 ? t("itinerary") : t("itineraries2")} {t("found")}
        {hasFilters && ` ${t("forFilters")}`}
      </p>

      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((itin) => (<ItineraryCard key={itin.id} itinerary={itin} />))}
        </div>
      ) : (
        <div className="text-center py-20 text-gray-400">
          <p className="text-lg font-medium text-gray-600 mb-2">{t("noMatch")}</p>
          <p className="text-sm">{t("tryBroadening")}{" "}
            <button onClick={clearFilters} className="text-blue-600 underline">{t("clearAll")}</button>.
          </p>
        </div>
      )}
    </div>
  );
}

export default function ItinerariesPage() {
  return (
    <Suspense fallback={<div className="max-w-7xl mx-auto px-4 py-10 text-gray-400">Loading...</div>}>
      <ItinerariesContent />
    </Suspense>
  );
}
