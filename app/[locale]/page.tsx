import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import Image from "next/image";
import { ArrowRight, CheckCircle, Zap, Map, Hotel, X, Check } from "lucide-react";
import { QuickPlanner } from "@/components/planner/QuickPlanner";
import { posts } from "@/data/posts";
import { publicCountries, publicComingSoon } from "@/data/destinations";
import { isPublicCity } from "@/lib/public-mode";
import { getCategoryById } from "@/data/categories";
import { generateOrganizationJsonLd, generateWebSiteJsonLd, generateHowToJsonLd, generateDestinationItemListJsonLd } from "@/lib/jsonld";
import { META_DESCRIPTIONS } from "@/content/brand";
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
    description: isKo ? META_DESCRIPTIONS.homeKo : META_DESCRIPTIONS.homeEn,
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

  const countries = publicCountries();
  const comingSoonCountries = publicComingSoon();
  const allCities = countries.flatMap((c) => c.cities);
  const visiblePosts = posts.filter((p) => isPublicCity(p.city));

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

      {/* Hero — premium editorial: full-bleed photo + large display type,
          QuickPlanner floats over the hero's bottom edge on desktop. */}
      <section className="relative isolate overflow-hidden bg-slate-950 text-white">
        {/* Background photo — Tokyo cityscape as anchor */}
        <Image
          src="/images/city-heroes/tokyo.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover"
          aria-hidden="true"
        />
        {/* Dark gradient overlay — just enough to make white text readable
            over the night-Tokyo image. Keeps the skyline visible. */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-r from-slate-950/75 via-slate-950/40 to-transparent"
        />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 pt-12 sm:pt-16 lg:pt-20 pb-10 lg:pb-16">
          <div className="grid lg:grid-cols-[1.1fr_1fr] gap-8 lg:gap-12 items-center">
            {/* Left: hero copy */}
            <div>
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/15 text-blue-100 text-xs font-medium px-3 py-1.5 rounded-full mb-4">
                <Zap className="w-3.5 h-3.5" />
                {t("hero.badge")}
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-[1.05] tracking-tight whitespace-pre-line mb-3">
                {t("hero.heading")}
              </h1>
              <p className="text-blue-300 text-2xl sm:text-3xl font-bold leading-tight mb-4">
                {t("hero.headingHighlight")}
              </p>
              <p className="text-slate-200 text-base sm:text-lg leading-relaxed max-w-xl">
                {t("hero.subheading")}
              </p>
              <p className="text-slate-400 text-sm sm:text-base leading-relaxed max-w-xl mt-2">
                {t("hero.subTagline")}
              </p>

              <div className="hidden sm:flex flex-wrap gap-x-5 gap-y-2 mt-5 text-sm text-slate-300">
                {[t("hero.destinations"), t("hero.dayByDay"), t("hero.affiliate")].map((s) => (
                  <span key={s} className="flex items-center gap-1.5">
                    <CheckCircle className="w-4 h-4 text-blue-300 flex-shrink-0" />
                    {s}
                  </span>
                ))}
              </div>
            </div>

            {/* Right: QuickPlanner card */}
            <div className="bg-slate-900/80 backdrop-blur-md border border-white/15 rounded-2xl p-5 sm:p-6 shadow-[var(--shadow-hero)]">
              <p className="text-sm font-medium text-slate-300 mb-4">
                {t("hero.findItinerary")}
              </p>
              <QuickPlanner />
            </div>
          </div>
        </div>
      </section>

      {/* Compare: AI vs Field-tested */}
      <section className="bg-white border-y border-gray-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-20">
          <div className="text-center mb-12 max-w-2xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight mb-3">{t("whyDifferent.heading")}</h2>
            <p className="text-gray-500 text-lg">{t("whyDifferent.subheading")}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* AI side — muted, negative framing */}
            <div className="relative bg-gray-50 rounded-2xl p-7 border border-gray-100">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-[0.15em] mb-5">{t("whyDifferent.aiTitle")}</p>
              <ul className="space-y-3.5">
                {[t("whyDifferent.ai1"), t("whyDifferent.ai2"), t("whyDifferent.ai3"), t("whyDifferent.ai4")].map((item) => (
                  <li key={item} className="flex items-start gap-3 text-[15px] text-gray-500 leading-relaxed">
                    <span className="mt-0.5 flex-shrink-0 w-5 h-5 rounded-full bg-gray-200 flex items-center justify-center">
                      <X className="w-3 h-3 text-gray-400" strokeWidth={3} />
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* TripFlowy side — accented, positive framing */}
            <div className="relative bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-7 border border-blue-200/50 shadow-card">
              <p className="text-xs font-semibold text-blue-600 uppercase tracking-[0.15em] mb-5">{t("whyDifferent.realTitle")}</p>
              <ul className="space-y-3.5">
                {[t("whyDifferent.real1"), t("whyDifferent.real2"), t("whyDifferent.real3"), t("whyDifferent.real4")].map((item) => (
                  <li key={item} className="flex items-start gap-3 text-[15px] text-gray-800 leading-relaxed font-medium">
                    <span className="mt-0.5 flex-shrink-0 w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center">
                      <Check className="w-3 h-3 text-white" strokeWidth={3} />
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Popular guides */}
      {visiblePosts.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-sm font-medium text-blue-600 mb-1">{t("guides.label")}</p>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight">{t("guides.heading")}</h2>
            </div>
            <Link href="/posts"
              className="flex items-center gap-1.5 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors">
              {t("guides.seeAll")} <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {[...visiblePosts].sort(() => Math.random() - 0.5).slice(0, 4).map((post) => {
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-20">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight mb-3">{t("howItWorks.heading")}</h2>
            <p className="text-gray-500 text-lg max-w-lg mx-auto">{t("howItWorks.subheading")}</p>
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
        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight mb-8">{t("browseByDestination")}</h2>

        {/* Active destinations — cities (more useful than single-country card) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {allCities.map((city) => (
            <Link key={city.id} href={`/planner?destinations=${city.id}`}
              className="group relative overflow-hidden bg-gradient-to-br from-slate-800 to-slate-950 rounded-2xl p-6 text-white flex flex-col items-start gap-1 hover:shadow-card-hover transition-all">
              <span
                aria-hidden
                className="pointer-events-none absolute -right-4 -bottom-8 text-[7rem] font-black leading-none tracking-tight text-white/[0.07] select-none"
              >
                {city.label[loc].charAt(0)}
              </span>
              <span className="text-xs font-medium text-blue-300 mb-1">🇯🇵 {loc === "ko" ? "일본" : "Japan"}</span>
              <span className="relative text-xl font-bold tracking-tight">{city.label[loc]}</span>
              <span className="relative text-xs text-slate-400 group-hover:text-slate-300 transition-colors">
                {loc === "ko" ? "일정 만들기" : "Plan a trip"} →
              </span>
            </Link>
          ))}
        </div>

        {/* Coming Soon — one-line, subdued */}
        {comingSoonCountries.length > 0 && (
          <p className="mt-6 text-sm text-gray-400 flex flex-wrap items-center gap-2">
            <span className="font-medium text-gray-500">{loc === "ko" ? "곧 확장:" : "Coming soon:"}</span>
            {comingSoonCountries.map((c) => (
              <span key={c.id} className="inline-flex items-center gap-1">
                <span>{c.emoji}</span>
                <span>{c.label[loc]}</span>
              </span>
            ))}
          </p>
        )}
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white">
        <span aria-hidden className="pointer-events-none absolute -left-16 -top-16 w-64 h-64 rounded-full bg-white/10 blur-3xl" />
        <span aria-hidden className="pointer-events-none absolute -right-20 -bottom-20 w-72 h-72 rounded-full bg-indigo-400/20 blur-3xl" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-16 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-2">{t("cta.heading")}</h2>
            <p className="text-blue-100 text-lg">{t("cta.subheading")}</p>
          </div>
          <Link href="/planner"
            className="flex-shrink-0 bg-white text-blue-700 font-semibold px-7 py-3.5 rounded-xl hover:bg-blue-50 transition-colors flex items-center gap-2 shadow-card">
            {t("cta.button")} <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
