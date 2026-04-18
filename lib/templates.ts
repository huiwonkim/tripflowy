/**
 * Helpers for applying day templates to the planner.
 *
 * A `DayTemplate` is a named spot-id sequence (e.g. "Tokyo Shibuya + Harajuku day").
 * `data/templates.ts` is generated from the legacy DayCourses by
 * `scripts/extract-spots-from-courses.ts` — they live alongside user-sourced
 * spreadsheet content and disappear cleanly once replaced.
 */
import type { DayTemplate } from "@/types/spot";
import type { PlannerInput } from "@/types";
import { getTemplatesByCity, dayTemplates } from "@/data/templates";

/** Public re-export so UI code doesn't reach into data/ directly. */
export { dayTemplates, getTemplatesByCity };

/**
 * Score templates against the user's current planner input. Used to rank
 * "recommended" cards — higher is better.
 */
function scoreTemplate(t: DayTemplate, input: PlannerInput): number {
  let s = 0;
  if (input.styles && input.styles.length > 0) {
    const overlap = input.styles.filter((x) => t.styles.includes(x)).length;
    s += overlap * 2;
  }
  if (input.travelerType && t.travelerTypes.includes(input.travelerType as never)) s += 2;
  return s;
}

/**
 * Return templates matching the selected destinations, ranked by style/traveler fit.
 * `limit` caps the list size (default 6 for a horizontal scroll section).
 */
export function recommendTemplates(input: PlannerInput, limit = 6): DayTemplate[] {
  if (!input.destinations || input.destinations.length === 0) return [];
  const pool = input.destinations.flatMap((city) => getTemplatesByCity(city));
  return pool
    .map((t) => ({ t, s: scoreTemplate(t, input) }))
    .sort((a, b) => b.s - a.s)
    .slice(0, limit)
    .map((x) => x.t);
}
