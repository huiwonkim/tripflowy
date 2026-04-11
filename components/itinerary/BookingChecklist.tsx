"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { ExternalLink, Check, Plane, Building2, Compass, ShoppingBag } from "lucide-react";
import type { Locale, GeneratedItinerary } from "@/types";
import { countries } from "@/data/destinations";

interface BookingItem {
  id: string;
  category: "flight" | "hotel" | "tour" | "activity";
  label: string;
  url: string;
  provider: string;
}

interface BookingChecklistProps {
  itinerary: GeneratedItinerary;
  locale: Locale;
}

const categoryIcons = {
  flight: Plane,
  hotel: Building2,
  tour: Compass,
  activity: ShoppingBag,
};

const categoryColors = {
  flight: "text-blue-500",
  hotel: "text-purple-500",
  tour: "text-emerald-500",
  activity: "text-amber-500",
};

export function BookingChecklist({ itinerary, locale }: BookingChecklistProps) {
  const t = useTranslations("booking");
  const [checked, setChecked] = useState<Set<string>>(new Set());

  const allCities = countries.flatMap((c) => c.cities);

  // Generate booking items from itinerary
  const items: BookingItem[] = [];

  // Flight
  const primaryCity = itinerary.cities[0];
  const cityLabel = allCities.find((c) => c.id === primaryCity)?.label[locale] ?? primaryCity;
  items.push({
    id: "flight",
    category: "flight",
    label: locale === "ko" ? `✈️ ${cityLabel} 항공권` : `✈️ Flights to ${cityLabel}`,
    url: `https://www.skyscanner.co.kr/transport/flights/ICN/${primaryCity.toUpperCase()}/`,
    provider: "Skyscanner",
  });

  // Hotels per city
  for (const city of itinerary.cities) {
    const label = allCities.find((c) => c.id === city)?.label[locale] ?? city;
    items.push({
      id: `hotel-${city}`,
      category: "hotel",
      label: locale === "ko" ? `🏨 ${label} 숙소` : `🏨 ${label} Hotels`,
      url: `https://www.agoda.com/search?city=${city}`,
      provider: "Agoda",
    });
  }

  // Tours — unique activities from courses
  const seenTours = new Set<string>();
  for (const day of itinerary.days) {
    for (const act of day.course.activities) {
      if ((act.type === "tour" || act.type === "sightseeing") && !seenTours.has(act.title[locale])) {
        seenTours.add(act.title[locale]);
        if (seenTours.size <= 5) {
          items.push({
            id: `tour-${seenTours.size}`,
            category: "tour",
            label: `🎟️ ${act.title[locale]}`,
            url: `https://www.klook.com/search?query=${encodeURIComponent(act.title.en)}`,
            provider: "Klook",
          });
        }
      }
    }
  }

  function toggle(id: string) {
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function openAll() {
    const selected = items.filter((item) => checked.has(item.id));
    if (selected.length === 0) return;
    // Browsers block multiple sequential window.open() calls as popups.
    // Create temporary anchor elements and synchronously click them while
    // still inside the user-gesture event handler — most browsers treat
    // each anchor click as a valid user navigation and allow all tabs to open.
    for (const item of selected) {
      const a = document.createElement("a");
      a.href = item.url;
      a.target = "_blank";
      a.rel = "noopener noreferrer sponsored";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  }

  const selectedCount = checked.size;

  return (
    <section className="mt-10">
      <div className="mb-4">
        <p className="text-sm font-medium text-orange-600 mb-1">{t("label")}</p>
        <h2 className="text-xl font-bold text-gray-900">{t("heading")}</h2>
        <p className="text-sm text-gray-500 mt-1">{t("subheading")}</p>
      </div>

      <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
        <div className="divide-y divide-gray-100">
          {items.map((item) => {
            const Icon = categoryIcons[item.category];
            const color = categoryColors[item.category];
            const isChecked = checked.has(item.id);

            return (
              <label key={item.id} className="flex items-center gap-3 px-5 py-3.5 hover:bg-gray-50 cursor-pointer transition-colors">
                <button
                  type="button"
                  onClick={() => toggle(item.id)}
                  className={`w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                    isChecked ? "bg-blue-600 border-blue-600" : "border-gray-300"
                  }`}
                >
                  {isChecked && <Check className="w-3 h-3 text-white" strokeWidth={3} />}
                </button>
                <Icon className={`w-4 h-4 ${color} flex-shrink-0`} />
                <span className={`text-sm flex-1 ${isChecked ? "text-gray-400 line-through" : "text-gray-900"}`}>
                  {item.label}
                </span>
                <span className="text-xs text-gray-400">{item.provider}</span>
              </label>
            );
          })}
        </div>

        {/* Open all selected */}
        <div className="px-5 py-4 bg-gray-50 border-t border-gray-100">
          <button
            onClick={openAll}
            disabled={selectedCount === 0}
            className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-gray-200 disabled:text-gray-400 text-white font-semibold py-3 px-4 rounded-xl transition-colors flex items-center justify-center gap-2 text-sm"
          >
            <ExternalLink className="w-4 h-4" />
            {selectedCount > 0
              ? (locale === "ko" ? `${selectedCount}개 선택 항목 예약하기` : `Book ${selectedCount} selected items`)
              : (locale === "ko" ? "예약할 항목을 선택하세요" : "Select items to book")}
          </button>
        </div>
      </div>
    </section>
  );
}
