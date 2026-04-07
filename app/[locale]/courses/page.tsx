import { getTranslations, setRequestLocale } from "next-intl/server";
import { CourseCard } from "@/components/course/CourseCard";
import { dayCourses } from "@/data/day-courses";
import { countries } from "@/data/destinations";
import type { Locale } from "@/types";
import type { Metadata } from "next";

interface PageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ city?: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "courses" });
  return {
    title: t("heading"),
    description: t("subheading"),
    alternates: { canonical: "/courses", languages: { en: "/courses", ko: "/ko/courses" } },
  };
}

export default async function CoursesPage({ params, searchParams }: PageProps) {
  const { locale } = await params;
  const { city } = await searchParams;
  setRequestLocale(locale);
  const loc = locale as Locale;
  const t = await getTranslations("courses");

  const filtered = city ? dayCourses.filter((c) => c.city === city) : dayCourses;

  // Get unique cities that have courses
  const citiesWithCourses = [...new Set(dayCourses.map((c) => c.city))];
  const allCities = countries.flatMap((c) => c.cities);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      <div className="mb-8">
        <p className="text-sm font-medium text-emerald-600 mb-1">{t("label")}</p>
        <h1 className="text-3xl font-bold text-gray-900">{t("heading")}</h1>
        <p className="text-gray-500 mt-2">{t("subheading")}</p>
      </div>

      {/* City filter */}
      <div className="flex flex-wrap gap-2 mb-8">
        <a href={`/${locale === "ko" ? "ko/" : ""}courses`}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${!city ? "bg-gray-900 text-white" : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"}`}>
          {t("all")}
        </a>
        {citiesWithCourses.map((cId) => {
          const cityObj = allCities.find((c) => c.id === cId);
          if (!cityObj) return null;
          return (
            <a key={cId} href={`/${locale === "ko" ? "ko/" : ""}courses?city=${cId}`}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${city === cId ? "bg-gray-900 text-white" : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"}`}>
              {cityObj.label[loc]}
            </a>
          );
        })}
      </div>

      <p className="text-sm text-gray-500 mb-6">
        {filtered.length} {locale === "ko" ? "개 코스" : `course${filtered.length === 1 ? "" : "s"}`}
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filtered.map((course) => (
          <CourseCard key={course.id} course={course} />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-20">
          <p className="text-lg font-medium text-gray-600 mb-2">{t("noCourses")}</p>
          <a href={`/${locale === "ko" ? "ko/" : ""}courses`} className="text-blue-600 text-sm underline">{t("viewAll")}</a>
        </div>
      )}
    </div>
  );
}
