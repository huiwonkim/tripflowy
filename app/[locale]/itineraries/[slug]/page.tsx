import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { ArrowLeft, Clock, Users, CheckCircle, XCircle, ExternalLink } from "lucide-react";
import { getItineraryBySlug } from "@/lib/utils";
import { DayPlanSection } from "@/components/itinerary/DayPlanSection";
import { BudgetSection } from "@/components/itinerary/BudgetSection";
import { FAQSection } from "@/components/itinerary/FAQSection";
import { TourCard } from "@/components/tours/TourCard";
import { HotelCard } from "@/components/hotels/HotelCard";
import { Badge } from "@/components/ui/Badge";
import { tours } from "@/data/tours";
import { hotels } from "@/data/hotels";
import { itineraries } from "@/data/itineraries";
import { durationLabel, styleLabel, travelerLabel } from "@/lib/utils";
import { generateItineraryJsonLd, generateBreadcrumbJsonLd, generateFaqJsonLd } from "@/lib/jsonld";
import type { Metadata } from "next";
import type { Locale } from "@/types";

interface PageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export async function generateStaticParams() {
  return itineraries.flatMap((itin) =>
    ["en", "ko"].map((locale) => ({ locale, slug: itin.slug }))
  );
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const loc = locale as Locale;
  const itin = getItineraryBySlug(slug);
  if (!itin) return {};
  return {
    title: itin.title[loc],
    description: itin.summary[loc],
    alternates: {
      canonical: `/itineraries/${slug}`,
      languages: {
        en: `/itineraries/${slug}`,
        ko: `/ko/itineraries/${slug}`,
      },
    },
    openGraph: {
      title: itin.title[loc],
      description: itin.summary[loc],
      type: "article",
    },
  };
}

export default async function ItineraryDetailPage({ params }: PageProps) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const loc = locale as Locale;
  const t = await getTranslations("detail");
  const tBudget = await getTranslations("budget");
  const tFaq = await getTranslations("faq");

  const itin = getItineraryBySlug(slug);
  if (!itin) notFound();

  const relatedTours = tours.filter((tour) => itin.tourIds.includes(tour.id));
  const relatedHotels = hotels.filter((h) => itin.hotelIds.includes(h.id));

  const jsonLd: Record<string, unknown>[] = [
    generateItineraryJsonLd(itin, loc),
    generateBreadcrumbJsonLd([
      { name: "Home", url: "https://tripflowy.com" },
      { name: t("allItineraries"), url: "https://tripflowy.com/itineraries" },
      { name: itin.title[loc] },
    ]),
  ];
  if (itin.faq?.length) {
    jsonLd.push(generateFaqJsonLd(itin.faq, loc));
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
      {jsonLd.map((ld, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      ))}

      <Link href="/itineraries" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 transition-colors mb-6">
        <ArrowLeft className="w-4 h-4" /> {t("allItineraries")}
      </Link>

      {/* Hero */}
      <div className={`bg-gradient-to-br ${itin.coverGradient} rounded-3xl p-8 md:p-12 text-white mb-8 relative overflow-hidden`}>
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative z-10">
          <div className="flex flex-wrap gap-2 mb-5">
            <span className="bg-white/20 backdrop-blur-sm text-white text-xs font-medium px-3 py-1 rounded-full">{itin.destinationLabel[loc]}</span>
            <span className="bg-white/20 backdrop-blur-sm text-white text-xs font-medium px-3 py-1 rounded-full">{durationLabel(itin.duration, loc)}</span>
            <span className="bg-white/20 backdrop-blur-sm text-white text-xs font-medium px-3 py-1 rounded-full">{styleLabel(itin.style, loc)}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold leading-tight mb-4">{itin.title[loc]}</h1>
          <p className="text-white/80 text-lg max-w-2xl leading-relaxed">{itin.summary[loc]}</p>
          <div className="flex flex-wrap gap-4 mt-6 text-sm text-white/70">
            <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" />{durationLabel(itin.duration, loc)}</span>
            <span className="flex items-center gap-1.5"><Users className="w-4 h-4" />{itin.travelerType.map((tt) => travelerLabel(tt, loc)).join(", ")}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4">{t("overview")}</h2>
            <p className="text-gray-600 leading-relaxed">{itin.overview[loc]}</p>
          </section>

          <section className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-green-50 rounded-2xl p-5">
              <h3 className="font-semibold text-green-800 mb-3 flex items-center gap-2"><CheckCircle className="w-4 h-4" /> {t("bestFor")}</h3>
              <ul className="space-y-1.5">{itin.bestFor.map((item, i) => <li key={i} className="text-sm text-green-700">{item[loc]}</li>)}</ul>
            </div>
            <div className="bg-red-50 rounded-2xl p-5">
              <h3 className="font-semibold text-red-800 mb-3 flex items-center gap-2"><XCircle className="w-4 h-4" /> {t("notIdealFor")}</h3>
              <ul className="space-y-1.5">{itin.notIdealFor.map((item, i) => <li key={i} className="text-sm text-red-700">{item[loc]}</li>)}</ul>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4">{t("dayByDayPlan")}</h2>
            <div className="space-y-4">{itin.days.map((day) => <DayPlanSection key={day.day} day={day} locale={loc} />)}</div>
          </section>
        </div>

        <div className="space-y-6">
          <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm sticky top-20">
            <h3 className="font-semibold text-gray-900 mb-4">{t("tripSummary")}</h3>
            <dl className="space-y-3 text-sm">
              <div className="flex justify-between"><dt className="text-gray-500">{t("destination")}</dt><dd className="font-medium text-gray-900">{itin.destinationLabel[loc]}</dd></div>
              <div className="flex justify-between"><dt className="text-gray-500">{t("duration")}</dt><dd className="font-medium text-gray-900">{durationLabel(itin.duration, loc)}</dd></div>
              <div className="flex justify-between"><dt className="text-gray-500">{t("style")}</dt><dd className="font-medium text-gray-900">{styleLabel(itin.style, loc)}</dd></div>
              <div className="flex justify-between"><dt className="text-gray-500">{t("bestForLabel")}</dt><dd className="font-medium text-gray-900">{itin.travelerType.map((tt) => travelerLabel(tt, loc)).join(", ")}</dd></div>
            </dl>
            <div className="mt-5 pt-5 border-t border-gray-100">
              <div className="flex flex-wrap gap-1.5">{itin.tags.map((tag) => <Badge key={tag} variant="gray">{tag}</Badge>)}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Budget */}
      {itin.budget && itin.budget.length > 0 && (
        <BudgetSection items={itin.budget} locale={loc} />
      )}

      {/* FAQ */}
      {itin.faq && itin.faq.length > 0 && (
        <FAQSection items={itin.faq} locale={loc} />
      )}

      {/* Tours */}
      {relatedTours.length > 0 && (
        <section className="mt-16">
          <div className="mb-6">
            <p className="text-sm font-medium text-amber-600 mb-1">{t("toursLabel")}</p>
            <h2 className="text-xl font-bold text-gray-900">{t("toursHeading")}</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">{relatedTours.map((tour) => <TourCard key={tour.id} tour={tour} locale={loc} />)}</div>
        </section>
      )}

      {/* Hotels */}
      {relatedHotels.length > 0 && (
        <section className="mt-16">
          <div className="mb-6">
            <p className="text-sm font-medium text-blue-600 mb-1">{t("hotelsLabel")}</p>
            <h2 className="text-xl font-bold text-gray-900">{t("hotelsHeading")}</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">{relatedHotels.map((h) => <HotelCard key={h.id} hotel={h} locale={loc} context={`${t("hotelsLabel")}`} />)}</div>
        </section>
      )}

      {/* CTA */}
      <div className="mt-16 bg-gradient-to-br from-blue-600 to-blue-800 rounded-3xl p-8 text-white text-center">
        <h2 className="text-2xl font-bold mb-3">{t("ctaHeading")}</h2>
        <p className="text-blue-200 mb-6 max-w-lg mx-auto">{t("ctaSubheading")}</p>
        <div className="flex flex-wrap gap-3 justify-center">
          {relatedTours[0] && (
            <a href={relatedTours[0].affiliateUrl} target="_blank" rel="noopener noreferrer sponsored" className="bg-amber-500 hover:bg-amber-600 text-white font-semibold px-6 py-3 rounded-xl transition-colors flex items-center gap-2">
              {t("bookFirstTour")} <ExternalLink className="w-4 h-4" />
            </a>
          )}
          {relatedHotels[0] && (
            <a href={relatedHotels[0].affiliateUrl} target="_blank" rel="noopener noreferrer sponsored" className="bg-white/20 hover:bg-white/30 text-white font-semibold px-6 py-3 rounded-xl transition-colors flex items-center gap-2">
              {t("checkHotels")} <ExternalLink className="w-4 h-4" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
