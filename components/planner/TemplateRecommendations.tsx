"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Sparkles, Plus, Replace, X } from "lucide-react";
import { recommendTemplates } from "@/lib/templates";
import { styleLabel } from "@/lib/utils";
import type { DayTemplate } from "@/types/spot";
import type { GeneratedDay, Locale, PlannerInput, TravelStyle } from "@/types";

export type TemplateApplyTarget = number | "new"; // dayNumber | add new day

interface Props {
  input: PlannerInput;
  days: GeneratedDay[];
  locale: Locale;
  onApply: (template: DayTemplate, target: TemplateApplyTarget) => void;
}

/**
 * Horizontal scroll of "recommended day templates" derived from the legacy
 * DayCourse library. Clicking a card opens a **centered modal** (portaled to
 * document.body so it escapes the horizontal-scroll container's clip region)
 * where the user picks which Day to overwrite — or appends a new Day.
 */
export function TemplateRecommendations({ input, days, locale, onApply }: Props) {
  const picks = recommendTemplates(input, 6);
  const [activeTemplate, setActiveTemplate] = useState<DayTemplate | null>(null);
  const [mounted, setMounted] = useState(false);

  // createPortal requires the DOM be available — wait for mount in browser
  useEffect(() => { setMounted(true); }, []);

  // ESC closes the modal
  useEffect(() => {
    if (!activeTemplate) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setActiveTemplate(null);
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [activeTemplate]);

  if (picks.length === 0) return null;

  function handleSelect(t: DayTemplate, target: TemplateApplyTarget) {
    onApply(t, target);
    setActiveTemplate(null);
  }

  return (
    <>
      <section className="rounded-2xl border border-indigo-100 bg-indigo-50/40 px-5 py-4">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-4 h-4 text-indigo-600" />
          <h2 className="text-sm font-semibold text-gray-900">
            {locale === "ko" ? "💡 비슷한 추천 코스" : "💡 Recommended day courses"}
          </h2>
          <span className="text-xs text-gray-400 ml-1">
            {locale === "ko" ? "카드를 눌러 Day에 적용" : "Tap a card to apply"}
          </span>
        </div>
        <div className="relative -mx-5">
          <div className="overflow-x-auto">
            <div className="flex gap-3 px-5 pb-1 snap-x snap-mandatory">
              {picks.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setActiveTemplate(t)}
                  className="flex-shrink-0 w-[240px] sm:w-[260px] snap-start text-left group"
                >
                  <div className={`h-20 rounded-xl bg-gradient-to-br ${t.coverGradient} mb-2 transition-opacity group-hover:opacity-90`} />
                  <p className="text-sm font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors leading-snug line-clamp-2">
                    {t.title[locale]}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{t.summary[locale]}</p>
                  <div className="flex flex-wrap gap-1 mt-1.5">
                    {t.styles.slice(0, 3).map((s) => (
                      <span key={s} className="text-[10px] font-medium text-indigo-700 bg-indigo-100 px-1.5 py-0.5 rounded">
                        {styleLabel(s as TravelStyle, locale)}
                      </span>
                    ))}
                    <span className="text-[10px] text-gray-400 ml-auto">
                      {t.spotIds.length}{locale === "ko" ? "곳" : " spots"}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
          {/* Fade overlay on the right edge — signals that more cards scroll. */}
          {picks.length > 2 && (
            <div
              aria-hidden
              className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-indigo-50/90 via-indigo-50/40 to-transparent pointer-events-none rounded-r-2xl"
            />
          )}
        </div>
      </section>

      {/* Centered modal — portaled to document.body to avoid overflow clipping */}
      {mounted && activeTemplate && createPortal(
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/40 flex items-end sm:items-center justify-center p-0 sm:p-4"
          onClick={() => setActiveTemplate(null)}
        >
          <div
            className="bg-white w-full sm:max-w-md sm:rounded-2xl rounded-t-2xl shadow-xl overflow-hidden max-h-[85vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className={`h-24 bg-gradient-to-br ${activeTemplate.coverGradient} relative`}>
              <button
                type="button"
                onClick={() => setActiveTemplate(null)}
                className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm flex items-center justify-center text-white transition-colors"
                aria-label={locale === "ko" ? "닫기" : "Close"}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="px-5 pt-4 pb-2">
              <p className="text-base font-bold text-gray-900 leading-snug">
                {activeTemplate.title[locale]}
              </p>
              <p className="text-sm text-gray-500 mt-1 leading-relaxed">
                {activeTemplate.summary[locale]}
              </p>
              <p className="text-xs text-gray-400 mt-2">
                {activeTemplate.spotIds.length}
                {locale === "ko" ? "곳 · 적용할 Day를 선택하세요" : " spots · Choose which day to apply"}
              </p>
            </div>

            {/* Day list — scrollable if many days */}
            <div className="flex-1 overflow-y-auto border-t border-gray-100">
              {days.map((d) => (
                <button
                  key={d.dayNumber}
                  type="button"
                  onClick={() => handleSelect(activeTemplate, d.dayNumber)}
                  className="w-full flex items-center gap-3 px-5 py-3 text-left hover:bg-gray-50 border-b border-gray-50 last:border-b-0"
                >
                  <Replace className="w-4 h-4 text-indigo-500 flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-gray-900">
                      {locale === "ko" ? `Day ${d.dayNumber} 덮어쓰기` : `Overwrite Day ${d.dayNumber}`}
                    </p>
                    <p className="text-xs text-gray-400 truncate mt-0.5">{d.course.title[locale]}</p>
                  </div>
                </button>
              ))}
            </div>

            {/* Add-new footer (sticky) */}
            <button
              type="button"
              onClick={() => handleSelect(activeTemplate, "new")}
              className="w-full flex items-center gap-3 px-5 py-4 bg-indigo-50 hover:bg-indigo-100 border-t border-indigo-100 transition-colors"
            >
              <Plus className="w-4 h-4 text-indigo-600 flex-shrink-0" />
              <div className="min-w-0 flex-1 text-left">
                <p className="text-sm font-semibold text-indigo-700">
                  {locale === "ko" ? "새 Day로 추가" : "Add as a new day"}
                </p>
                <p className="text-xs text-indigo-500/80 mt-0.5">
                  {locale === "ko" ? "일정 마지막에 하루 추가 (기간 +1일)" : "Appends one extra day (+1 night)"}
                </p>
              </div>
            </button>
          </div>
        </div>,
        document.body,
      )}
    </>
  );
}
