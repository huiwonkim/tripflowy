import { getTranslations, setRequestLocale } from "next-intl/server";
import { TourCard } from "@/components/tours/TourCard";
import { tours } from "@/data/tours";
import { countries } from "@/data/destinations";
import type { Locale } from "@/types";
import type { Metadata } from "next";

interface PageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ destination?: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "tours" });
  return {
    title: t("heading"),
    description: t("subheading"),
    alternates: { canonical: "/tours", languages: { en: "/tours", ko: "/ko/tours" } },
  };
}

export default async function ToursPage({ params, searchParams }: PageProps) {
  const { locale } = await params;
  const { destination } = await searchParams;
  setRequestLocale(locale);
  const loc = locale as Locale;
  const t = await getTranslations("tours");

  const filtered = destination ? tours.filter((tour) => tour.destination === destination) : tours;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      <div className="mb-8">
        <p className="text-sm font-medium text-amber-600 mb-1">{t("label")}</p>
        <h1 className="text-3xl font-bold text-gray-900">{t("heading")}</h1>
        <p className="text-gray-500 mt-2">{t("subheading")}</p>
      </div>

      <div className="flex flex-wrap gap-2 mb-8">
        <a href={`/${locale === "ko" ? "ko/" : ""}tours`} className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${!destination ? "bg-gray-900 text-white" : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"}`}>
          {t("allDestinations")}
        </a>
        {countries.flatMap((c) => c.cities.filter((city) => tours.some((tour) => tour.destination === city.id)).map((city) => (
          <a key={city.id} href={`/${locale === "ko" ? "ko/" : ""}tours?destination=${city.id}`}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${destination === city.id ? "bg-gray-900 text-white" : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"}`}>
            {city.label[loc]}
          </a>
        )))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((tour) => <TourCard key={tour.id} tour={tour} locale={loc} />)}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-20 text-gray-400">
          <p className="text-lg font-medium text-gray-600 mb-2">{t("noTours")}</p>
          <a href={`/${locale === "ko" ? "ko/" : ""}tours`} className="text-blue-600 text-sm underline">{t("viewAll")}</a>
        </div>
      )}
    </div>
  );
}
