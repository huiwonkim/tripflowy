"use client";

import { Hotel } from "lucide-react";
import { countries } from "@/data/destinations";
import { getAreasByCity } from "@/data/areas";
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
 * Per-city accommodation selector using area dropdowns.
 *
 * Each selected destination gets one row with an area dropdown (e.g. Shinjuku,
 * Shibuya, Ginza for Tokyo). The chosen area's representative coordinate
 * becomes the day start/end anchor for the spot engine's routing.
 *
 * "도시 기본 (main station)" is the default option. Custom hotel addresses
 * (Places Autocomplete) are deferred to V2.
 */
export function AccommodationPicker({ destinations, accommodations, onChange, locale }: Props) {
  if (destinations.length === 0) return null;

  const allCities = countries.flatMap((c) => c.cities);

  function handleAreaChange(cityId: string, areaId: string) {
    const city = allCities.find((c) => c.id === cityId);
    if (!city) return;
    const next = { ...(accommodations ?? {}) };

    if (areaId === "__default__") {
      // Fall back to the city's main-station default
      if (city.defaultAccommodation) {
        next[cityId] = {
          label: city.defaultAccommodation.label[locale],
          location: city.defaultAccommodation.location,
          source: "default",
        };
      } else {
        delete next[cityId];
      }
    } else {
      const area = getAreasByCity(cityId).find((a) => a.id === areaId);
      if (!area) return;
      next[cityId] = {
        label: area.label[locale],
        location: area.location,
        source: "manual",
      };
    }
    onChange(next);
  }

  return (
    <div className="flex flex-col gap-3">
      <label className="flex items-center gap-2 text-sm font-semibold text-gray-900">
        <Hotel className="w-4 h-4 text-blue-600" />
        {locale === "ko" ? "숙소 위치 (선택 사항)" : "Accommodation area (optional)"}
        <span className="text-xs font-normal text-gray-400 ml-2">
          {locale === "ko" ? "지역을 고르면 해당 동선 기준으로 일정 생성" : "Pick an area to anchor day routes"}
        </span>
      </label>
      <div className="flex flex-col gap-2">
        {destinations.map((cityId) => {
          const city = allCities.find((c) => c.id === cityId);
          if (!city) return null;
          const cityAreas = getAreasByCity(cityId);
          const current = accommodations?.[cityId];
          // Selected area id — match by label (since we stored label on accommodation)
          const selectedAreaId =
            current?.source === "manual"
              ? cityAreas.find((a) => a.label[locale] === current.label)?.id ?? ""
              : "__default__";

          return (
            <div key={cityId} className="flex items-center gap-2">
              <span className="text-xs font-medium text-gray-500 w-16 shrink-0">
                {city.label[locale]}
              </span>
              <select
                value={selectedAreaId}
                onChange={(e) => handleAreaChange(cityId, e.target.value)}
                className="flex-1 px-3 py-2 rounded-xl border-2 border-gray-200 bg-white text-sm text-gray-900 focus:border-blue-500 focus:outline-none transition-colors"
              >
                <option value="__default__">
                  {locale === "ko" ? "기본 (도시 메인역)" : "Default (city main station)"}
                </option>
                {cityAreas.map((area) => (
                  <option key={area.id} value={area.id}>
                    {area.label[locale]}
                    {area.notes ? ` — ${area.notes[locale]}` : ""}
                  </option>
                ))}
              </select>
            </div>
          );
        })}
      </div>
    </div>
  );
}
