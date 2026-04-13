"use client";

import { ExternalLink } from "lucide-react";
import type { PostCTA as PostCTAType, Locale } from "@/types";

interface PostCTAProps {
  cta: PostCTAType;
  locale: Locale;
  variant?: "inline" | "card" | "sticky";
}

export function PostCTA({ cta, locale, variant = "inline" }: PostCTAProps) {
  // Klook URLs: insert /ko/ for Korean locale, remove for English
  const url = locale === "ko"
    ? cta.url.replace("klook.com/activity/", "klook.com/ko/activity/")
    : cta.url.replace("klook.com/ko/activity/", "klook.com/activity/");

  if (variant === "inline") {
    return (
      <a href={url} target="_blank" rel="noopener noreferrer sponsored"
        className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors my-4">
        {cta.label[locale]}
        <ExternalLink className="w-3.5 h-3.5" />
      </a>
    );
  }

  if (variant === "card") {
    return (
      <div className="mt-12 bg-white border border-gray-200 rounded-2xl p-6 flex flex-col sm:flex-row items-center gap-4">
        <div className="flex-1 min-w-0">
          <p className="text-[15px] font-semibold text-gray-900 mb-1">{cta.label[locale]}</p>
          <div className="flex items-center gap-3 text-sm">
            {cta.price && <span className="font-bold text-blue-600">{cta.price[locale]}</span>}
            {cta.note && <span className="text-gray-400">{cta.note[locale]}</span>}
          </div>
          <p className="text-xs text-gray-400 mt-1">via {cta.provider}</p>
        </div>
        <a href={url} target="_blank" rel="noopener noreferrer sponsored"
          className="flex-shrink-0 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-xl transition-colors flex items-center gap-2 text-sm whitespace-nowrap">
          {locale === "ko" ? "예약하기" : "Book Now"}
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>
    );
  }

  // sticky
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-t border-gray-200 px-4 py-3 sm:hidden">
      <div className="max-w-[680px] mx-auto flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-medium text-gray-900 truncate">{cta.label[locale]}</p>
          {cta.price && <p className="text-xs font-bold text-blue-600">{cta.price[locale]}</p>}
        </div>
        <a href={url} target="_blank" rel="noopener noreferrer sponsored"
          className="flex-shrink-0 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-2.5 rounded-xl transition-colors text-sm flex items-center gap-1.5">
          {locale === "ko" ? "예약" : "Book"}
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>
    </div>
  );
}
