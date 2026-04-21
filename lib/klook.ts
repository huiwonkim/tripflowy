import type { Locale } from "@/types";

/**
 * Toggle a Klook activity URL between the default (English) and Korean
 * site based on locale. Klook uses `/ko/` for the Korean version.
 *
 * We store URLs without `/ko/` in data files (per the project rule in
 * CLAUDE.md) and insert `/ko/` only when rendering for Korean locale.
 *
 * Idempotent — safe to call on URLs that already have or lack `/ko/`.
 */
export function localizeKlookUrl(url: string, locale: Locale): string {
  if (!url.includes("klook.com")) return url;
  if (locale === "ko") {
    if (url.includes("klook.com/ko/")) return url;
    return url.replace("klook.com/activity/", "klook.com/ko/activity/");
  }
  // locale === "en" — strip /ko/ if present
  return url.replace("klook.com/ko/activity/", "klook.com/activity/");
}
