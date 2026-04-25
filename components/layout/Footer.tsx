import { getLocale, getTranslations } from "next-intl/server";
import { Mail } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { countries } from "@/data/destinations";
import { AFFILIATE_DISCLOSURE, BRAND, FOUNDER } from "@/content/brand";
import type { Locale } from "@/types";

type ProfileLink = { href: string; label: string };

const PROFILE_LABELS: Record<string, string> = {
  instagram: "Instagram",
  naverBlog: "Naver Blog",
  youtube: "YouTube",
  linkedin: "LinkedIn",
  crunchbase: "Crunchbase",
  wikidata: "Wikidata (Check Kim)",
  wikidataOrg: "Wikidata (TripFlowy)",
  alternativeto: "AlternativeTo",
  g2: "G2",
  producthunt: "Product Hunt",
};

function collectLiveProfiles(): ProfileLink[] {
  const seen = new Set<string>();
  const out: ProfileLink[] = [];
  const sources: Array<Record<string, string>> = [FOUNDER.profiles, BRAND.profiles];
  for (const source of sources) {
    for (const [key, href] of Object.entries(source)) {
      if (href.includes("[TODO]") || seen.has(href)) continue;
      seen.add(href);
      out.push({ href, label: PROFILE_LABELS[key] ?? key });
    }
  }
  return out;
}

export async function Footer() {
  const t = await getTranslations("footer");
  const tNav = await getTranslations("nav");
  const locale = (await getLocale()) as Locale;

  const cities = countries.flatMap((c) => c.cities);
  const profiles = collectLiveProfiles();
  const findUsLabel = locale === "ko" ? "다른 채널에서 만나요" : "Find us on";

  // Courses intentionally excluded — the day-course catalog is proprietary
  // content we don't want browsable or indexed.
  const navLinks = [
    { href: "/planner" as const, label: tNav("planner") },
    { href: "/posts" as const, label: tNav("guides") },
    { href: "/tours" as const, label: tNav("tours") },
    { href: "/hotels" as const, label: tNav("hotels") },
  ];

  return (
    <footer className="bg-gray-900 text-gray-400 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        {/* Brand + destinations */}
        <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-10 md:gap-16">
          <div>
            <Link href="/" className="flex items-center mb-4">
              <span className="text-white font-bold text-xl tracking-tight">{BRAND.name}</span>
            </Link>
            <p className="text-sm leading-relaxed mb-4">{t("tagline")}</p>
            <a
              href="mailto:hello@tripflowy.com"
              className="inline-flex items-center gap-1.5 text-sm text-gray-300 hover:text-white transition-colors"
            >
              <Mail className="w-4 h-4" />
              hello@tripflowy.com
            </a>
          </div>

          <div>
            <h4 className="text-white text-sm font-semibold mb-4">{t("popularDestinations")}</h4>
            <div className="flex flex-wrap gap-2">
              {cities.map((city) => (
                <Link
                  key={city.id}
                  href={`/planner?destinations=${city.id}`}
                  className="px-3 py-1.5 rounded-full text-sm bg-gray-800 hover:bg-gray-700 hover:text-white transition-colors"
                >
                  {city.label[locale]}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Nav row */}
        <nav className="mt-10 pt-8 border-t border-gray-800 flex flex-wrap gap-x-6 gap-y-3 text-sm">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className="hover:text-white transition-colors">
              {link.label}
            </Link>
          ))}
        </nav>

        {profiles.length > 0 && (
          <div className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm">
            <span className="text-gray-500 mr-1">{findUsLabel}:</span>
            {profiles.map((p) => (
              <a
                key={p.href}
                href={p.href}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition-colors after:content-['·'] after:text-gray-700 after:ml-3 last:after:content-none"
              >
                {p.label}
              </a>
            ))}
          </div>
        )}

        {/* Bottom row */}
        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-sm">
          <p>{t("copyright", { year: new Date().getFullYear() })}</p>
          <p className="text-gray-500 max-w-xl text-left">{AFFILIATE_DISCLOSURE[locale]}</p>
        </div>
      </div>
    </footer>
  );
}
