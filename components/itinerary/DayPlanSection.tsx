"use client";

import Image from "next/image";
import { useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Lightbulb, ExternalLink, BookOpen, Utensils, MapPin, Bus, Waves, ShoppingBag, Compass, Star, Coffee, Map } from "lucide-react";
import type { DayActivity, ActivityType, Locale, LocaleString, DayCostBreakdown } from "@/types";
import { cn } from "@/lib/utils";
import { displayPrice } from "@/lib/currency";

// ── Icons & Colors ──────────────────────────────────

const activityIcons: Record<ActivityType, React.FC<{ className?: string }>> = {
  transport: Bus, sightseeing: MapPin, dining: Utensils,
  accommodation: Star, tour: Compass, free: Coffee,
  beach: Waves, shopping: ShoppingBag,
};

const activityColors: Record<ActivityType, string> = {
  transport: "bg-gray-100 text-gray-500",
  sightseeing: "bg-blue-100 text-blue-600",
  dining: "bg-orange-100 text-orange-600",
  accommodation: "bg-purple-100 text-purple-600",
  tour: "bg-green-100 text-green-600",
  free: "bg-yellow-100 text-yellow-600",
  beach: "bg-cyan-100 text-cyan-600",
  shopping: "bg-pink-100 text-pink-600",
};

// ── Activity Item ───────────────────────────────────

function ActivityItem({ activity, locale, index }: { activity: DayActivity; locale: Locale; index: number }) {
  const Icon = activityIcons[activity.type] ?? MapPin;
  const colorClass = activityColors[activity.type] ?? "bg-gray-100 text-gray-500";

  return (
    <div className="flex gap-4">
      {/* Number + line */}
      <div className="flex flex-col items-center">
        <div className={cn("w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold", colorClass)}>
          {index}
        </div>
        <div className="w-px flex-1 bg-gray-100 mt-1" />
      </div>

      {/* Content */}
      <div className="pb-6 flex-1 min-w-0">
        <p className="text-xs text-gray-400 font-medium mb-0.5">{activity.time}</p>
        <h4 className="text-sm font-semibold text-gray-900 mb-1">{activity.title[locale]}</h4>
        <p className="text-sm text-gray-500 leading-relaxed">{activity.description[locale]}</p>

        {/* Tips */}
        {activity.tips && activity.tips.length > 0 && (
          <div className="mt-2 space-y-1">
            {activity.tips.map((tip, i) => (
              <div key={i} className="flex items-start gap-1.5 text-xs text-amber-700 bg-amber-50 rounded-lg px-3 py-1.5 max-w-lg">
                <Lightbulb className="w-3.5 h-3.5 mt-0.5 flex-shrink-0 text-amber-500" />
                <span>{tip[locale]}</span>
              </div>
            ))}
          </div>
        )}

        {/* Photo */}
        {activity.photo && (
          <div className="mt-3 rounded-xl overflow-hidden border border-gray-100">
            <Image src={activity.photo} alt={activity.title[locale]} width={600} height={340} className="w-full h-auto object-cover" />
          </div>
        )}

        {/* Buttons: booking links + guide post */}
        {(activity.bookingLinks || activity.postSlug) && (
          <div className="flex flex-wrap gap-2 mt-3">
            {activity.bookingLinks?.klook && (
              <a href={activity.bookingLinks.klook} target="_blank" rel="noopener noreferrer sponsored"
                className="inline-flex items-center gap-1.5 bg-orange-50 hover:bg-orange-100 text-orange-700 text-xs font-medium px-3 py-1.5 rounded-lg transition-colors">
                <ExternalLink className="w-3 h-3" />
                {locale === "ko" ? "입장권 예약" : "Book Tickets"}
              </a>
            )}
            {activity.bookingLinks?.agoda && (
              <a href={activity.bookingLinks.agoda} target="_blank" rel="noopener noreferrer sponsored"
                className="inline-flex items-center gap-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-medium px-3 py-1.5 rounded-lg transition-colors">
                <ExternalLink className="w-3 h-3" />
                {locale === "ko" ? "숙소 예약" : "Book Hotel"}
              </a>
            )}
            {activity.bookingLinks?.mrt && (
              <a href={activity.bookingLinks.mrt} target="_blank" rel="noopener noreferrer sponsored"
                className="inline-flex items-center gap-1.5 bg-green-50 hover:bg-green-100 text-green-700 text-xs font-medium px-3 py-1.5 rounded-lg transition-colors">
                <ExternalLink className="w-3 h-3" />
                {locale === "ko" ? "투어 예약" : "Book Tour"}
              </a>
            )}
            {activity.postSlug && (
              <a href={`/${locale === "ko" ? "ko/" : ""}posts/${activity.postSlug}`} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 bg-violet-50 hover:bg-violet-100 text-violet-700 text-xs font-medium px-3 py-1.5 rounded-lg transition-colors">
                <BookOpen className="w-3 h-3" />
                {locale === "ko" ? "꿀팁 자세히 보기" : "Read Full Guide"}
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ── Day Plan Section ────────────────────────────────

type DayPlanCompat = {
  day: number;
  title: LocaleString;
  subtitle?: LocaleString;
  summary?: LocaleString;
  activities: DayActivity[];
  whyThisCourse?: LocaleString[];
  courseType?: LocaleString[];
  costs?: DayCostBreakdown;
  googleMapsUrl?: string;
};

interface DayPlanSectionProps {
  day: DayPlanCompat;
  locale: Locale;
  defaultOpen?: boolean;
}

export function DayPlanSection({ day, locale }: DayPlanSectionProps) {
  return (
    <div className="border border-gray-100 rounded-2xl overflow-hidden">
      {/* Day header */}
      <div className="bg-gray-50 px-5 py-4 flex items-center gap-4">
        <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
          <span className="text-white text-sm font-bold">{day.day}</span>
        </div>
        <div>
          <h3 className="font-semibold text-gray-900 text-[15px]">
            Day {day.day} — {day.title[locale]}
          </h3>
          {day.subtitle && (
            <p className="text-xs text-gray-500 mt-0.5">{day.subtitle[locale]}</p>
          )}
        </div>
      </div>

      {/* Summary */}
      {day.summary && (
        <p className="px-5 mt-3 text-sm text-gray-500 leading-relaxed">{day.summary[locale]}</p>
      )}

      {/* Why this course */}
      {day.whyThisCourse && day.whyThisCourse.length > 0 && (
        <div className="mx-5 mt-4 bg-blue-50 border border-blue-100 rounded-xl px-4 py-3">
          <p className="text-xs font-semibold text-blue-700 mb-2">
            {locale === "ko" ? "이 코스를 가야 하는 이유" : "Why this course?"}
          </p>
          <ul className="space-y-1">
            {day.whyThisCourse.map((point, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-blue-600 leading-relaxed">
                <span className="text-blue-400 mt-0.5">•</span>
                <span>{point[locale]}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Course type tags */}
      {day.courseType && day.courseType.length > 0 && (
        <div className="flex flex-wrap gap-1.5 px-5 mt-3">
          {day.courseType.map((tag, i) => (
            <span key={i} className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
              {tag[locale]}
            </span>
          ))}
        </div>
      )}

      {/* Activities timeline */}
      <div className="px-5 pt-5">
        {day.activities.map((activity, i) => (
          <ActivityItem key={i} activity={activity} locale={locale} index={i + 1} />
        ))}
      </div>

      {/* Google Maps button */}
      {day.googleMapsUrl && (
        <div className="px-5 mb-4">
          <a href={day.googleMapsUrl} target="_blank" rel="noopener noreferrer"
            className="w-full flex items-center justify-center gap-2 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 text-sm font-medium py-2.5 px-4 rounded-xl transition-colors">
            <Map className="w-4 h-4 text-blue-500" />
            {locale === "ko" ? "구글 지도에서 보기" : "Open in Google Maps"}
          </a>
        </div>
      )}

      {/* Per-day cost summary */}
      {day.costs && (
        <div className="mx-5 mb-5 bg-gray-50 rounded-xl px-4 py-3">
          <p className="text-xs font-semibold text-gray-500 mb-2">
            {locale === "ko" ? "오늘의 예상 경비 (1인)" : "Today's estimated cost (per person)"}
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
            <div>
              <span className="text-gray-400">{locale === "ko" ? "식비" : "Food"}</span>
              <p className="font-semibold text-gray-800">{displayPrice(day.costs.food, day.costs.currency, locale)}</p>
            </div>
            <div>
              <span className="text-gray-400">{locale === "ko" ? "투어" : "Tour"}</span>
              <p className="font-semibold text-gray-800">{displayPrice(day.costs.activity, day.costs.currency, locale)}</p>
            </div>
            <div>
              <span className="text-gray-400">{locale === "ko" ? "교통" : "Transport"}</span>
              <p className="font-semibold text-gray-800">{displayPrice(day.costs.transport, day.costs.currency, locale)}</p>
            </div>
            <div>
              <span className="text-gray-400">{locale === "ko" ? "기타" : "Etc"}</span>
              <p className="font-semibold text-gray-800">{displayPrice(day.costs.etc, day.costs.currency, locale)}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
