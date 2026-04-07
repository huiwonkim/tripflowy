"use client";

import { useTranslations } from "next-intl";
import type { BudgetItem, Locale } from "@/types";
import { DollarSign } from "lucide-react";

interface BudgetSectionProps {
  items: BudgetItem[];
  locale: Locale;
  nights?: number;
}

export function BudgetSection({ items, locale, nights }: BudgetSectionProps) {
  const t = useTranslations("budget");
  const totalMin = items.reduce((sum, item) => sum + item.min, 0);
  const totalMax = items.reduce((sum, item) => sum + item.max, 0);
  const currency = items[0]?.currency ?? "USD";

  // If nights provided, multiply per-night/per-day items
  const multiplier = nights ?? 1;

  return (
    <section className="mt-10">
      <div className="mb-4">
        <p className="text-sm font-medium text-emerald-600 mb-1">{t("label")}</p>
        <h2 className="text-xl font-bold text-gray-900">{t("heading")}</h2>
      </div>

      <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
        <div className="divide-y divide-gray-100">
          <div className="grid grid-cols-2 px-5 py-3 bg-gray-50 text-xs font-medium text-gray-500 uppercase tracking-wide">
            <span>{t("category")}</span>
            <span className="text-right">{t("range")}</span>
          </div>

          {items.map((item, i) => (
            <div key={i} className="grid grid-cols-2 px-5 py-4 items-center">
              <div>
                <p className="text-sm font-medium text-gray-900">{item.category[locale]}</p>
                {item.note && <p className="text-xs text-gray-400 mt-0.5">{item.note[locale]}</p>}
              </div>
              <p className="text-sm font-semibold text-gray-900 text-right">
                ${item.min} — ${item.max}
              </p>
            </div>
          ))}

          <div className="grid grid-cols-2 px-5 py-4 bg-emerald-50 items-center">
            <div className="flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-emerald-600" />
              <span className="text-sm font-bold text-emerald-800">{t("total")}</span>
            </div>
            <p className="text-base font-bold text-emerald-800 text-right">
              ${totalMin} — ${totalMax} {currency}
            </p>
          </div>
        </div>

        <p className="px-5 py-3 text-xs text-gray-400 bg-gray-50 border-t border-gray-100">
          {t("disclaimer")}
        </p>
      </div>
    </section>
  );
}
