import { getTranslations, setRequestLocale } from "next-intl/server";
import { HotelCard } from "@/components/hotels/HotelCard";
import { hotels } from "@/data/hotels";
import { countries } from "@/data/destinations";
import type { Locale } from "@/types";
import type { Metadata } from "next";

interface PageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ destination?: string; style?: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "hotels" });
  return {
    title: t("heading"),
    description: t("subheading"),
    alternates: { canonical: "/hotels", languages: { en: "/hotels", ko: "/ko/hotels" } },
  };
}

export default async function HotelsPage({ params, searchParams }: PageProps) {
  const { locale } = await params;
  const { destination, style } = await searchParams;
  setRequestLocale(locale);
  const loc = locale as Locale;
  const t = await getTranslations("hotels");

  const filtered = hotels.filter((h) => {
    if (destination && h.destination !== destination) return false;
    if (style && !h.style.includes(style as never)) return false;
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      <div className="mb-8">
        <p className="text-sm font-medium text-blue-600 mb-1">{t("label")}</p>
        <h1 className="text-3xl font-bold text-gray-900">{t("heading")}</h1>
        <p className="text-gray-500 mt-2 max-w-xl">{t("subheading")}</p>
      </div>

      <div className="flex flex-wrap gap-2 mb-8">
        <a href={`/${locale === "ko" ? "ko/" : ""}hotels`} className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${!destination && !style ? "bg-gray-900 text-white" : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"}`}>
          {t("all")}
        </a>
        {countries.flatMap((c) => c.cities.filter((city) => hotels.some((h) => h.destination === city.id)).map((city) => (
          <a key={city.id} href={`/${locale === "ko" ? "ko/" : ""}hotels?destination=${city.id}`}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${destination === city.id ? "bg-gray-900 text-white" : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"}`}>
            {city.label[loc]}
          </a>
        )))}
      </div>

      <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5 mb-8 flex gap-3">
        <span className="text-blue-500 mt-0.5 flex-shrink-0">i</span>
        <p className="text-sm text-blue-700 leading-relaxed">{t("infoCallout")}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((hotel) => <HotelCard key={hotel.id} hotel={hotel} locale={loc} />)}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-20 text-gray-400">
          <p className="text-lg font-medium text-gray-600 mb-2">{t("noHotels")}</p>
          <a href={`/${locale === "ko" ? "ko/" : ""}hotels`} className="text-blue-600 text-sm underline">{t("viewAll")}</a>
        </div>
      )}
    </div>
  );
}
