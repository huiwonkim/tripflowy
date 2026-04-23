import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { ArrowLeft, Calendar, Clock, ChevronRight, ExternalLink, User } from "lucide-react";
import { posts, getPostBySlug, getPostsByCity } from "@/data/posts";
import { tours } from "@/data/tours";
import { hotels } from "@/data/hotels";
import { ShareButton } from "@/components/ui/ShareButton";
import { PostCTA } from "@/components/ui/PostCTA";
import { ComparisonTable } from "@/components/ui/ComparisonTable";
import { countries } from "@/data/destinations";
import { generateBreadcrumbJsonLd, generateArticleJsonLd, generateFaqJsonLd } from "@/lib/jsonld";
import { getAuthor, getAuthorIdentity } from "@/lib/authors";
import type { Metadata } from "next";
import type { Locale, BlogPost } from "@/types";

interface PageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export async function generateStaticParams() {
  return posts.flatMap((p) => ["en", "ko"].map((locale) => ({ locale, slug: p.slug })));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};
  const loc = locale as Locale;
  return {
    title: post.title[loc],
    description: post.excerpt[loc],
    alternates: {
      canonical: loc === "ko" ? `/ko/posts/${slug}` : `/posts/${slug}`,
      languages: {
        en: `/posts/${slug}`,
        ko: `/ko/posts/${slug}`,
        "x-default": `/posts/${slug}`,
      },
    },
    openGraph: {
      title: post.title[loc],
      description: post.excerpt[loc],
      type: "article",
      publishedTime: post.publishedAt,
      ...(post.updatedAt ? { modifiedTime: post.updatedAt } : {}),
      images: [post.coverImage
        ? { url: post.coverImage, width: 1200, height: 630 }
        : { url: "/logo-square-dark.png", width: 512, height: 512 }],
    },
    twitter: { card: "summary_large_image", title: post.title[loc], description: post.excerpt[loc] },
  };
}

function extractTOC(content: string): { level: number; text: string; id: string }[] {
  const toc: { level: number; text: string; id: string }[] = [];
  for (const line of content.split("\n")) {
    const trimmed = line.trim();
    if (trimmed.startsWith("### ")) toc.push({ level: 3, text: trimmed.slice(4), id: slugify(trimmed.slice(4)) });
    else if (trimmed.startsWith("## ")) toc.push({ level: 2, text: trimmed.slice(3), id: slugify(trimmed.slice(3)) });
  }
  return toc;
}

function slugify(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9가-힣]+/g, "-").replace(/^-|-$/g, "");
}

/** Parse inline markdown: **bold**, ==highlight==, [link](url) */
function parseInline(text: string): React.ReactNode[] {
  const parts: React.ReactNode[] = [];
  // Match **bold**, ==highlight==, and [text](url)
  const regex = /\*\*(.+?)\*\*|==(.+?)==|\[(.+?)\]\(((?:https?:\/\/|\/)[^\s)]+)\)/g;
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(text)) !== null) {
    // Text before match
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }
    if (match[1]) {
      // **bold**
      parts.push(<strong key={match.index} className="font-bold text-gray-900">{match[1]}</strong>);
    } else if (match[2]) {
      // ==highlight==
      parts.push(<mark key={match.index} className="bg-blue-50 text-blue-700 px-0.5 rounded font-medium" style={{ textDecoration: "none" }}>{match[2]}</mark>);
    } else if (match[3] && match[4]) {
      // [text](url) — external links open in new tab, internal links same tab
      const isExternal = match[4].startsWith("http");
      parts.push(<a key={match.index} href={match[4]}
        {...(isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        className="text-blue-600 hover:text-blue-800 underline">{match[3]}</a>);
    }
    lastIndex = match.index + match[0].length;
  }
  // Remaining text
  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }
  return parts.length > 0 ? parts : [text];
}

function renderContent(content: string, post: BlogPost, locale: Locale) {
  const lines = content.split("\n");
  const elements: React.ReactNode[] = [];

  for (let i = 0; i < lines.length; i++) {
    const trimmed = lines[i].trim();
    if (!trimmed) { elements.push(<div key={i} className="h-4" />); continue; }

    // CTA placeholder: {{cta}}
    if (trimmed === "{{cta}}" && post.cta) {
      elements.push(<PostCTA key={i} cta={post.cta} locale={locale} variant="inline" />);
      continue;
    }

    // Comparison table: {{compare:N}} — N indexes into post.comparisons
    const compareMatch = trimmed.match(/^\{\{compare:(\d+)\}\}$/);
    if (compareMatch && post.comparisons) {
      const idx = Number(compareMatch[1]);
      const table = post.comparisons[idx];
      if (table) {
        elements.push(<ComparisonTable key={i} table={table} locale={locale} />);
        continue;
      }
    }

    // Booking button: {{booking:label:url}}
    const bookingMatch = trimmed.match(/^\{\{booking:(.+?):(.+?)\}\}$/);
    if (bookingMatch) {
      const label = bookingMatch[1];
      const rawUrl = bookingMatch[2];
      const bookingUrl = locale === "ko"
        ? rawUrl.replace("klook.com/activity/", "klook.com/ko/activity/")
        : rawUrl.replace("klook.com/ko/activity/", "klook.com/activity/");
      elements.push(
        <a key={i} href={bookingUrl} target="_blank" rel="noopener noreferrer sponsored"
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors my-4">
          {label}
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      );
      continue;
    }

    // Image: ![alt](index)
    const imgMatch = trimmed.match(/^!\[(.+?)\]\((\d+)\)$/);
    if (imgMatch && post.images) {
      const idx = Number(imgMatch[2]);
      const img = post.images[idx];
      if (img) {
        // Reduce margins between consecutive images
        const prevLine = i > 0 ? lines[i - 1]?.trim() : "";
        const nextLine = i < lines.length - 1 ? lines[i + 1]?.trim() : "";
        const prevIsImg = prevLine ? /^!\[.+\]\(\d+\)$/.test(prevLine) : false;
        const nextIsImg = nextLine ? /^!\[.+\]\(\d+\)$/.test(nextLine) : false;
        const mt = prevIsImg ? "mt-3" : "mt-8";
        const mb = nextIsImg ? "mb-0" : "mb-8";
        elements.push(
          <figure key={i} className={`${mt} ${mb} -mx-4 sm:mx-0`}>
            <Image src={img.src} alt={img.alt[locale]} width={800} height={450}
              className="w-full h-auto rounded-2xl" />
            {img.caption && <figcaption className="text-center text-sm text-gray-400 mt-3">{img.caption[locale]}</figcaption>}
          </figure>
        );
        continue;
      }
    }

    if (trimmed.startsWith("## ")) {
      const text = trimmed.slice(3);
      elements.push(<h2 key={i} id={slugify(text)} className="text-[24px] sm:text-[30px] font-bold text-gray-900 tracking-tight mt-14 mb-5 scroll-mt-24">{text}</h2>);
    } else if (trimmed.startsWith("### ")) {
      const text = trimmed.slice(4);
      elements.push(<h3 key={i} id={slugify(text)} className="text-[19px] sm:text-[22px] font-bold text-gray-900 mt-10 mb-4 scroll-mt-24">{text}</h3>);
    } else if (trimmed.startsWith("- ")) {
      const content = trimmed.slice(2);
      elements.push(<li key={i} className="list-disc ml-5 text-[17px] text-gray-600 leading-[1.8] mb-1">{parseInline(content)}</li>);
    } else if (/^\d+\.\s/.test(trimmed)) {
      const content = trimmed.replace(/^\d+\.\s/, "");
      elements.push(<li key={i} className="list-decimal ml-5 text-[17px] text-gray-600 leading-[1.8] mb-1">{parseInline(content)}</li>);
    } else {
      elements.push(<p key={i} className="text-[17px] text-gray-600 leading-[1.8] mb-5">{parseInline(trimmed)}</p>);
    }
  }
  return elements;
}

export default async function PostPage({ params }: PageProps) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const loc = locale as Locale;

  const post = getPostBySlug(slug);
  if (!post) notFound();

  const allCities = countries.flatMap((c) => c.cities);
  const cityLabel = allCities.find((c) => c.id === post.city)?.label[loc] ?? post.city;
  const content = post.content[loc];
  const author = getAuthor(post.authorId);
  const identity = getAuthorIdentity(author, loc);

  const wordCount = content.split(/\s+/).length;
  const readingMin = Math.max(1, Math.ceil(wordCount / 200));
  const toc = extractTOC(content);

  // Related posts — same city first, then same country, max 3
  const sameCityPosts = getPostsByCity(post.city).filter((p) => p.slug !== post.slug);
  const country = countries.find((c) => c.cities.some((city) => city.id === post.city));
  const sameCountryPosts = country
    ? country.cities.flatMap((city) => getPostsByCity(city.id)).filter((p) => p.slug !== post.slug && !sameCityPosts.some((sp) => sp.slug === p.slug))
    : [];
  const relatedPosts = [...sameCityPosts, ...sameCountryPosts].slice(0, 3);
  const countryLabel = country?.label[loc] ?? cityLabel;

  // Related tours & hotels for this city
  const cityTours = tours.filter((t) => t.destination === post.city).slice(0, 3);
  const cityHotels = hotels.filter((h) => h.destination === post.city).slice(0, 3);

  // JSON-LD
  const articleLd = generateArticleJsonLd(post, loc, cityLabel, wordCount);
  // Enrich with mentions of related tours/hotels for GEO/AEO
  const mentions = [
    ...cityTours.map((t) => ({ "@type": "Product" as const, name: t.title[loc], url: t.affiliateUrl })),
    ...cityHotels.map((h) => ({ "@type": "LodgingBusiness" as const, name: h.name, url: h.affiliateUrl })),
  ];
  if (mentions.length > 0) (articleLd as Record<string, unknown>).mentions = mentions;

  const jsonLd: Record<string, unknown>[] = [
    articleLd,
    generateBreadcrumbJsonLd([
      { name: "Home", url: "https://tripflowy.com" },
      { name: loc === "ko" ? "가이드" : "Guides", url: "https://tripflowy.com/posts" },
      { name: post.title[loc] },
    ]),
  ];
  if (post.faq?.length) jsonLd.push(generateFaqJsonLd(post.faq, loc));

  return (
    <article>
      {jsonLd.map((ld, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      ))}

      {/* ── Hero ── */}
      {post.coverImage ? (
        <div className="relative w-full h-[50vh] min-h-[360px] max-h-[520px]">
          <Image src={post.coverImage} alt={post.title[loc]} fill className="object-cover" priority />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-10 max-w-[680px] mx-auto">
            <div className="flex items-center gap-2 mb-3 flex-wrap">
              <span className="bg-white/20 backdrop-blur-sm text-white text-xs font-medium px-3 py-1 rounded-full">{cityLabel}</span>
              <span className="text-white/70 text-xs flex items-center gap-1"><User className="w-3 h-3" />{identity.name}</span>
              <span className="text-white/60 text-xs flex items-center gap-1"><Calendar className="w-3 h-3" />{post.publishedAt}</span>
              <span className="text-white/60 text-xs flex items-center gap-1"><Clock className="w-3 h-3" />{readingMin}min</span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-[1.1] tracking-tight">{post.title[loc]}</h1>
          </div>
        </div>
      ) : (
        <div className={`relative overflow-hidden bg-gradient-to-br ${post.coverGradient} py-16 sm:py-24`}>
          <span
            aria-hidden
            className="pointer-events-none absolute -right-12 -bottom-20 text-[18rem] font-black leading-none tracking-tight text-white/15 select-none"
          >
            {post.city.charAt(0).toUpperCase()}
          </span>
          <span
            aria-hidden
            className="pointer-events-none absolute -left-16 -top-16 w-80 h-80 rounded-full bg-white/15 blur-3xl"
          />
          <div className="relative max-w-[680px] mx-auto px-5">
            <div className="flex items-center gap-2 mb-4 flex-wrap">
              <span className="bg-white/20 text-white text-xs font-medium px-3 py-1 rounded-full">{cityLabel}</span>
              <span className="text-white/70 text-xs flex items-center gap-1"><User className="w-3 h-3" />{identity.name}</span>
              <span className="text-white/60 text-xs">{post.publishedAt}</span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-[1.1] tracking-tight">{post.title[loc]}</h1>
          </div>
        </div>
      )}

      {/* ── Body ── */}
      <div className="max-w-[900px] mx-auto px-5 py-10 lg:flex lg:gap-12">

        {/* Main content */}
        <div className="max-w-[680px] flex-1">
          {/* Back */}
          <Link href="/posts" className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-700 transition-colors mb-8">
            <ArrowLeft className="w-4 h-4" /> {loc === "ko" ? "전체 가이드" : "All Guides"}
          </Link>

          {/* Excerpt */}
          <p className="text-[17px] text-gray-500 leading-[1.8] mb-10 border-l-4 border-blue-200 pl-4">
            {post.excerpt[loc]}
          </p>

          {/* Content */}
          <div>{renderContent(content, post, loc)}</div>

          {/* CTA card */}
          {post.cta && <PostCTA cta={post.cta} locale={loc} variant="card" />}

          {/* Share */}
          <ShareButton locale={loc} />

          {/* FAQ */}
          {post.faq && post.faq.length > 0 && (
            <section className="mt-16 pt-10 border-t border-gray-100">
              <h2 className="text-[22px] font-bold text-gray-900 mb-6">{loc === "ko" ? "자주 묻는 질문" : "FAQ"}</h2>
              <div className="space-y-3">
                {post.faq.map((item, i) => (
                  <details key={i} open={i < 3} className="bg-gray-50 rounded-xl overflow-hidden group">
                    <summary className="faq-question px-5 py-4 cursor-pointer text-[15px] font-medium text-gray-900 hover:bg-gray-100 transition-colors list-none flex items-center justify-between">
                      {item.question[loc]}
                      <ChevronRight className="w-4 h-4 text-gray-400 group-open:rotate-90 transition-transform" />
                    </summary>
                    <div className="faq-answer px-5 pb-4 text-[15px] text-gray-600 leading-[1.8]">{item.answer[loc]}</div>
                  </details>
                ))}
              </div>
            </section>
          )}

          {/* Author bio box — E-E-A-T signal */}
          <section className="mt-14 pt-10 border-t border-gray-100">
            <div className="bg-gray-50 rounded-2xl p-6">
              <div className="flex items-start gap-4">
                {author.image ? (
                  <Image src={author.image} alt={identity.name} width={56} height={56}
                    className="w-14 h-14 rounded-full object-cover flex-shrink-0" />
                ) : (
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center flex-shrink-0">
                    <User className="w-6 h-6 text-white" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">
                    {loc === "ko" ? "작성자" : "Written by"}
                  </p>
                  <p className="text-[15px] font-bold text-gray-900">{identity.displayName}</p>
                  <p className="text-[13px] text-gray-500 mb-2">{identity.jobTitle}</p>
                  <p className="text-[14px] text-gray-600 leading-[1.7]">{identity.bio}</p>
                </div>
              </div>
            </div>
          </section>

          {/* Related tours & hotels for this city */}
          {(cityTours.length > 0 || cityHotels.length > 0) && (
            <section className="mt-14 pt-10 border-t border-gray-100">
              <h2 className="text-[20px] font-bold text-gray-900 mb-5">
                {loc === "ko" ? `${cityLabel} 추천 투어 & 숙소` : `Tours & Hotels in ${cityLabel}`}
              </h2>
              {cityTours.length > 0 && (
                <div className="mb-4">
                  <p className="text-xs font-semibold text-amber-600 uppercase tracking-wide mb-3">{loc === "ko" ? "투어" : "Tours"}</p>
                  <div className="space-y-2">
                    {cityTours.map((t) => (
                      <a key={t.id} href={t.affiliateUrl} target="_blank" rel="noopener noreferrer sponsored"
                        className="flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors">
                        <div>
                          <p className="text-sm font-medium text-gray-900">{t.title[loc]}</p>
                          <p className="text-xs text-gray-400">{t.durationLabel[loc]}</p>
                        </div>
                        <span className="text-sm font-semibold text-amber-600">${t.price}</span>
                      </a>
                    ))}
                  </div>
                </div>
              )}
              {cityHotels.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-blue-600 uppercase tracking-wide mb-3">{loc === "ko" ? "숙소" : "Hotels"}</p>
                  <div className="space-y-2">
                    {cityHotels.map((h) => (
                      <a key={h.id} href={h.affiliateUrl} target="_blank" rel="noopener noreferrer sponsored"
                        className="flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors">
                        <div>
                          <p className="text-sm font-medium text-gray-900">{h.name}</p>
                          <p className="text-xs text-gray-400">{h.location[loc]}</p>
                        </div>
                        <span className="text-sm font-semibold text-blue-600">{h.priceRange}</span>
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </section>
          )}

          {/* Plan-a-trip CTA */}
          {post.city && (
            <div className="mt-12 bg-blue-50 rounded-2xl p-6 text-center">
              <p className="text-sm text-blue-700 mb-3">
                {loc === "ko" ? "이 여행지로 일정 만들어 보기" : "Plan a trip to this destination"}
              </p>
              <Link href={`/planner?destinations=${post.city}`}
                className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-2.5 rounded-xl transition-colors text-sm">
                {loc === "ko" ? "여행 계획 시작하기" : "Start Planning"}
              </Link>
            </div>
          )}

        </div>

        {/* Desktop sticky TOC */}
        {toc.length > 2 && (
          <aside className="hidden lg:block w-[180px] flex-shrink-0">
            <nav className="sticky top-24">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">
                {loc === "ko" ? "목차" : "Contents"}
              </p>
              <ul className="space-y-2 border-l border-gray-200">
                {toc.map((item) => (
                  <li key={item.id} className={item.level === 3 ? "ml-3" : ""}>
                    <a href={`#${item.id}`}
                      className="block pl-3 py-0.5 text-[13px] text-gray-400 hover:text-blue-600 hover:border-l-2 hover:border-blue-600 hover:-ml-px transition-colors leading-snug">
                      {item.text}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </aside>
        )}
      </div>

      {/* ── Related Posts (Toss style) ── */}
      {relatedPosts.length > 0 && (
        <section className="border-t border-gray-100 py-14">
          <div className="max-w-[900px] mx-auto px-5 lg:pr-[228px]">
            <h2 className="text-lg font-bold text-gray-900 mb-6">
              {loc === "ko" ? `${countryLabel}의 다른 글` : `More from ${countryLabel}`}
            </h2>
            <div className="space-y-4">
              {relatedPosts.map((rp) => {
                const rpCity = allCities.find((c) => c.id === rp.city)?.label[loc] ?? rp.city;
                return (
                  <Link key={rp.slug} href={`/posts/${rp.slug}`}
                    className="group flex items-center gap-4 p-4 bg-gray-50 hover:bg-gray-100 rounded-2xl transition-colors">
                    {rp.coverImage ? (
                      <Image src={rp.coverImage} alt={rp.title[loc]} width={80} height={80}
                        className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl object-cover flex-shrink-0" />
                    ) : (
                      <div className={`w-16 h-16 sm:w-20 sm:h-20 rounded-xl bg-gradient-to-br ${rp.coverGradient} flex-shrink-0`} />
                    )}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-[15px] text-gray-900 group-hover:text-blue-600 transition-colors leading-snug mb-1 line-clamp-2">
                        {rp.title[loc]}
                      </h3>
                      <p className="text-xs text-gray-400">{rp.publishedAt}</p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}
      {/* Mobile sticky CTA bar */}
      {post.cta && <PostCTA cta={post.cta} locale={loc} variant="sticky" />}
    </article>
  );
}
