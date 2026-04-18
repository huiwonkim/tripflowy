"use client";

import { Hotel } from "lucide-react";
import { countries } from "@/data/destinations";
import type { AccommodationInput, Locale } from "@/types";

interface Props {
  /** Selected city ids — the component renders one row per city. */
  destinations: string[];
  /** Current per-city accommodation map. `undefined` means the user hasn't touched the row. */
  accommodations: Record<string, AccommodationInput> | undefined;
  onChange: (next: Record<string, AccommodationInput>) => void;
  locale: Locale;
}

/**
 * Free-text accommodation input per selected destination.
 *
 * MVP behavior (see /Users/macbook/.claude/plans/fancy-petting-lamport.md section 3):
 *  - User types a hotel name or address as a label.
 *  - Location always falls back to the city's `defaultAccommodation.location`.
 *  - Places Autocomplete / geocoding is deferred to V2.
 */
export function AccommodationPicker({ destinations, accommodations, onChange, locale }: Props) {
  if (destinations.length === 0) return null;

  const allCities = countries.flatMap((c) => c.cities);

  function updateLabel(cityId: string, label: string) {
    const city = allCities.find((c) => c.id === cityId);
    if (!city?.defaultAccommodation) return;
    const trimmed = label.trim();
    const next = { ...(accommodations ?? {}) };
    next[cityId] = {
      label: trimmed || city.defaultAccommodation.label[locale],
      location: city.defaultAccommodation.location,
      source: trimmed ? "manual" : "default",
    };
    onChange(next);
  }

  return (
    <div className="flex flex-col gap-3">
      <label className="flex items-center gap-2 text-sm font-semibold text-gray-900">
        <Hotel className="w-4 h-4 text-blue-600" />
        {locale === "ko" ? "숙소 (선택 사항)" : "Accommodation (optional)"}
        <span className="text-xs font-normal text-gray-400 ml-2">
          {locale === "ko" ? "비워두면 도시 메인역 기준" : "Defaults to city main station"}
        </span>
      </label>
      <div className="flex flex-col gap-2">
        {destinations.map((cityId) => {
          const city = allCities.find((c) => c.id === cityId);
          if (!city) return null;
          const placeholder = city.defaultAccommodation?.label[locale] ?? city.label[locale];
          const current = accommodations?.[cityId];
          const displayValue = current && current.source !== "default" ? current.label : "";
          return (
            <div key={cityId} className="flex items-center gap-2">
              <span className="text-xs font-medium text-gray-500 w-16 shrink-0">
                {city.label[locale]}
              </span>
              <input
                type="text"
                value={displayValue}
                onChange={(e) => updateLabel(cityId, e.target.value)}
                placeholder={placeholder}
                className="flex-1 px-3 py-2 rounded-xl border-2 border-gray-200 bg-white text-sm text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none transition-colors"
              />
            </div>
          );
        })}
      </div>
      <p className="text-xs text-gray-400">
        {locale === "ko"
          ? "MVP 단계: 입력한 호텔명은 표시용입니다. 좌표는 V2에서 자동 검색 예정 (현재는 도시 기본값 사용)."
          : "MVP: Hotel name is for display only. Coordinates use the city default for now — Places search arrives in V2."}
      </p>
    </div>
  );
}
