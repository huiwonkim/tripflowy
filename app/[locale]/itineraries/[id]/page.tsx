"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
import { ArrowLeft, Save, Trash2, Share2, Check } from "lucide-react";
import type { GeneratedItinerary, Locale } from "@/types";
import {
  getStoredItinerary,
  updateStoredItinerary,
  removeStoredItinerary,
  buildUrlForStored,
  type StoredItinerary,
} from "@/lib/itinerary-storage";
import { decodeItinerary } from "@/lib/itinerary-encoding";
import { buildItineraryFromSpotIds } from "@/lib/spot-builder";
import { DayPlanSection } from "@/components/itinerary/DayPlanSection";
import { countries } from "@/data/destinations";

export default function SavedItineraryPage() {
  const params = useParams<{ id: string }>();
  const id = params?.id;
  const locale = useLocale() as Locale;
  const [record, setRecord] = useState<StoredItinerary | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!id) return;
    const r = getStoredItinerary(id);
    if (!r) setNotFound(true);
    else setRecord(r);
  }, [id]);

  // Rebuild the full itinerary from the encoded payload so DayPlanSection
  // has access to coordinates / descriptions / tips for every activity.
  const itinerary: GeneratedItinerary | null = useMemo(() => {
    if (!record) return null;
    const payload = decodeItinerary(record.encoded);
    if (!payload) return null;
    const accommodations: Record<string, { lat: number; lng: number }> = {};
    if (payload.ac) {
      for (const [city, coords] of Object.entries(payload.ac)) {
        accommodations[city] = { lat: coords[0], lng: coords[1] };
      }
    }
    return buildItineraryFromSpotIds({
      spotsPerDay: payload.sp,
      cityPerDay: payload.cp,
      styles: payload.st,
      travelerType: payload.t,
      accommodations: Object.keys(accommodations).length > 0 ? accommodations : undefined,
      pace: payload.p,
    });
  }, [record]);

  // Apply customOrder + customTimes overlays. Order is applied first so
  // indices line up with customTimes. Activities without a spotId (meals,
  // airport transport) stay in their original relative position after the
  // ordered spotId activities.
  const displayedDays = useMemo(() => {
    if (!itinerary) return [];
    const customTimes = record?.customTimes ?? {};
    const customOrder = record?.customOrder ?? {};
    return itinerary.days.map((d) => {
      let activities = d.course.activities;
      const order = customOrder[d.dayNumber];
      if (order) {
        const bySpot = new Map(
          activities
            .filter((a) => a.spotId)
            .map((a) => [a.spotId as string, a] as const),
        );
        const orderedWithSpot = order.map((id) => bySpot.get(id)).filter((a): a is typeof activities[number] => Boolean(a));
        const extras = activities.filter((a) => !a.spotId || !order.includes(a.spotId));
        activities = [...orderedWithSpot, ...extras];
      }
      const times = customTimes[d.dayNumber];
      if (times) {
        activities = activities.map((a, i) => (times[i] ? { ...a, time: times[i] } : a));
      }
      return { ...d, course: { ...d.course, activities } };
    });
  }, [itinerary, record]);

  function updateTime(dayNumber: number, activityIndex: number, newTime: string) {
    if (!record) return;
    const nextTimes = { ...(record.customTimes ?? {}) };
    const dayActivities = displayedDays.find((d) => d.dayNumber === dayNumber)?.course.activities ?? [];
    const existing = nextTimes[dayNumber] ?? dayActivities.map((a) => a.time);
    const arr = [...existing];
    arr[activityIndex] = newTime;
    nextTimes[dayNumber] = arr;
    const updated = updateStoredItinerary(record.id, { customTimes: nextTimes });
    if (updated) setRecord(updated);
  }

  function reorderDay(dayNumber: number, reordered: GeneratedItinerary["days"][number]["course"]["activities"]) {
    if (!record) return;
    // Save each activity's current time in the new order — drag reorders
    // position but times stay as the user set them (no auto-reshedule).
    const nextTimes = { ...(record.customTimes ?? {}) };
    nextTimes[dayNumber] = reordered.map((a) => a.time);
    // Also persist the new spot-id order so the itinerary re-renders with
    // the reordered list on reload. customTimes stores times, but we need
    // the order too — fold it into the encoded payload.
    const nextOrder = { ...(record.customOrder ?? {}) };
    nextOrder[dayNumber] = reordered.map((a) => a.spotId ?? "").filter(Boolean);
    const updated = updateStoredItinerary(record.id, {
      customTimes: nextTimes,
      customOrder: nextOrder,
    });
    if (updated) setRecord(updated);
  }

  function resetTimes() {
    if (!record) return;
    const updated = updateStoredItinerary(record.id, {
      customTimes: undefined,
      customOrder: undefined,
    });
    if (updated) setRecord(updated);
  }

  function handleDelete() {
    if (!record) return;
    const confirmMsg = locale === "ko"
      ? "이 일정을 삭제하시겠습니까?"
      : "Delete this itinerary?";
    if (!window.confirm(confirmMsg)) return;
    removeStoredItinerary(record.id);
    window.location.href = locale === "ko" ? "/ko/planner" : "/planner";
  }

  function handleShare() {
    if (!record) return;
    navigator.clipboard.writeText(buildUrlForStored(record));
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  }

  if (notFound) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-20 text-center">
        <h1 className="text-xl font-bold text-gray-900 mb-3">
          {locale === "ko" ? "저장된 일정을 찾을 수 없어요" : "Itinerary not found"}
        </h1>
        <p className="text-sm text-gray-500 mb-6">
          {locale === "ko"
            ? "이 브라우저의 저장소에 해당 일정이 없습니다. 다른 기기에서 저장한 일정은 여기서 볼 수 없어요."
            : "This browser's storage has no record with that id. Saved itineraries aren't synced across devices."}
        </p>
        <Link href="/planner" className="inline-flex items-center gap-1.5 text-blue-600 hover:text-blue-700 text-sm font-medium">
          <ArrowLeft className="w-4 h-4" />
          {locale === "ko" ? "플래너로" : "Back to planner"}
        </Link>
      </div>
    );
  }

  if (!record || !itinerary) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-20 text-center text-sm text-gray-400">
        {locale === "ko" ? "불러오는 중..." : "Loading..."}
      </div>
    );
  }

  const allCities = countries.flatMap((c) => c.cities);
  const hasCustom =
    Boolean(record.customTimes && Object.keys(record.customTimes).length > 0) ||
    Boolean(record.customOrder && Object.keys(record.customOrder).length > 0);

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
      <Link
        href="/planner"
        className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 mb-4"
      >
        <ArrowLeft className="w-4 h-4" />
        {locale === "ko" ? "플래너로" : "Back to planner"}
      </Link>

      <div className="mb-6 flex items-start justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{record.name}</h1>
          <p className="text-sm text-gray-500 mt-1">
            {record.preview.destinations.join(" + ")} · {record.preview.nights}
            {locale === "ko" ? `박 ${record.preview.dayCount}일` : ` nights, ${record.preview.dayCount} days`}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleShare}
            className="inline-flex items-center gap-1.5 text-sm bg-white border border-gray-200 hover:border-gray-300 text-gray-700 px-3 py-2 rounded-lg transition-colors"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Share2 className="w-4 h-4" />}
            {copied
              ? (locale === "ko" ? "복사됨" : "Copied")
              : (locale === "ko" ? "링크 복사" : "Copy link")}
          </button>
          <button
            type="button"
            onClick={handleDelete}
            className="inline-flex items-center gap-1.5 text-sm bg-white border border-gray-200 hover:border-rose-300 hover:text-rose-600 text-gray-700 px-3 py-2 rounded-lg transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            {locale === "ko" ? "삭제" : "Delete"}
          </button>
        </div>
      </div>

      <div className="mb-4 bg-blue-50 border border-blue-100 rounded-xl px-4 py-3 flex items-start gap-2 flex-wrap">
        <Save className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-blue-900">
            {locale === "ko" ? "내 일정으로 자유롭게 수정하세요" : "Customize freely — this is your plan"}
          </p>
          <p className="text-xs text-blue-700 mt-0.5">
            {locale === "ko"
              ? "시간 뱃지를 눌러 시간 변경, 드래그로 순서 변경. 운영시간·소요시간 체크는 하지 않고 원하는 대로 저장됩니다."
              : "Click a time badge to edit, drag to reorder. Open hours and dwell aren't enforced — your plan wins."}
          </p>
        </div>
        {hasCustom && (
          <button
            type="button"
            onClick={resetTimes}
            className="text-xs text-blue-700 hover:text-blue-900 font-medium underline underline-offset-2"
          >
            {locale === "ko" ? "원래 순서·시간으로" : "Reset edits"}
          </button>
        )}
      </div>

      <div className="flex flex-col gap-6">
        {displayedDays.map((day) => {
          const cityLabel = allCities.find((c) => c.id === day.city)?.label[locale] ?? day.city;
          return (
            <DayPlanSection
              key={day.dayNumber}
              day={{
                day: day.dayNumber,
                title: day.course.title,
                subtitle: { en: cityLabel, ko: cityLabel },
                summary: day.course.summary,
                activities: day.course.activities,
                whyThisCourse: day.course.whyThisCourse,
                courseType: day.course.courseType,
                costs: day.course.costs,
                googleMapsUrl: day.course.googleMapsUrl,
              }}
              locale={locale}
              onReorder={(acts) => reorderDay(day.dayNumber, acts)}
              onTimeChange={(i, t) => updateTime(day.dayNumber, i, t)}
            />
          );
        })}
      </div>
    </div>
  );
}
