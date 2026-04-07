"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { Search, MapPin, Clock, Users, Zap } from "lucide-react";
import type { PlannerInput, Locale } from "@/types";
import { countries, durationOptions, travelerTypeOptions, styleOptions } from "@/data/destinations";

const emptyInput: PlannerInput = { destination: "", duration: "", travelerType: "", style: "" };

interface QuickPlannerProps {
  compact?: boolean;
}

export function QuickPlanner({ compact = false }: QuickPlannerProps) {
  const router = useRouter();
  const locale = useLocale() as Locale;
  const t = useTranslations("planner");
  const [input, setInput] = useState<PlannerInput>(emptyInput);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (input.destination) params.set("destination", input.destination);
    if (input.duration) params.set("duration", input.duration);
    if (input.travelerType) params.set("travelerType", input.travelerType);
    if (input.style) params.set("style", input.style);
    router.push(`/itineraries?${params.toString()}` as never);
  }

  const selectBase =
    "w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition cursor-pointer";

  return (
    <form onSubmit={handleSubmit}>
      <div className={`grid gap-3 ${compact ? "grid-cols-2 md:grid-cols-4" : "grid-cols-1 sm:grid-cols-2"}`}>
        <div className="relative">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"><MapPin className="w-4 h-4" /></div>
          <select className={`${selectBase} pl-10`} value={input.destination} onChange={(e) => setInput((p) => ({ ...p, destination: e.target.value }))}>
            <option value="">{t("destination")}</option>
            {countries.map((c) => (
              <optgroup key={c.id} label={`${c.emoji} ${c.label[locale]}`}>
                {c.cities.map((city) => (
                  <option key={city.id} value={city.id}>{city.label[locale]}</option>
                ))}
              </optgroup>
            ))}
          </select>
        </div>

        <div className="relative">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"><Clock className="w-4 h-4" /></div>
          <select className={`${selectBase} pl-10`} value={input.duration} onChange={(e) => setInput((p) => ({ ...p, duration: e.target.value }))}>
            <option value="">{t("duration")}</option>
            {durationOptions.map((d) => (<option key={d.value} value={d.value}>{d.label[locale]}</option>))}
          </select>
        </div>

        <div className="relative">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"><Users className="w-4 h-4" /></div>
          <select className={`${selectBase} pl-10`} value={input.travelerType} onChange={(e) => setInput((p) => ({ ...p, travelerType: e.target.value as PlannerInput["travelerType"] }))}>
            <option value="">{t("whosTraveling")}</option>
            {travelerTypeOptions.map((tt) => (<option key={tt.value} value={tt.value}>{tt.emoji} {tt.label[locale]}</option>))}
          </select>
        </div>

        <div className="relative">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"><Zap className="w-4 h-4" /></div>
          <select className={`${selectBase} pl-10`} value={input.style} onChange={(e) => setInput((p) => ({ ...p, style: e.target.value as PlannerInput["style"] }))}>
            <option value="">{t("travelStyle")}</option>
            {styleOptions.map((s) => (<option key={s.value} value={s.value}>{s.label[locale]}</option>))}
          </select>
        </div>
      </div>

      <button type="submit" className="mt-3 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3.5 px-6 rounded-xl transition-colors flex items-center justify-center gap-2 text-sm">
        <Search className="w-4 h-4" />{t("findMyItinerary")}
      </button>
    </form>
  );
}
