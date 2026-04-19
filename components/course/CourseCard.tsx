"use client";

import { useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
import { MapPin, ArrowRight } from "lucide-react";
import type { DayCourse, Locale } from "@/types";
import { Badge } from "@/components/ui/Badge";
import { CoverImage } from "@/components/ui/CoverImage";
import { styleLabel, travelerLabel } from "@/lib/utils";

interface CourseCardProps {
  course: DayCourse;
}

export function CourseCard({ course }: CourseCardProps) {
  const locale = useLocale() as Locale;

  return (
    <Link
      href={`/courses/${course.id}`}
      className="group flex flex-col bg-white rounded-2xl overflow-hidden border border-gray-100 hover:border-gray-200 hover:shadow-lg transition-all duration-200"
    >
      <CoverImage
        alt={course.title[locale]}
        gradient={course.coverGradient}
        heightClass="h-36"
        initial={course.city.charAt(0).toUpperCase()}
        overlayClass="bg-black/20"
      >
        <div className="absolute bottom-4 left-4 z-10 flex flex-wrap gap-1.5">
          {course.tags.slice(0, 3).map((tag) => (
            <span key={tag} className="bg-white/20 backdrop-blur-sm text-white text-xs font-medium px-2 py-0.5 rounded-full">
              {tag}
            </span>
          ))}
        </div>
      </CoverImage>

      <div className="flex flex-col flex-1 p-4">
        <h3 className="font-semibold text-gray-900 text-sm leading-snug group-hover:text-blue-700 transition-colors mb-1.5">
          {course.title[locale]}
        </h3>
        <p className="text-gray-500 text-xs leading-relaxed mb-3 line-clamp-2">
          {course.summary[locale]}
        </p>

        <div className="flex flex-wrap gap-1.5 mt-auto">
          {course.styles.slice(0, 2).map((s) => (
            <Badge key={s} variant="blue">{styleLabel(s, locale)}</Badge>
          ))}
          {course.travelerTypes.slice(0, 2).map((t) => (
            <Badge key={t} variant="outline">{travelerLabel(t, locale)}</Badge>
          ))}
        </div>

        <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
          <span className="flex items-center gap-1 text-xs text-gray-400">
            <MapPin className="w-3 h-3" />
            {course.activities.length} {locale === "ko" ? "개 장소" : "spots"}
          </span>
          <span className="flex items-center gap-1 text-blue-600 text-xs font-medium group-hover:gap-2 transition-all">
            {locale === "ko" ? "상세 보기" : "Details"} <ArrowRight className="w-3 h-3" />
          </span>
        </div>
      </div>
    </Link>
  );
}
