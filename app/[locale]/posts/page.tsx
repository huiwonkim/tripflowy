import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import Image from "next/image";
import { posts } from "@/data/posts";
import { countries } from "@/data/destinations";
import { ArrowRight, Calendar } from "lucide-react";
import { CategoryBadge } from "@/components/ui/CategoryBadge";
import { generateCollectionPageJsonLd, generateBreadcrumbJsonLd } from "@/lib/jsonld";
import type { Locale } from "@/types";
import type { Metadata } from "next";

const BASE_URL = "https://www.tripflowy.com";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: locale === "ko" ? "여행 가이드 & 후기" : "Travel Guides & Reviews",
    description: locale === "ko" ? "인기 여행지의 상세 가이드와 방문 후기" : "In-depth guides and reviews for popular destinations",
    keywords: locale === "ko"
      ? "여행 가이드, 여행 후기, 여행 정보, 트플, TripFlowy"
      : "travel guide, travel review, destination guide, TripFlowy",
    openGraph: {
      title: locale === "ko" ? "여행 가이드 & 후기 | TripFlowy" : "Travel Guides & Reviews | TripFlowy",
      description: locale === "ko" ? "인기 여행지의 상세 가이드와 방문 후기" : "In-depth guides and reviews for popular destinations",
    },
    alternates: {
      canonical: locale === "ko" ? "/ko/posts" : "/posts",
      languages: { en: "/posts", ko: "/ko/posts", "x-default": "/posts" },
    },
  };
}

export default async function PostsPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const loc = locale as Locale;
  const allCities = countries.flatMap((c) => c.cities);

  const pageUrl = `${BASE_URL}${loc === "ko" ? "/ko" : ""}/posts`;
  const pageName = loc === "ko" ? "여행 가이드 & 후기" : "Travel Guides & Reviews";
  const pageDescription = loc === "ko" ? "인기 여행지의 상세 가이드와 방문 후기" : "In-depth guides and reviews for popular destinations";

  const collectionJsonLd = generateCollectionPageJsonLd({
    name: pageName,
    description: pageDescription,
    url: pageUrl,
    locale: loc,
    items: posts.map((post) => ({
      name: post.title[loc],
      url: `${BASE_URL}${loc === "ko" ? "/ko" : ""}/posts/${post.slug}`,
    })),
  });

  const breadcrumbJsonLd = generateBreadcrumbJsonLd([
    { name: loc === "ko" ? "홈" : "Home", url: `${BASE_URL}${loc === "ko" ? "/ko" : ""}` },
    { name: pageName, url: pageUrl },
  ]);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <div className="mb-8">
        <p className="text-sm font-medium text-violet-600 mb-1">
          {loc === "ko" ? "깊이 있는 정보" : "In-depth info"}
        </p>
        <h1 className="text-3xl font-bold text-gray-900">
          {loc === "ko" ? "여행 가이드 & 후기" : "Travel Guides & Reviews"}
        </h1>
        <p className="text-gray-500 mt-2">
          {loc === "ko" ? "인기 여행지의 상세 가이드와 방문 후기를 확인하세요." : "Detailed guides and reviews for popular destinations."}
        </p>
      </div>

      <div className="space-y-4">
        {posts.map((post) => {
          const cityLabel = allCities.find((c) => c.id === post.city)?.label[loc] ?? post.city;
          return (
            <Link key={post.slug} href={`/posts/${post.slug}`}
              className="group flex flex-col sm:flex-row bg-white rounded-2xl overflow-hidden border border-gray-100 hover:border-gray-200 hover:shadow-md transition-all">
              <div className={`sm:w-48 h-32 sm:h-auto ${!post.coverImage ? `bg-gradient-to-br ${post.coverGradient}` : ""} relative flex-shrink-0`}>
                {post.coverImage && (
                  <Image src={post.coverImage} alt={post.title[loc]} fill className="object-cover" />
                )}
                <div className="absolute inset-0 bg-black/15" />
                <div className="absolute bottom-3 left-3">
                  <span className="bg-white/20 backdrop-blur-sm text-white text-xs font-medium px-2.5 py-1 rounded-full">{cityLabel}</span>
                </div>
              </div>
              <div className="flex-1 p-5">
                <h2 className="font-semibold text-gray-900 text-base leading-snug group-hover:text-blue-700 transition-colors mb-2">
                  {post.title[loc]}
                </h2>
                <p className="text-sm text-gray-500 leading-relaxed mb-3 line-clamp-2">{post.excerpt[loc]}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-gray-400" />
                    <span className="text-xs text-gray-400">{post.publishedAt}</span>
                    {post.categories?.slice(0, 2).map((catId) => (
                      <CategoryBadge key={catId} id={catId} locale={loc} />
                    ))}
                  </div>
                  <span className="flex items-center gap-1 text-blue-600 text-xs font-medium group-hover:gap-2 transition-all">
                    {loc === "ko" ? "읽기" : "Read"} <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {posts.length === 0 && (
        <div className="text-center py-20">
          <p className="text-lg font-medium text-gray-600">{loc === "ko" ? "아직 작성된 가이드가 없습니다." : "No guides published yet."}</p>
        </div>
      )}
    </div>
  );
}
