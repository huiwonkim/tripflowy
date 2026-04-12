import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import Image from "next/image";
import { ArrowRight, CheckCircle, Zap, Map, Hotel } from "lucide-react";
import { QuickPlanner } from "@/components/planner/QuickPlanner";
import { posts } from "@/data/posts";
import { countries, comingSoonCountries } from "@/data/destinations";
import { getCategoryById } from "@/data/categories";
import { generateOrganizationJsonLd, generateWebSiteJsonLd, generateHowToJsonLd, generateDestinationItemListJsonLd } from "@/lib/jsonld";
import type { Locale } from "@/types";
import type { Metadata } from "next";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const isKo = locale === "ko";
  return {
    title: isKo
      ? "TripFlowy | 트플 — 검증된 여행 일정 템플릿"
      : "TripFlowy — Verified Travel Itinerary Templates",
    description: isKo
      ? "출발 도시, 기간, 여행 스타일만 선택하면 자동으로 맞춤 여행 일정을 만들어드립니다. 직접 걸어보고 만든 하루 코스와 상세 가이드까지 — 블로그 검색 그만, Tripflowy 하나로 끝."
      : "Plan your perfect trip in seconds. Tell us your destination, duration, and style — we auto-generate day-by-day itineraries with curated courses for 30+ cities in Asia and Europe.",
    keywords: isKo
      ? "여행 일정, 여행 플래너, 여행 루트, 트플, TripFlowy, 여행 템플릿, 여행 코스"
      : "travel itinerary, trip planner, travel route, TripFlowy, itinerary template, travel planner",
    alternates: {
      canonical: isKo ? "/ko" : "/",
      languages: {
        en: "/",
        ko: "/ko",
        "x-default": "/",
      },
    },
  };
}

export default async function HomePage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();
  const loc = locale as Locale;

  const allCities = countries.flatMap((c) => c.cities);

  const organizationJsonLd = generateOrganizationJsonLd();
  const websiteJsonLd = generateWebSiteJsonLd(loc);
  const howToJsonLd = generateHowToJsonLd(loc, [
    { name: t("howItWorks.step1Title"), text: t("howItWorks.step1Desc") },
    { name: t("howItWorks.step2Title"), text: t("howItWorks.step2Desc") },
    { name: t("howItWorks.step3Title"), text: t("howItWorks.step3Desc") },
  ]);
  const destinationJsonLd = generateDestinationItemListJsonLd(
    allCities.map((city) => ({
      name: city.label[loc],
      url: `https://www.tripflowy.com${loc === "ko" ? "/ko" : ""}/planner?destinations=${city.id}`,
    })),
  );

  return (
    <div>
      {/* JSON-LD — Organization + WebSite + HowTo + Destinations */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(destinationJsonLd) }}
      />

      {/* Hero */}
      <section className="bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-16 pb-12 md:pt-24 md:pb-16">
          <div className="max-w-2xl mb-10">
            <div className="inline-flex items-center gap-2 bg-white/10 text-blue-200 text-xs font-medium px-3 py-1.5 rounded-full mb-6">
              <Zap className="w-3.5 h-3.5" />
              {t("hero.badge")}
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight tracking-tight mb-4 whitespace-pre-line">
              {t("hero.heading")}
            </h1>
            <p className="text-blue-400 text-2xl sm:text-3xl font-bold mb-4">
              {t("hero.headingHighlight")}
            </p>
            <p className="text-slate-400 text-lg leading-relaxed">
              {t("hero.subheading")}
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm border border-white/15 rounded-2xl p-5 max-w-3xl">
            <p className="text-sm font-medium text-slate-300 mb-4">
              {t("hero.findItinerary")}
            </p>
            <QuickPlanner />
          </div>

          <div className="flex flex-wrap gap-x-6 gap-y-2 mt-8 text-sm text-slate-400">
            {[t("hero.destinations"), t("hero.dayByDay"), t("hero.affiliate")].map((s) => (
              <span key={s} className="flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-blue-400 flex-shrink-0" />
                {s}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Popular guides */}
      {posts.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
          <div className="flex items-end justify-between mb-8">
            <div>
              <p className="text-sm font-medium text-blue-600 mb-1">{t("guides.label")}</p>
              <h2 className="text-2xl font-bold text-gray-900">{t("guides.heading")}</h2>
            </div>
            <Link href="/posts"
              className="flex items-center gap-1.5 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors">
              {t("guides.seeAll")} <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {posts.map((post) => {
              const cityLabel = allCities.find((c) => c.id === post.city)?.label[loc] ?? post.city;
              return (
                <Link key={post.slug} href={`/posts/${post.slug}`}
                  className="group bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-md transition-all">
                  <div className={`h-40 ${!post.coverImage ? `bg-gradient-to-br ${post.coverGradient}` : ""} relative flex items-end p-4`}>
                    {post.coverImage && (
                      <Image src={post.coverImage} alt={post.title[loc]} fill className="object-cover" />
                    )}
                    <div className="absolute inset-0 bg-black/15" />
                    <div className="relative z-10 flex items-center gap-2">
                      <span className="bg-white/20 backdrop-blur-sm text-white text-xs font-medium px-2.5 py-1 rounded-full">{cityLabel}</span>
                      {post.categories?.slice(0, 2).map((catId) => {
                        const cat = getCategoryById(catId);
                        return cat ? (
                          <span key={catId} className="bg-white/20 backdrop-blur-sm text-white text-xs font-medium px-2 py-0.5 rounded-full">{cat.label[loc]}</span>
                        ) : null;
                      })}
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="font-semibold text-gray-900 text-base leading-snug group-hover:text-blue-700 transition-colors mb-2">
                      {post.title[loc]}
                    </h3>
                    <p className="text-gray-500 text-sm leading-relaxed line-clamp-2 mb-3">{post.excerpt[loc]}</p>
                    <span className="flex items-center gap-1 text-blue-600 text-xs font-medium group-hover:gap-2 transition-all">
                      {loc === "ko" ? "자세히 보기" : "Read guide"} <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      {/* How it works */}
      <section className="bg-white border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-3">{t("howItWorks.heading")}</h2>
            <p className="text-gray-500 max-w-lg mx-auto">{t("howItWorks.subheading")}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: "01", icon: Map, title: t("howItWorks.step1Title"), desc: t("howItWorks.step1Desc") },
              { step: "02", icon: Zap, title: t("howItWorks.step2Title"), desc: t("howItWorks.step2Desc") },
              { step: "03", icon: Hotel, title: t("howItWorks.step3Title"), desc: t("howItWorks.step3Desc") },
            ].map(({ step, icon: Icon, title, desc }) => (
              <div key={step} className="flex gap-5">
                <div className="flex-shrink-0">
                  <div className="w-11 h-11 bg-blue-50 rounded-xl flex items-center justify-center">
                    <Icon className="w-5 h-5 text-blue-600" />
                  </div>
                </div>
                <div>
                  <p className="text-xs font-mono text-gray-400 mb-1">{step}</p>
                  <h3 className="font-semibold text-gray-900 mb-2">{title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Browse by destination */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <h2 className="text-2xl font-bold text-gray-900 mb-8">{t("browseByDestination")}</h2>

        {/* Active destinations */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {countries.map((c) => (
            <Link key={c.id} href={`/planner`}
              className="bg-gradient-to-br from-slate-700 to-slate-900 rounded-2xl p-5 text-white flex flex-col items-center gap-2 hover:opacity-90 transition-opacity">
              <span className="text-2xl">{c.emoji}</span>
              <span className="text-sm font-semibold">{c.label[loc]}</span>
              <span className="text-xs text-slate-400">{c.cities.length} {loc === "ko" ? "도시" : `cit${c.cities.length === 1 ? "y" : "ies"}`}</span>
            </Link>
          ))}
        </div>

        {/* Coming Soon */}
        {comingSoonCountries.length > 0 && (
          <div className="mt-6">
            <p className="text-sm font-medium text-gray-400 mb-3">{loc === "ko" ? "오픈 예정" : "Coming Soon"}</p>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2">
              {comingSoonCountries.map((c) => (
                <div key={c.id}
                  className="bg-gray-100 rounded-xl p-3 flex flex-col items-center gap-1.5 opacity-60">
                  <span className="text-lg">{c.emoji}</span>
                  <span className="text-xs font-medium text-gray-500">{c.label[loc]}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* CTA */}
      <section className="bg-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h2 className="text-2xl font-bold mb-2">{t("cta.heading")}</h2>
            <p className="text-blue-100">{t("cta.subheading")}</p>
          </div>
          <Link href="/planner"
            className="flex-shrink-0 bg-white text-blue-700 font-semibold px-6 py-3 rounded-xl hover:bg-blue-50 transition-colors flex items-center gap-2">
            {t("cta.button")} <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
