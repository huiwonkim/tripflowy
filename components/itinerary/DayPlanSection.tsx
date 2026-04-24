"use client";

import Image from "next/image";
import { useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
import { useMemo, useState } from "react";
import { Lightbulb, ExternalLink, BookOpen, Utensils, MapPin, Bus, Waves, ShoppingBag, Compass, Star, Coffee, Map, Train, Footprints, GripVertical, AlertTriangle, X, Shuffle, BadgeCheck } from "lucide-react";
import { FOUNDER } from "@/content/brand";
import type { DayActivity, ActivityType, Locale, LocaleString, DayCostBreakdown } from "@/types";
import type { Spot } from "@/types/spot";
import { cn } from "@/lib/utils";
import { localizeKlookUrl } from "@/lib/klook";
import { estimateTravel, type TravelEstimate } from "@/lib/travel-estimate";
import { getSpotById, getSpotsByCity } from "@/data/spots";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

function parseHm(s: string): number {
  const [h, m] = s.split(":").map(Number);
  return h * 60 + (m || 0);
}
function formatHm(total: number): string {
  const h = Math.floor(total / 60);
  const m = total % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

/**
 * Rewalk the activity list starting at `startTime`, computing each entry's
 * start from the previous one's start + dwell + travel. Used after a drag
 * reorder so the visible timeline stays consistent.
 */
export function rescheduleActivities(activities: DayActivity[], startTime: string): DayActivity[] {
  if (activities.length === 0) return activities;
  const out: DayActivity[] = [];
  let cursor = parseHm(startTime);
  let lastLoc: DayActivity["location"] = undefined;
  for (let i = 0; i < activities.length; i++) {
    const a = activities[i];
    if (i > 0 && lastLoc && a.location) {
      cursor += estimateTravel(lastLoc, a.location).minutes;
    }
    out.push({ ...a, time: formatHm(cursor) });
    cursor += a.duration ?? 60;
    lastLoc = a.location ?? lastLoc;
  }
  return out;
}

/**
 * Returns a warning message if the activity's scheduled time falls outside
 * the underlying spot's open hours. Null when fine or when we can't verify
 * (no spotId / no openHours data).
 */
function openHoursWarning(activity: DayActivity, locale: Locale): string | null {
  if (!activity.spotId) return null;
  const spot = getSpotById(activity.spotId);
  if (!spot?.openHours?.open || !spot.openHours.close) return null;
  const start = parseHm(activity.time);
  const end = start + (activity.duration ?? 60);
  const open = parseHm(spot.openHours.open);
  let close = parseHm(spot.openHours.close);
  if (close === 0 || close < open) close = 24 * 60; // past-midnight close
  if (start < open) {
    return locale === "ko"
      ? `${spot.openHours.open}부터 영업 — 조금 기다려야 합니다`
      : `Opens at ${spot.openHours.open}`;
  }
  if (end > close) {
    return locale === "ko"
      ? `${spot.openHours.close}에 마감 — 이 시간엔 방문 어려움`
      : `Closes at ${spot.openHours.close}`;
  }
  return null;
}

function TravelLabel({ travel, locale }: { travel: TravelEstimate; locale: Locale }) {
  const Icon = travel.mode === "walking" ? Footprints : Train;
  const label = locale === "ko" ? `${travel.minutes}분 이동` : `${travel.minutes} min`;
  return (
    <div className="flex items-center gap-2 pl-12 py-1.5 text-xs text-gray-400">
      <div className="w-0.5 h-4 bg-gray-200" />
      <Icon className="w-3.5 h-3.5" />
      <span>{label}</span>
    </div>
  );
}

// ── Icons & Colors ──────────────────────────────────

const activityIcons: Record<ActivityType, React.FC<{ className?: string }>> = {
  transport: Bus, sightseeing: MapPin, dining: Utensils,
  accommodation: Star, tour: Compass, free: Coffee,
  beach: Waves, shopping: ShoppingBag,
};

const activityColors: Record<ActivityType, string> = {
  transport: "bg-gray-100 text-gray-500",
  sightseeing: "bg-blue-100 text-blue-600",
  dining: "bg-orange-100 text-orange-600",
  accommodation: "bg-purple-100 text-purple-600",
  tour: "bg-green-100 text-green-600",
  free: "bg-yellow-100 text-yellow-600",
  beach: "bg-cyan-100 text-cyan-600",
  shopping: "bg-pink-100 text-pink-600",
};

// ── Sortable wrapper ────────────────────────────────

/**
 * Sortable wrapper used when editing is enabled. Provides the drag handle
 * and the dnd-kit transform styles. Read-only renders use plain ActivityItem.
 */
function SortableActivityItem({
  id,
  activity,
  locale,
  index,
  onRemove,
  onReplaceOpen,
  isReplaceOpen,
  canReorder,
  canRemove,
  canReplace,
  onTimeChange,
  suppressWarnings,
}: {
  id: string;
  activity: DayActivity;
  locale: Locale;
  index: number;
  onRemove?: () => void;
  onReplaceOpen?: () => void;
  isReplaceOpen?: boolean;
  canReorder: boolean;
  canRemove: boolean;
  canReplace: boolean;
  onTimeChange?: (newTime: string) => void;
  suppressWarnings?: boolean;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };
  return (
    <div ref={setNodeRef} style={style} className="group flex items-start gap-1 pr-1">
      <div className="flex-1 min-w-0">
        <ActivityItem
          activity={activity}
          locale={locale}
          index={index}
          onTimeChange={onTimeChange}
          suppressWarnings={suppressWarnings}
        />
      </div>
      <div className="flex flex-col gap-0.5 opacity-50 group-hover:opacity-100 transition-opacity mt-3 flex-shrink-0">
        {canReorder && (
          <button
            type="button"
            aria-label={locale === "ko" ? "드래그해서 순서 변경" : "Drag to reorder"}
            className="p-1.5 rounded-lg text-gray-300 hover:text-gray-600 hover:bg-gray-100 cursor-grab active:cursor-grabbing touch-none"
            {...attributes}
            {...listeners}
          >
            <GripVertical className="w-4 h-4" />
          </button>
        )}
        {canReplace && (
          <button
            type="button"
            aria-label={locale === "ko" ? "다른 스팟으로 교체" : "Swap with another spot"}
            aria-pressed={isReplaceOpen}
            className={cn(
              "p-1.5 rounded-lg hover:bg-gray-100 transition-colors",
              isReplaceOpen ? "text-blue-600 bg-blue-50" : "text-gray-300 hover:text-gray-600",
            )}
            onClick={onReplaceOpen}
          >
            <Shuffle className="w-4 h-4" />
          </button>
        )}
        {canRemove && (
          <button
            type="button"
            aria-label={locale === "ko" ? "이 스팟 제거" : "Remove this spot"}
            className="p-1.5 rounded-lg text-gray-300 hover:text-rose-600 hover:bg-rose-50 transition-colors"
            onClick={onRemove}
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}

function ReplacePicker({
  current,
  cityId,
  usedSpotIds,
  locale,
  onPick,
  onClose,
}: {
  current: DayActivity;
  cityId: string;
  usedSpotIds: Set<string>;
  locale: Locale;
  onPick: (spot: Spot) => void;
  onClose: () => void;
}) {
  const currentSpot = current.spotId ? getSpotById(current.spotId) : undefined;
  const targetArea = currentSpot?.area;
  const targetCategory = currentSpot?.category;

  const pool = getSpotsByCity(cityId).filter((s) => {
    if (usedSpotIds.has(s.id)) return false;
    if (current.spotId && s.id === current.spotId) return false;
    // Prefer same area first; we'll fall back to other areas if we don't hit 3.
    return true;
  });

  // Score: same area > same category > priority (1 best). Fix the top-10
  // pool once per mount, then random-sample 3 — reopening the picker
  // remounts this component so each open surfaces different candidates.
  const candidates = useMemo(() => {
    const scored = pool.map((s) => {
      let score = 0;
      if (targetArea && s.area === targetArea) score += 10;
      if (targetCategory && s.category === targetCategory) score += 5;
      score += 5 - s.priority;
      return { spot: s, score };
    });
    scored.sort((a, b) => b.score - a.score);
    const topPool = scored.slice(0, 10).map((x) => x.spot);
    const shuffled = [...topPool];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled.slice(0, 3);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="ml-12 mb-4 border border-gray-200 rounded-xl bg-gray-50 p-3">
      <div className="flex items-center justify-between mb-2">
        <p className="text-xs font-semibold text-gray-700">
          {locale === "ko" ? "바꿔 넣을 스팟 고르기" : "Pick a replacement"}
        </p>
        <button
          type="button"
          onClick={onClose}
          className="p-1 rounded text-gray-400 hover:text-gray-700 hover:bg-gray-200"
          aria-label={locale === "ko" ? "닫기" : "Close"}
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
      {candidates.length === 0 ? (
        <p className="text-xs text-gray-500 py-2">
          {locale === "ko" ? "추천할 만한 미사용 스팟이 없습니다." : "No unused alternatives."}
        </p>
      ) : (
        <div className="flex flex-col gap-1.5">
          {candidates.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => onPick(s)}
              className="text-left bg-white border border-gray-200 hover:border-blue-400 hover:bg-blue-50 rounded-lg px-3 py-2 transition-colors"
            >
              <div className="text-sm font-semibold text-gray-900">{s.name[locale]}</div>
              <div className="text-xs text-gray-500 mt-0.5 line-clamp-2">{s.description[locale]}</div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Activity Item ───────────────────────────────────

function ActivityItem({
  activity,
  locale,
  index,
  onTimeChange,
  suppressWarnings,
}: {
  activity: DayActivity;
  locale: Locale;
  index: number;
  onTimeChange?: (newTime: string) => void;
  suppressWarnings?: boolean;
}) {
  const Icon = activityIcons[activity.type] ?? MapPin;
  const colorClass = activityColors[activity.type] ?? "bg-gray-100 text-gray-500";
  const hoursWarning = !suppressWarnings ? openHoursWarning(activity, locale) : null;

  return (
    <div className="flex gap-4">
      {/* Number + line */}
      <div className="flex flex-col items-center">
        <div className={cn("w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold ring-4 ring-white", colorClass)}>
          {index}
        </div>
        <div className="w-0.5 flex-1 bg-gray-200 mt-1" />
      </div>

      {/* Content */}
      <div className="pb-6 flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1 flex-wrap">
          {onTimeChange ? (
            <label
              className={cn(
                "inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-md cursor-text",
                hoursWarning ? "bg-rose-50 text-rose-700" : "bg-gray-100 text-gray-700 hover:bg-gray-200",
              )}
            >
              <Icon className="w-3 h-3" />
              <input
                type="time"
                value={activity.time.slice(0, 5)}
                onChange={(e) => onTimeChange(e.target.value)}
                className="bg-transparent outline-none font-semibold tabular-nums w-[4.5rem]"
                aria-label={locale === "ko" ? "시간 수정" : "Edit time"}
              />
            </label>
          ) : (
            <span className={cn(
              "inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-md",
              hoursWarning ? "bg-rose-50 text-rose-700" : "bg-gray-100 text-gray-700",
            )}>
              <Icon className="w-3 h-3" />
              {activity.time}
            </span>
          )}
          <h4 className="text-base font-semibold text-gray-900 leading-snug">{activity.title[locale]}</h4>
        </div>
        {hoursWarning && (
          <div className="mt-1 mb-2 flex items-start gap-1.5 text-xs text-rose-700 bg-rose-50 border border-rose-200 rounded-lg px-2.5 py-1.5 max-w-lg">
            <AlertTriangle className="w-3.5 h-3.5 mt-0.5 flex-shrink-0 text-rose-500" />
            <span>{hoursWarning}</span>
          </div>
        )}
        <p className="text-sm text-gray-500 leading-relaxed">{activity.description[locale]}</p>

        {/* Tips */}
        {activity.tips && activity.tips.length > 0 && (
          <div className="mt-2 space-y-1">
            {activity.tips.map((tip, i) => (
              <div key={i} className="flex items-start gap-1.5 text-xs text-amber-700 bg-amber-50 rounded-lg px-3 py-1.5 max-w-lg">
                <Lightbulb className="w-3.5 h-3.5 mt-0.5 flex-shrink-0 text-amber-500" />
                <span>{tip[locale]}</span>
              </div>
            ))}
          </div>
        )}

        {/* Photos — shows a carousel when multiple, single image otherwise */}
        {(() => {
          const photos = activity.photos && activity.photos.length > 0
            ? activity.photos
            : activity.photo ? [activity.photo] : [];
          if (photos.length === 0) return null;
          if (photos.length === 1) {
            return (
              <div className="mt-3 rounded-xl overflow-hidden border border-gray-100">
                <Image src={photos[0]} alt={activity.title[locale]} width={600} height={340} className="w-full h-auto object-cover" />
              </div>
            );
          }
          return (
            <div className="mt-3 -mx-4 sm:mx-0 overflow-x-auto">
              <div className="flex gap-2 px-4 sm:px-0 snap-x snap-mandatory">
                {photos.map((src, i) => (
                  <div key={i} className="flex-shrink-0 w-[80%] sm:w-[60%] rounded-xl overflow-hidden border border-gray-100 snap-start">
                    <Image src={src} alt={`${activity.title[locale]} ${i + 1}`} width={600} height={340} className="w-full h-auto object-cover" />
                  </div>
                ))}
              </div>
            </div>
          );
        })()}

        {/* Buttons: booking links + guide post */}
        {(activity.bookingLinks || activity.postSlug) && (
          <div className="flex flex-wrap gap-2 mt-3">
            {activity.bookingLinks?.klook && (
              <a href={localizeKlookUrl(activity.bookingLinks.klook, locale)} target="_blank" rel="noopener noreferrer sponsored"
                className="inline-flex items-center gap-1.5 bg-orange-50 hover:bg-orange-100 text-orange-700 text-xs font-medium px-3 py-1.5 rounded-lg transition-colors">
                <ExternalLink className="w-3 h-3" />
                {locale === "ko" ? "티켓 예약" : "Book Ticket"}
              </a>
            )}
            {activity.bookingLinks?.agoda && (
              <a href={activity.bookingLinks.agoda} target="_blank" rel="noopener noreferrer sponsored"
                className="inline-flex items-center gap-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-medium px-3 py-1.5 rounded-lg transition-colors">
                <ExternalLink className="w-3 h-3" />
                {locale === "ko" ? "숙소 예약" : "Book Hotel"}
              </a>
            )}
            {activity.bookingLinks?.mrt && (
              <a href={activity.bookingLinks.mrt} target="_blank" rel="noopener noreferrer sponsored"
                className="inline-flex items-center gap-1.5 bg-green-50 hover:bg-green-100 text-green-700 text-xs font-medium px-3 py-1.5 rounded-lg transition-colors">
                <ExternalLink className="w-3 h-3" />
                {locale === "ko" ? "투어 예약" : "Book Tour"}
              </a>
            )}
            {activity.postSlug && (
              <a href={`/${locale === "ko" ? "ko/" : ""}posts/${activity.postSlug}`} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 bg-violet-50 hover:bg-violet-100 text-violet-700 text-xs font-medium px-3 py-1.5 rounded-lg transition-colors">
                <BookOpen className="w-3 h-3" />
                {locale === "ko" ? "꿀팁 자세히 보기" : "Read Full Guide"}
              </a>
            )}
          </div>
        )}

        {/* Verification badge — "Check Kim · verified YYYY-MM" / "책킴 · 정보 확인 YYYY-MM".
            E-E-A-T signal on the decision surface. Quietly omitted when the
            spot lacks a lastVerified date (engine data only, not legacy courses). */}
        {activity.lastVerified && (
          <p className="mt-3 flex items-center gap-1.5 text-xs text-gray-500">
            <BadgeCheck className="w-3.5 h-3.5 text-blue-500 flex-shrink-0" />
            <span>{formatVerification(activity.lastVerified, locale)}</span>
          </p>
        )}
      </div>
    </div>
  );
}

/** Format "2026-04-24" → "책킴 · 정보 확인 2026-04" (ko) / "Check Kim · verified Apr 2026" (en). */
function formatVerification(iso: string, locale: Locale): string {
  const m = iso.match(/^(\d{4})-(\d{2})/);
  if (!m) return iso;
  const year = m[1];
  const monthNum = Number(m[2]);
  if (locale === "ko") {
    return `✓ ${FOUNDER.nameKo} · 정보 확인 ${year}-${m[2]}`;
  }
  const EN_MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const mon = EN_MONTHS[monthNum - 1] ?? m[2];
  return `✓ ${FOUNDER.nameEn} · verified ${mon} ${year}`;
}

// ── Day Plan Section ────────────────────────────────

type DayPlanCompat = {
  day: number;
  title: LocaleString;
  subtitle?: LocaleString;
  summary?: LocaleString;
  activities: DayActivity[];
  whyThisCourse?: LocaleString[];
  courseType?: LocaleString[];
  costs?: DayCostBreakdown;
  googleMapsUrl?: string;
};

interface DayPlanSectionProps {
  day: DayPlanCompat;
  locale: Locale;
  defaultOpen?: boolean;
  /**
   * When provided, activities can be reordered via drag-and-drop. Receives
   * the new order as-is — any time rescheduling is the parent's choice.
   */
  onReorder?: (activities: DayActivity[]) => void;
  /** Remove an activity from the day at the given index. */
  onRemove?: (index: number) => void;
  /** Replace the activity at `index` with a different spot. */
  onReplace?: (index: number, newSpot: Spot) => void;
  /** City id for replace-candidate lookup (e.g. "tokyo"). */
  cityId?: string;
  /** Spot ids already used across the whole itinerary — excluded from suggestions. */
  usedSpotIds?: Set<string>;
  /**
   * Edit a single activity's start time manually. When provided the time
   * badge becomes an inline `<input type="time">`. Also suppresses the
   * open-hours warning — the user controls their plan without engine
   * second-guessing.
   */
  onTimeChange?: (index: number, newTime: string) => void;
}

export function DayPlanSection({
  day,
  locale,
  onReorder,
  onRemove,
  onReplace,
  cityId,
  usedSpotIds,
  onTimeChange,
}: DayPlanSectionProps) {
  const [replaceOpenIdx, setReplaceOpenIdx] = useState<number | null>(null);
  const editable = Boolean(onReorder || onRemove || onReplace || onTimeChange);
  const suppressWarnings = Boolean(onTimeChange);
  // Pre-compute haversine-based travel estimates between consecutive
  // activities. Pure math — no network, no cost.
  const travelTimes: (TravelEstimate | null)[] = day.activities.map((_, i) => {
    if (i >= day.activities.length - 1) return null;
    const a = day.activities[i];
    const b = day.activities[i + 1];
    if (!a.location || !b.location) return null;
    return estimateTravel(a.location, b.location);
  });

  // Stable ids for dnd-kit. Prefer spotId when available; fall back to the
  // activity's title + time hash so meals / injected transport rows also
  // get a unique key.
  const activityIds = day.activities.map(
    (a, i) => a.spotId ?? `activity-${i}-${a.time}-${a.title.en || a.title.ko}`,
  );

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  function handleDragEnd(e: DragEndEvent) {
    if (!onReorder) return;
    const { active, over } = e;
    if (!over || active.id === over.id) return;
    const from = activityIds.indexOf(String(active.id));
    const to = activityIds.indexOf(String(over.id));
    if (from < 0 || to < 0) return;
    // Hand the raw reorder to the parent. Planner re-times it; saved-itinerary
    // edit mode leaves times alone so the user stays in control.
    onReorder(arrayMove(day.activities, from, to));
  }

  return (
    <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-card">
      {/* Day header */}
      <div className="relative bg-gradient-to-br from-blue-600 to-blue-700 text-white px-6 py-5 flex items-center gap-4">
        <span
          aria-hidden
          className="pointer-events-none absolute -right-6 -bottom-8 text-[7rem] font-black leading-none tracking-tight text-white/10 select-none"
        >
          {day.day}
        </span>
        <div className="relative w-12 h-12 bg-white/15 backdrop-blur-sm rounded-xl flex flex-col items-center justify-center flex-shrink-0 ring-1 ring-white/20">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-white/70 leading-none">Day</span>
          <span className="text-white text-lg font-bold leading-none mt-0.5">{day.day}</span>
        </div>
        <div className="relative min-w-0">
          <h3 className="font-bold text-white text-lg leading-snug truncate">
            {day.title[locale]}
          </h3>
          {day.subtitle && (
            <p className="text-xs text-white/75 mt-0.5">{day.subtitle[locale]}</p>
          )}
        </div>
      </div>

      {/* Summary */}
      {day.summary && (
        <p className="px-5 mt-3 text-sm text-gray-500 leading-relaxed">{day.summary[locale]}</p>
      )}

      {/* Why this course */}
      {day.whyThisCourse && day.whyThisCourse.length > 0 && (
        <div className="mx-5 mt-4 bg-blue-50 border border-blue-100 rounded-xl px-4 py-3">
          <p className="text-xs font-semibold text-blue-700 mb-2">
            {locale === "ko" ? "이 코스를 가야 하는 이유" : "Why this course?"}
          </p>
          <ul className="space-y-1">
            {day.whyThisCourse.map((point, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-blue-600 leading-relaxed">
                <span className="text-blue-400 mt-0.5">•</span>
                <span>{point[locale]}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Course type tags */}
      {day.courseType && day.courseType.length > 0 && (
        <div className="flex flex-wrap gap-1.5 px-5 mt-3">
          {day.courseType.map((tag, i) => (
            <span key={i} className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
              {tag[locale]}
            </span>
          ))}
        </div>
      )}

      {/* Activities timeline */}
      <div className="px-5 pt-5">
        {editable ? (
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={activityIds} strategy={verticalListSortingStrategy}>
              {day.activities.map((activity, i) => (
                <div key={activityIds[i]}>
                  <SortableActivityItem
                    id={activityIds[i]}
                    activity={activity}
                    locale={locale}
                    index={i + 1}
                    canReorder={Boolean(onReorder)}
                    canRemove={Boolean(onRemove)}
                    canReplace={Boolean(onReplace && cityId && activity.spotId)}
                    onRemove={onRemove ? () => onRemove(i) : undefined}
                    onReplaceOpen={
                      onReplace
                        ? () => setReplaceOpenIdx(replaceOpenIdx === i ? null : i)
                        : undefined
                    }
                    isReplaceOpen={replaceOpenIdx === i}
                    onTimeChange={onTimeChange ? (v) => onTimeChange(i, v) : undefined}
                    suppressWarnings={suppressWarnings}
                  />
                  {replaceOpenIdx === i && onReplace && cityId && (
                    <ReplacePicker
                      current={activity}
                      cityId={cityId}
                      usedSpotIds={usedSpotIds ?? new Set()}
                      locale={locale}
                      onPick={(spot) => {
                        onReplace(i, spot);
                        setReplaceOpenIdx(null);
                      }}
                      onClose={() => setReplaceOpenIdx(null)}
                    />
                  )}
                  {i < day.activities.length - 1 && travelTimes[i] && (
                    <TravelLabel travel={travelTimes[i]!} locale={locale} />
                  )}
                </div>
              ))}
            </SortableContext>
          </DndContext>
        ) : (
          day.activities.map((activity, i) => (
            <div key={activityIds[i]}>
              <ActivityItem activity={activity} locale={locale} index={i + 1} />
              {i < day.activities.length - 1 && travelTimes[i] && (
                <TravelLabel travel={travelTimes[i]!} locale={locale} />
              )}
            </div>
          ))
        )}
      </div>

      {/* Google Maps button */}
      {day.googleMapsUrl && (
        <div className="px-5 mb-4">
          <a href={day.googleMapsUrl} target="_blank" rel="noopener noreferrer"
            className="w-full flex items-center justify-center gap-2 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 text-sm font-medium py-2.5 px-4 rounded-xl transition-colors">
            <Map className="w-4 h-4 text-blue-500" />
            {locale === "ko" ? "구글 지도에서 보기" : "Open in Google Maps"}
          </a>
        </div>
      )}

      {/* Per-day cost breakdown intentionally removed — budget is now summarized
          once at the trip level in BudgetSection. */}
    </div>
  );
}
