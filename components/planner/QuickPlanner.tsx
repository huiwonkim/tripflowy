"use client";

import { useState, useRef, useEffect } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { Search, MapPin, Clock, Users, Zap, X, ChevronDown } from "lucide-react";
import type { PlannerInput, Locale } from "@/types";
import { countries, durationOptions, travelerTypeOptions, styleOptions } from "@/data/destinations";

const emptyInput: PlannerInput = { destinations: [], duration: "", travelerType: "", style: "" };

interface QuickPlannerProps {
  compact?: boolean;
}

export function QuickPlanner({ compact = false }: QuickPlannerProps) {
  const router = useRouter();
  const locale = useLocale() as Locale;
  const t = useTranslations("planner");
  const [input, setInput] = useState<PlannerInput>(emptyInput);
  const [destOpen, setDestOpen] = useState(false);
  const destRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (destRef.current && !destRef.current.contains(e.target as Node)) setDestOpen(false);
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

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (input.destinations.length) params.set("destinations", input.destinations.join(","));
    if (input.duration) params.set("duration", input.duration);
    if (input.travelerType) params.set("travelerType", input.travelerType);
    if (input.style) params.set("style", input.style);
    router.push(`/itineraries?${params.toString()}` as never);
  }

  const selectBase =
    "w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition cursor-pointer";

  // Get label for selected destinations
  const allCities = countries.flatMap((c) => c.cities);
  const selectedLabels = input.destinations.map((id) => allCities.find((c) => c.id === id)?.label[locale] ?? id);

  return (
    <form onSubmit={handleSubmit}>
      <div className={`grid gap-3 ${compact ? "grid-cols-2 md:grid-cols-4" : "grid-cols-1 sm:grid-cols-2"}`}>
        {/* Destination — multi-select dropdown */}
        <div className="relative" ref={destRef}>
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none z-10"><MapPin className="w-4 h-4" /></div>
          <button
            type="button"
            onClick={() => setDestOpen((o) => !o)}
            className={`${selectBase} pl-10 pr-8 text-left flex items-center gap-1 min-h-[44px]`}
          >
            {input.destinations.length === 0 ? (
              <span className="text-gray-400">{t("destination")}</span>
            ) : (
              <span className="truncate">{selectedLabels.join(", ")}</span>
            )}
          </button>
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
            <ChevronDown className={`w-4 h-4 transition-transform ${destOpen ? "rotate-180" : ""}`} />
          </div>

          {destOpen && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg z-50 max-h-64 overflow-y-auto">
              {countries.map((c) => (
                <div key={c.id}>
                  <p className="px-3 py-1.5 text-xs font-medium text-gray-400 bg-gray-50 sticky top-0">
                    {c.emoji} {c.label[locale]}
                  </p>
                  {c.cities.map((city) => {
                    const checked = input.destinations.includes(city.id);
                    return (
                      <label key={city.id} className="flex items-center gap-2.5 px-3 py-2 hover:bg-blue-50 cursor-pointer text-sm">
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => toggleCity(city.id)}
                          className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className={checked ? "font-medium text-gray-900" : "text-gray-700"}>{city.label[locale]}</span>
                      </label>
                    );
                  })}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Duration */}
        <div className="relative">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"><Clock className="w-4 h-4" /></div>
          <select className={`${selectBase} pl-10`} value={input.duration} onChange={(e) => setInput((p) => ({ ...p, duration: e.target.value }))}>
            <option value="">{t("duration")}</option>
            {durationOptions.map((d) => (<option key={d.value} value={d.value}>{d.label[locale]}</option>))}
          </select>
        </div>

        {/* Traveler type */}
        <div className="relative">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"><Users className="w-4 h-4" /></div>
          <select className={`${selectBase} pl-10`} value={input.travelerType} onChange={(e) => setInput((p) => ({ ...p, travelerType: e.target.value as PlannerInput["travelerType"] }))}>
            <option value="">{t("whosTraveling")}</option>
            {travelerTypeOptions.map((tt) => (<option key={tt.value} value={tt.value}>{tt.emoji} {tt.label[locale]}</option>))}
          </select>
        </div>

        {/* Style */}
        <div className="relative">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"><Zap className="w-4 h-4" /></div>
          <select className={`${selectBase} pl-10`} value={input.style} onChange={(e) => setInput((p) => ({ ...p, style: e.target.value as PlannerInput["style"] }))}>
            <option value="">{t("travelStyle")}</option>
            {styleOptions.map((s) => (<option key={s.value} value={s.value}>{s.label[locale]}</option>))}
          </select>
        </div>
      </div>

      {/* Selected cities chips */}
      {input.destinations.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-2">
          {input.destinations.map((id) => {
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

      <button type="submit" className="mt-3 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3.5 px-6 rounded-xl transition-colors flex items-center justify-center gap-2 text-sm">
        <Search className="w-4 h-4" />{t("findMyItinerary")}
      </button>
    </form>
  );
}
