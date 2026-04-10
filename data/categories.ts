import type { LocaleString } from "@/types";

export type CategoryId =
  | "food"
  | "sightseeing"
  | "shopping"
  | "activity"
  | "cafe"
  | "nightview"
  | "complete-guide"
  | "review"
  | "tips"
  | "comparison"
  | "booking";

export type CategoryDef = {
  id: CategoryId;
  label: LocaleString;
  color: string;
};

export const categories: CategoryDef[] = [
  { id: "food",           label: { en: "Food",           ko: "맛집" },       color: "rose" },
  { id: "sightseeing",    label: { en: "Sightseeing",    ko: "관광" },       color: "blue" },
  { id: "shopping",       label: { en: "Shopping",       ko: "쇼핑" },       color: "pink" },
  { id: "activity",       label: { en: "Activity",       ko: "액티비티" },   color: "green" },
  { id: "cafe",           label: { en: "Cafe",           ko: "카페" },       color: "amber" },
  { id: "nightview",      label: { en: "Night View",     ko: "야경" },       color: "indigo" },
  { id: "complete-guide", label: { en: "Complete Guide", ko: "완벽 가이드" }, color: "violet" },
  { id: "review",         label: { en: "Review",         ko: "후기" },       color: "teal" },
  { id: "tips",           label: { en: "Tips",           ko: "꿀팁" },       color: "orange" },
  { id: "comparison",     label: { en: "Comparison",     ko: "비교" },       color: "slate" },
  { id: "booking",        label: { en: "Booking Guide",  ko: "예약 안내" },  color: "cyan" },
];

export function getCategoryById(id: CategoryId): CategoryDef | undefined {
  return categories.find((c) => c.id === id);
}
