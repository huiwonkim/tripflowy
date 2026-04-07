"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { MapPin, Clock, Users, Zap, Search, ArrowRight } from "lucide-react";
import { ItineraryCard } from "@/components/itinerary/ItineraryCard";
import { itineraries } from "@/data/itineraries";
import { countries, durationOptions, travelerTypeOptions, styleOptions } from "@/data/destinations";
import type { PlannerInput, TravelerType, TravelStyle, Locale } from "@/types";

const emptyInput: PlannerInput = { destination: "", duration: "", travelerType: "", style: "" };

export default function PlannerPage() {
  const router = useRouter();
  const locale = useLocale() as Locale;
  const t = useTranslations("planner");
  const [input, setInput] = useState<PlannerInput>(emptyInput);
  const [searched, setSearched] = useState(false);

  const results = searched
    ? itineraries.filter((itin) => {
        if (input.destination && itin.destination !== input.destination) return false;
        if (input.duration && itin.duration !== Number(input.duration)) return false;
        if (input.travelerType && !itin.travelerType.includes(input.travelerType as TravelerType)) return false;
        if (input.style && itin.style !== input.style) return false;
        return true;
      })
    : [];

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    setSearched(true);
  }

  const optionBase = "flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all text-left";
  const optionSelected = "border-blue-600 bg-blue-50";
  const optionDefault = "border-gray-200 bg-white hover:border-gray-300";
  const inputComplete = input.destination && input.duration && input.travelerType && input.style;

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12">
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 text-xs font-medium px-3 py-1.5 rounded-full mb-4">
          <Zap className="w-3.5 h-3.5" />{t("badge")}
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-3">{t("heading")}</h1>
        <p className="text-gray-500">{t("subheading")}</p>
      </div>

      <form onSubmit={handleSearch} className="space-y-8">
        {/* Destination */}
        <div className="flex flex-col gap-3">
          <label className="flex items-center gap-2 text-sm font-semibold text-gray-900">
            <MapPin className="w-4 h-4 text-blue-600" />{t("whereGoing")}
          </label>
          <div className="space-y-4">
            {countries.map((country) => (
              <div key={country.id}>
                <p className="text-xs font-medium text-gray-400 mb-2">{country.emoji} {country.label[locale]}</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {country.cities.map((city) => (
                    <button key={city.id} type="button" onClick={() => setInput((p) => ({ ...p, destination: city.id }))}
                      className={`${optionBase} ${input.destination === city.id ? optionSelected : optionDefault} flex-col items-center text-center py-3`}>
                      <span className="text-sm font-medium text-gray-900">{city.label[locale]}</span>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Duration */}
        <div className="flex flex-col gap-3">
          <label className="flex items-center gap-2 text-sm font-semibold text-gray-900">
            <Clock className="w-4 h-4 text-blue-600" />{t("howLong")}
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {durationOptions.map((d) => (
              <button key={d.value} type="button" onClick={() => setInput((p) => ({ ...p, duration: d.value }))}
                className={`${optionBase} ${input.duration === d.value ? optionSelected : optionDefault} flex-col items-center text-center py-4`}>
                <span className="text-lg font-bold text-gray-900">{d.value}N</span>
                <span className="text-xs text-gray-500">{d.label[locale]}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Traveler type */}
        <div className="flex flex-col gap-3">
          <label className="flex items-center gap-2 text-sm font-semibold text-gray-900">
            <Users className="w-4 h-4 text-blue-600" />{t("whosTraveling")}
          </label>
          <div className="grid grid-cols-2 gap-2.5">
            {travelerTypeOptions.map((tt) => (
              <button key={tt.value} type="button" onClick={() => setInput((p) => ({ ...p, travelerType: tt.value as TravelerType }))}
                className={`${optionBase} ${input.travelerType === tt.value ? optionSelected : optionDefault} py-4`}>
                <span className="text-xl">{tt.emoji}</span>
                <p className="text-sm font-medium text-gray-900">{tt.label[locale]}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Style */}
        <div className="flex flex-col gap-3">
          <label className="flex items-center gap-2 text-sm font-semibold text-gray-900">
            <Zap className="w-4 h-4 text-blue-600" />{t("travelStyle")}
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
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

      {searched && (
        <div className="mt-12">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            {results.length > 0 ? t("matchCount", { count: results.length }) : t("noMatch")}
          </h2>
          {results.length === 0 && (
            <p className="text-gray-500 text-sm">{t("noMatchHint")}{" "}
              <button onClick={() => router.push("/itineraries" as never)} className="text-blue-600 underline">{t("browseAll")}</button>.
            </p>
          )}
          {results.length > 0 && (
            <div className="space-y-4">
              {results.map((itin) => <ItineraryCard key={itin.id} itinerary={itin} />)}
              <div className="pt-4 text-center">
                <button onClick={() => router.push("/itineraries" as never)}
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors">
                  {t("seeAllItineraries")} <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
