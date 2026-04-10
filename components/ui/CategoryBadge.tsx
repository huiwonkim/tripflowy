import { getCategoryById, type CategoryId } from "@/data/categories";
import type { Locale } from "@/types";

const colorMap: Record<string, { bg: string; text: string }> = {
  rose:   { bg: "bg-rose-50",   text: "text-rose-700" },
  blue:   { bg: "bg-blue-50",   text: "text-blue-700" },
  pink:   { bg: "bg-pink-50",   text: "text-pink-700" },
  green:  { bg: "bg-emerald-50", text: "text-emerald-700" },
  amber:  { bg: "bg-amber-50",  text: "text-amber-700" },
  indigo: { bg: "bg-indigo-50", text: "text-indigo-700" },
  violet: { bg: "bg-violet-50", text: "text-violet-700" },
  teal:   { bg: "bg-teal-50",   text: "text-teal-700" },
  orange: { bg: "bg-orange-50", text: "text-orange-700" },
  slate:  { bg: "bg-slate-100", text: "text-slate-700" },
  cyan:   { bg: "bg-cyan-50",   text: "text-cyan-700" },
};

interface CategoryBadgeProps {
  id: CategoryId;
  locale: Locale;
  className?: string;
}

export function CategoryBadge({ id, locale, className }: CategoryBadgeProps) {
  const cat = getCategoryById(id);
  if (!cat) return null;

  const colors = colorMap[cat.color] ?? colorMap.slate;

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colors.bg} ${colors.text} ${className ?? ""}`}
    >
      {cat.label[locale]}
    </span>
  );
}
