import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { ArrowLeft, MapPin, Clock } from "lucide-react";
import { dayCourses } from "@/data/day-courses";
import { Badge } from "@/components/ui/Badge";
import { styleLabel, travelerLabel } from "@/lib/utils";
import type { Metadata } from "next";
import type { Locale, DayActivity } from "@/types";

interface PageProps {
  params: Promise<{ locale: string; id: string }>;
}

export async function generateStaticParams() {
  return dayCourses.flatMap((c) => ["en", "ko"].map((locale) => ({ locale, id: c.id })));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale, id } = await params;
  const course = dayCourses.find((c) => c.id === id);
  if (!course) return {};
  const loc = locale as Locale;
  return {
    title: course.title[loc],
    description: course.summary[loc],
    alternates: { canonical: `/courses/${id}`, languages: { en: `/courses/${id}`, ko: `/ko/courses/${id}` } },
  };
}

const activityColors: Record<string, string> = {
  transport: "bg-gray-100 text-gray-500",
  sightseeing: "bg-blue-100 text-blue-600",
  dining: "bg-orange-100 text-orange-600",
  tour: "bg-green-100 text-green-600",
  free: "bg-yellow-100 text-yellow-600",
  beach: "bg-cyan-100 text-cyan-600",
  shopping: "bg-pink-100 text-pink-600",
  accommodation: "bg-purple-100 text-purple-600",
};

function ActivityItem({ activity, locale }: { activity: DayActivity; locale: Locale }) {
  const colorClass = activityColors[activity.type] ?? "bg-gray-100 text-gray-500";
  return (
    <div className="flex gap-4">
      <div className="flex flex-col items-center">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold ${colorClass}`}>
          {activity.time.slice(0, 2)}
        </div>
        <div className="w-px flex-1 bg-gray-100 mt-1" />
      </div>
      <div className="pb-5 flex-1 min-w-0">
        <p className="text-xs text-gray-400 font-medium mb-0.5">{activity.time}</p>
        <h4 className="text-sm font-semibold text-gray-900 mb-0.5">{activity.title[locale]}</h4>
        <p className="text-sm text-gray-500 leading-relaxed">{activity.description[locale]}</p>
        {activity.location && (
          <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
            <MapPin className="w-3 h-3" />
            {activity.location.lat.toFixed(4)}, {activity.location.lng.toFixed(4)}
          </p>
        )}
      </div>
    </div>
  );
}

export default async function CourseDetailPage({ params }: PageProps) {
  const { locale, id } = await params;
  setRequestLocale(locale);
  const loc = locale as Locale;
  const t = await getTranslations("courses");

  const course = dayCourses.find((c) => c.id === id);
  if (!course) notFound();

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
      <Link href="/courses" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 transition-colors mb-6">
        <ArrowLeft className="w-4 h-4" /> {t("allCourses")}
      </Link>

      {/* Hero */}
      <div className={`bg-gradient-to-br ${course.coverGradient} rounded-3xl p-8 text-white mb-8 relative overflow-hidden`}>
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative z-10">
          <div className="flex flex-wrap gap-2 mb-4">
            {course.tags.map((tag) => (
              <span key={tag} className="bg-white/20 backdrop-blur-sm text-white text-xs font-medium px-2.5 py-1 rounded-full">{tag}</span>
            ))}
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold leading-tight mb-3">{course.title[loc]}</h1>
          <p className="text-white/80 text-base leading-relaxed">{course.summary[loc]}</p>
          <div className="flex gap-4 mt-4 text-sm text-white/60">
            <span className="flex items-center gap-1"><Clock className="w-4 h-4" />{course.activities.length} {loc === "ko" ? "개 장소" : "spots"}</span>
            <span className="flex items-center gap-1"><MapPin className="w-4 h-4" />{course.city}</span>
          </div>
        </div>
      </div>

      {/* Labels */}
      <div className="flex flex-wrap gap-2 mb-8">
        {course.styles.map((s) => <Badge key={s} variant="blue">{styleLabel(s, loc)}</Badge>)}
        {course.travelerTypes.map((t) => <Badge key={t} variant="green">{travelerLabel(t, loc)}</Badge>)}
      </div>

      {/* Timeline */}
      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-4">{t("timeline")}</h2>
        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
          {course.activities.map((activity, i) => (
            <ActivityItem key={i} activity={activity} locale={loc} />
          ))}
        </div>
      </section>
    </div>
  );
}
