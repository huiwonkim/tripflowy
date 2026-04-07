"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { ChevronDown } from "lucide-react";
import type { FAQ, Locale } from "@/types";

interface FAQSectionProps {
  items: FAQ[];
  locale: Locale;
}

function FAQItem({ item, locale }: { item: FAQ; locale: Locale }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b border-gray-100 last:border-b-0">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-gray-50 transition-colors"
      >
        <span className="text-sm font-medium text-gray-900 pr-4">{item.question[locale]}</span>
        <ChevronDown className={`w-4 h-4 text-gray-400 flex-shrink-0 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="px-5 pb-4">
          <p className="text-sm text-gray-600 leading-relaxed">{item.answer[locale]}</p>
        </div>
      )}
    </div>
  );
}

export function FAQSection({ items, locale }: FAQSectionProps) {
  const t = useTranslations("faq");

  return (
    <section className="mt-16">
      <div className="mb-6">
        <p className="text-sm font-medium text-violet-600 mb-1">{t("label")}</p>
        <h2 className="text-xl font-bold text-gray-900">{t("heading")}</h2>
      </div>

      <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
        {items.map((item, i) => (
          <FAQItem key={i} item={item} locale={locale} />
        ))}
      </div>
    </section>
  );
}
