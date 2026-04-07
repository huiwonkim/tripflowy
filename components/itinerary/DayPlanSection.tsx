import { Utensils, MapPin, Bus, Waves, ShoppingBag, Compass, Star, Coffee } from "lucide-react";
import type { DayActivity, ActivityType, Locale, LocaleString } from "@/types";

type DayPlanCompat = {
  day: number;
  title: LocaleString;
  subtitle?: LocaleString;
  activities: DayActivity[];
};
import { cn } from "@/lib/utils";

const activityIcons: Record<ActivityType, React.FC<{ className?: string }>> = {
  transport: Bus,
  sightseeing: MapPin,
  dining: Utensils,
  accommodation: Star,
  tour: Compass,
  free: Coffee,
  beach: Waves,
  shopping: ShoppingBag,
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

function ActivityItem({ activity, locale }: { activity: DayActivity; locale: Locale }) {
  const Icon = activityIcons[activity.type] ?? MapPin;
  const colorClass = activityColors[activity.type] ?? "bg-gray-100 text-gray-500";

  return (
    <div className="flex gap-4">
      <div className="flex flex-col items-center">
        <div className={cn("w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0", colorClass)}>
          <Icon className="w-4 h-4" />
        </div>
        <div className="w-px flex-1 bg-gray-100 mt-1" />
      </div>
      <div className="pb-5 flex-1 min-w-0">
        {activity.time && (
          <p className="text-xs text-gray-400 font-medium mb-0.5">{activity.time}</p>
        )}
        <h4 className="text-sm font-semibold text-gray-900 mb-0.5">
          {activity.title[locale]}
        </h4>
        <p className="text-sm text-gray-500 leading-relaxed">
          {activity.description[locale]}
        </p>
      </div>
    </div>
  );
}

interface DayPlanSectionProps {
  day: DayPlanCompat;
  locale: Locale;
  defaultOpen?: boolean;
}

export function DayPlanSection({ day, locale, defaultOpen = false }: DayPlanSectionProps) {
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

      {/* Activities */}
      <div className="px-5 pt-5">
        {day.activities.map((activity, i) => (
          <ActivityItem key={i} activity={activity} locale={locale} />
        ))}
      </div>
    </div>
  );
}
