"use client";

import { useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Clock, Users, ArrowRight } from "lucide-react";
import type { Itinerary, Locale } from "@/types";
import { Badge } from "@/components/ui/Badge";
import { durationLabel, styleLabel, travelerLabel } from "@/lib/utils";

interface ItineraryCardProps {
  itinerary: Itinerary;
}

const styleColors: Record<string, string> = {
  relaxed: "blue",
  efficient: "green",
  "activity-focused": "amber",
  "hotel-focused": "gray",
};

export function ItineraryCard({ itinerary }: ItineraryCardProps) {
  const locale = useLocale() as Locale;
  const title = itinerary.title[locale];
  const summary = itinerary.summary[locale];
  const dest = itinerary.destinationLabel[locale];

  return (
    <Link
      href={`/itineraries/${itinerary.slug}`}
      className="group flex flex-col bg-white rounded-2xl overflow-hidden border border-gray-100 hover:border-gray-200 hover:shadow-lg transition-all duration-200"
    >
      <div className={`h-44 bg-gradient-to-br ${itinerary.coverGradient} relative flex items-end p-5`}>
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative z-10 flex flex-wrap gap-1.5">
          <span className="bg-white/20 backdrop-blur-sm text-white text-xs font-medium px-2.5 py-1 rounded-full">{dest}</span>
          <span className="bg-white/20 backdrop-blur-sm text-white text-xs font-medium px-2.5 py-1 rounded-full">{durationLabel(itinerary.duration, locale)}</span>
        </div>
      </div>

      <div className="flex flex-col flex-1 p-5">
        <h3 className="font-semibold text-gray-900 text-[15px] leading-snug group-hover:text-blue-700 transition-colors mb-2">{title}</h3>
        <p className="text-gray-500 text-sm leading-relaxed mb-4 line-clamp-2">{summary}</p>

        <div className="flex flex-wrap gap-2 mt-auto">
          <Badge variant={styleColors[itinerary.style] as "blue" | "green" | "amber" | "gray"}>{styleLabel(itinerary.style, locale)}</Badge>
          {itinerary.travelerType.map((t) => <Badge key={t} variant="outline">{travelerLabel(t, locale)}</Badge>)}
        </div>

        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
          <div className="flex items-center gap-3 text-xs text-gray-400">
            <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{durationLabel(itinerary.duration, locale)}</span>
            <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" />{itinerary.travelerType.map((t) => travelerLabel(t, locale)).join(", ")}</span>
          </div>
          <span className="flex items-center gap-1 text-blue-600 text-xs font-medium group-hover:gap-2 transition-all">
            {locale === "ko" ? "일정 보기" : "View plan"} <ArrowRight className="w-3.5 h-3.5" />
          </span>
        </div>
      </div>
    </Link>
  );
}
