"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { Search, X } from "lucide-react";
import type { PlannerInput, Locale, TravelStyle, TravelerType } from "@/types";
import { countries, durationOptions, travelerTypeOptions, styleOptions } from "@/data/destinations";

const emptyInput: PlannerInput = { destinations: [], duration: "", travelerType: "", styles: [] };

export function QuickPlanner() {
  const router = useRouter();
  const locale = useLocale() as Locale;
  const t = useTranslations("planner");
  const [input, setInput] = useState<PlannerInput>(emptyInput);

  const allCities = countries.flatMap((c) => c.cities);

  function toggleCity(cityId: string) {
    setInput((p) => ({
      ...p,
      destinations: p.destinations.includes(cityId)
        ? p.destinations.filter((d) => d !== cityId)
        : [...p.destinations, cityId],
    }));
  }

  function toggleStyle(style: TravelStyle) {
    setInput((p) => ({
      ...p,
      styles: p.styles.includes(style)
        ? p.styles.filter((s) => s !== style)
        : p.styles.length < 4 ? [...p.styles, style] : p.styles,
    }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (input.destinations.length) params.set("destinations", input.destinations.join(","));
    if (input.duration) params.set("duration", input.duration);
    if (input.travelerType) params.set("travelerType", input.travelerType);
    if (input.styles.length) params.set("styles", input.styles.join(","));
    router.push(`/planner?${params.toString()}` as never);
  }

  const selectedDuration = durationOptions.find((d) => d.value === input.duration);
  const minCities = selectedDuration?.minCities ?? 1;
  const needMoreCities = input.duration && input.destinations.length > 0 && input.destinations.length < minCities;

  const chipBase = "px-3 py-1.5 rounded-lg text-sm font-medium border transition-all cursor-pointer";
  const chipSelected = "border-blue-500 bg-blue-50 text-blue-700";
  const chipDefault = "border-gray-200 bg-white/10 text-gray-300 hover:border-gray-300 hover:text-white";

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Destination — inline country + city chips */}
      <div>
        <p className="text-xs text-gray-400 mb-2.5">{t("destination")}</p>
        <div className="space-y-2">
          {countries.map((c) => (
            <div key={c.id} className="flex items-center gap-2 flex-wrap">
              <span className="text-sm flex-shrink-0 w-16">{c.emoji} {c.label[locale]}</span>
              {c.cities.map((city) => {
                const selected = input.destinations.includes(city.id);
                return (
                  <button key={city.id} type="button" onClick={() => toggleCity(city.id)}
                    className={`${chipBase} ${selected ? chipSelected : chipDefault}`}>
                    {city.label[locale]}
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Duration */}
      <div>
        <p className="text-xs text-gray-400 mb-2">{t("duration")}</p>
        <div className="flex flex-wrap gap-1.5">
          {durationOptions.map((d) => (
            <button key={d.value} type="button" onClick={() => setInput((p) => ({ ...p, duration: d.value }))}
              className={`${chipBase} ${input.duration === d.value ? chipSelected : chipDefault}`}>
              {locale === "ko" ? `${d.value}박${Number(d.value)+1}일` : `${Number(d.value)+1} days`}
            </button>
          ))}
        </div>
      </div>

      {/* Traveler + Style in one row on desktop */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Traveler type */}
        <div>
          <p className="text-xs text-gray-400 mb-2">{t("whosTraveling")}</p>
          <div className="flex flex-wrap gap-1.5">
            {travelerTypeOptions.map((tt) => (
              <button key={tt.value} type="button"
                onClick={() => setInput((p) => ({ ...p, travelerType: tt.value as TravelerType }))}
                className={`${chipBase} ${input.travelerType === tt.value ? chipSelected : chipDefault}`}>
                {tt.emoji} {tt.label[locale]}
              </button>
            ))}
          </div>
        </div>

        {/* Style */}
        <div>
          <p className="text-xs text-gray-400 mb-2">
            {locale === "ko" ? "스타일" : "Style"}
            {input.styles.length > 0 && <span className="ml-1 text-blue-400">({input.styles.length}/4)</span>}
          </p>
          <div className="flex flex-wrap gap-1.5">
            {styleOptions.slice(0, 6).map((s) => {
              const selected = input.styles.includes(s.value as TravelStyle);
              const disabled = !selected && input.styles.length >= 4;
              return (
                <button key={s.value} type="button" disabled={disabled}
                  onClick={() => toggleStyle(s.value as TravelStyle)}
                  className={`${chipBase} ${selected ? chipSelected : disabled ? "border-gray-700 text-gray-600 cursor-not-allowed" : chipDefault}`}>
                  {s.label[locale]}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {needMoreCities && (
        <p className="text-xs text-red-400 text-center">
          {locale === "ko"
            ? `${input.duration}박 이상은 2개 도시 이상 선택이 필요합니다`
            : `${input.duration}+ nights requires at least 2 cities`}
        </p>
      )}

      <button type="submit" disabled={!!needMoreCities}
        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-semibold py-3.5 px-6 rounded-xl transition-colors flex items-center justify-center gap-2 text-sm">
        <Search className="w-4 h-4" />{t("findMyItinerary")}
      </button>
    </form>
  );
}
