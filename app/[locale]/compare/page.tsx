"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { ArrowRight, CheckCircle, XCircle } from "lucide-react";
import { itineraries } from "@/data/itineraries";
import { durationLabel, styleLabel, travelerLabel } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";
import type { Locale } from "@/types";

function CompareContent() {
  const searchParams = useSearchParams();
  const locale = useLocale() as Locale;
  const t = useTranslations("compare");

  const slugs = searchParams.get("items")?.split(",").filter(Boolean) ?? [];
  const items = slugs.map((slug) => itineraries.find((i) => i.slug === slug)).filter(Boolean);

  if (items.length < 2) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16 text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">{t("heading")}</h1>
        <p className="text-gray-500 mb-6">{t("noItems")}</p>
        <Link href="/itineraries" className="inline-flex items-center gap-2 bg-blue-600 text-white font-semibold px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors">
          {t("browseItineraries")} <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">{t("heading")}</h1>
        <p className="text-gray-500 mt-2">{t("subheading")}</p>
      </div>

      <div className={`grid gap-5 ${items.length === 2 ? "grid-cols-1 md:grid-cols-2" : "grid-cols-1 md:grid-cols-3"}`}>
        {items.map((itin) => {
          if (!itin) return null;
          const totalMin = itin.budget?.reduce((s, b) => s + b.min, 0) ?? 0;
          const totalMax = itin.budget?.reduce((s, b) => s + b.max, 0) ?? 0;

          return (
            <div key={itin.id} className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
              {/* Cover */}
              <div className={`h-32 bg-gradient-to-br ${itin.coverGradient} relative flex items-end p-4`}>
                <div className="absolute inset-0 bg-black/20" />
                <h3 className="relative z-10 text-white font-bold text-sm leading-snug">{itin.title[locale]}</h3>
              </div>

              {/* Details */}
              <div className="p-5 space-y-4">
                <dl className="space-y-3 text-sm">
                  <div className="flex justify-between"><dt className="text-gray-500">{t("duration")}</dt><dd className="font-medium text-gray-900">{durationLabel(itin.duration, locale)}</dd></div>
                  <div className="flex justify-between"><dt className="text-gray-500">{t("style")}</dt><dd><Badge variant="blue">{styleLabel(itin.style, locale)}</Badge></dd></div>
                  <div className="flex justify-between"><dt className="text-gray-500">{t("travelerType")}</dt><dd className="font-medium text-gray-900">{itin.travelerType.map((tt) => travelerLabel(tt, locale)).join(", ")}</dd></div>
                  {totalMin > 0 && (
                    <div className="flex justify-between"><dt className="text-gray-500">{t("budgetRange")}</dt><dd className="font-medium text-emerald-700">${totalMin} — ${totalMax}</dd></div>
                  )}
                </dl>

                <div className="pt-3 border-t border-gray-100">
                  <p className="text-xs font-medium text-gray-500 mb-2 flex items-center gap-1"><CheckCircle className="w-3.5 h-3.5 text-green-500" /> {t("bestFor")}</p>
                  <ul className="space-y-1">{itin.bestFor.map((b, i) => <li key={i} className="text-xs text-gray-600">{b[locale]}</li>)}</ul>
                </div>

                <div className="pt-3 border-t border-gray-100">
                  <p className="text-xs font-medium text-gray-500 mb-2 flex items-center gap-1"><XCircle className="w-3.5 h-3.5 text-red-400" /> {t("notIdealFor")}</p>
                  <ul className="space-y-1">{itin.notIdealFor.map((b, i) => <li key={i} className="text-xs text-gray-600">{b[locale]}</li>)}</ul>
                </div>

                <Link href={`/itineraries/${itin.slug}`}
                  className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold py-2.5 px-4 rounded-xl transition-colors mt-4">
                  {t("viewFullPlan")} <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function ComparePage() {
  return (
    <Suspense fallback={<div className="max-w-6xl mx-auto px-4 py-10 text-gray-400">Loading...</div>}>
      <CompareContent />
    </Suspense>
  );
}
