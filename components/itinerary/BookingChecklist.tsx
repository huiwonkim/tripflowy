"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { ExternalLink, Check, Plane, Building2, Compass, ShoppingBag, AlertTriangle } from "lucide-react";
import type { Locale, GeneratedItinerary } from "@/types";
import { countries } from "@/data/destinations";
import { fetchLivePrices, type LivePriceData } from "@/lib/price-api";

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
  const [blockedItems, setBlockedItems] = useState<BookingItem[]>([]);
  // Korean-locale MyRealTrip mylinks, fetched per unique city in the itinerary.
  const [mrtPrices, setMrtPrices] = useState<Record<string, LivePriceData | null>>({});

  const allCities = countries.flatMap((c) => c.cities);

  // Primary city = city that appears on the most days (matches BudgetSection).
  const primaryCity = (() => {
    if (!itinerary.days || itinerary.days.length === 0) return itinerary.cities[0];
    const counts: Record<string, number> = {};
    for (const d of itinerary.days) counts[d.city] = (counts[d.city] ?? 0) + 1;
    const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
    return sorted[0]?.[0] ?? itinerary.cities[0];
  })();

  // For ko locale, fetch MyRealTrip mylinks for each unique city so the
  // flight / hotel items below can deep-link into MRT's own booking flow
  // (preserves affiliate tracking). en locale keeps the existing
  // Skyscanner / Agoda / Klook providers.
  useEffect(() => {
    if (locale !== "ko") return;
    const uniqueCities = Array.from(new Set(itinerary.cities));
    let cancelled = false;
    Promise.all(
      uniqueCities.map((c) => fetchLivePrices(c, "ko", itinerary.duration)),
    ).then((results) => {
      if (cancelled) return;
      const map: Record<string, LivePriceData | null> = {};
      uniqueCities.forEach((c, i) => {
        map[c] = results[i];
      });
      setMrtPrices(map);
    });
    return () => {
      cancelled = true;
    };
  }, [itinerary.cities, itinerary.duration, locale]);

  // Generate booking items from itinerary
  const items: BookingItem[] = [];

  // Flight — for ko locale, use the primary city's MRT flight mylink;
  // otherwise fall back to Skyscanner.
  const cityLabel = allCities.find((c) => c.id === primaryCity)?.label[locale] ?? primaryCity;
  const flightMylink = locale === "ko" ? mrtPrices[primaryCity]?.mylinks?.flight : undefined;
  items.push({
    id: "flight",
    category: "flight",
    label: locale === "ko" ? `✈️ ${cityLabel} 항공권` : `✈️ Flights to ${cityLabel}`,
    url: flightMylink ?? `https://www.skyscanner.co.kr/transport/flights/ICN/${primaryCity.toUpperCase()}/`,
    provider: flightMylink ? "MyRealTrip" : "Skyscanner",
  });

  // Hotels per city — for ko locale, use each city's MRT hotel mylink.
  for (const city of itinerary.cities) {
    const label = allCities.find((c) => c.id === city)?.label[locale] ?? city;
    const hotelMylink = locale === "ko" ? mrtPrices[city]?.mylinks?.hotel : undefined;
    items.push({
      id: `hotel-${city}`,
      category: "hotel",
      label: locale === "ko" ? `🏨 ${label} 숙소` : `🏨 ${label} Hotels`,
      url: hotelMylink ?? `https://www.agoda.com/search?city=${city}`,
      provider: hotelMylink ? "MyRealTrip" : "Agoda",
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
    // Clear any blocked-items fallback panel when the user changes selection.
    setBlockedItems([]);
  }

  function openAll() {
    const selected = items.filter((item) => checked.has(item.id));
    if (selected.length === 0) return;

    const blocked: BookingItem[] = [];
    // Open each item sequentially within the user gesture. window.open
    // returns null (or a window with closed=true) when the popup is blocked.
    for (const item of selected) {
      const w = window.open(item.url, "_blank", "noopener,noreferrer");
      if (!w || w.closed || typeof w.closed === "undefined") {
        blocked.push(item);
      }
    }

    // Any items the browser refused to open are surfaced as a fallback list
    // the user can click individually — each click is its own user gesture.
    setBlockedItems(blocked);
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
              <div key={item.id} className="flex items-center gap-3 px-5 py-3.5 hover:bg-gray-50 transition-colors">
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
                {/* Make the row itself a direct-open link so users can always
                    click a single row without relying on the bulk open flow. */}
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer sponsored"
                  className={`text-sm flex-1 ${isChecked ? "text-gray-400 line-through" : "text-gray-900 hover:text-blue-600"} cursor-pointer`}
                >
                  {item.label}
                </a>
              </div>
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

        {/* Popup-blocker fallback: show items the browser refused to open */}
        {blockedItems.length > 0 && (
          <div className="px-5 py-4 border-t border-amber-100 bg-amber-50">
            <div className="flex items-start gap-2 mb-3">
              <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-amber-800 leading-relaxed">
                {locale === "ko"
                  ? "브라우저가 일부 탭 열기를 차단했습니다. 아래 링크를 각각 클릭해 주세요."
                  : "Your browser blocked some tabs from opening. Please click each link below."}
              </p>
            </div>
            <div className="space-y-1.5">
              {blockedItems.map((item) => (
                <a
                  key={item.id}
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer sponsored"
                  className="flex items-center gap-2 text-sm text-amber-900 hover:text-amber-700 hover:underline"
                >
                  <ExternalLink className="w-3.5 h-3.5 flex-shrink-0" />
                  {item.label}
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
