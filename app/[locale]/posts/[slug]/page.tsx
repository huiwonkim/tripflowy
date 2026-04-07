import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { ArrowLeft, Calendar, Clock } from "lucide-react";
import { posts, getPostBySlug } from "@/data/posts";
import { countries } from "@/data/destinations";
import { Badge } from "@/components/ui/Badge";
import { generateBreadcrumbJsonLd } from "@/lib/jsonld";
import type { Metadata } from "next";
import type { Locale } from "@/types";

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
      canonical: `/posts/${slug}`,
      languages: { en: `/posts/${slug}`, ko: `/ko/posts/${slug}` },
    },
    openGraph: {
      title: post.title[loc],
      description: post.excerpt[loc],
      type: "article",
      publishedTime: post.publishedAt,
    },
  };
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

  // Estimate reading time
  const wordCount = content.split(/\s+/).length;
  const readingMin = Math.max(1, Math.ceil(wordCount / 200));

  const breadcrumb = generateBreadcrumbJsonLd([
    { name: "Home", url: "https://tripflowy.com" },
    { name: loc === "ko" ? "가이드" : "Guides", url: "https://tripflowy.com/posts" },
    { name: post.title[loc] },
  ]);

  return (
    <article className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />

      <Link href="/posts" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 transition-colors mb-6">
        <ArrowLeft className="w-4 h-4" /> {loc === "ko" ? "전체 가이드" : "All Guides"}
      </Link>

      {/* Hero */}
      <div className={`bg-gradient-to-br ${post.coverGradient} rounded-3xl p-8 sm:p-12 text-white mb-8 relative overflow-hidden`}>
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative z-10">
          <div className="flex flex-wrap gap-2 mb-4">
            <span className="bg-white/20 backdrop-blur-sm text-white text-xs font-medium px-3 py-1 rounded-full">{cityLabel}</span>
            {post.tags.slice(0, 3).map((tag) => (
              <span key={tag} className="bg-white/20 backdrop-blur-sm text-white text-xs font-medium px-3 py-1 rounded-full">{tag}</span>
            ))}
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold leading-tight mb-3">{post.title[loc]}</h1>
          <p className="text-white/80 text-base leading-relaxed">{post.excerpt[loc]}</p>
          <div className="flex gap-4 mt-4 text-sm text-white/60">
            <span className="flex items-center gap-1"><Calendar className="w-4 h-4" />{post.publishedAt}</span>
            <span className="flex items-center gap-1"><Clock className="w-4 h-4" />{readingMin} min read</span>
          </div>
        </div>
      </div>

      {/* Content — rendered as simple markdown-like HTML */}
      <div className="prose prose-gray max-w-none
        prose-headings:text-gray-900 prose-headings:font-bold
        prose-h2:text-xl prose-h2:mt-10 prose-h2:mb-4
        prose-h3:text-lg prose-h3:mt-8 prose-h3:mb-3
        prose-p:text-gray-600 prose-p:leading-relaxed prose-p:mb-4
        prose-li:text-gray-600 prose-li:leading-relaxed
        prose-strong:text-gray-900
        prose-ul:mb-4 prose-ol:mb-4
      ">
        {content.split("\n").map((line, i) => {
          const trimmed = line.trim();
          if (!trimmed) return <br key={i} />;
          if (trimmed.startsWith("## ")) return <h2 key={i}>{trimmed.slice(3)}</h2>;
          if (trimmed.startsWith("### ")) return <h3 key={i}>{trimmed.slice(4)}</h3>;
          if (trimmed.startsWith("- **")) {
            const match = trimmed.match(/^- \*\*(.+?)\*\*:?\s*(.*)$/);
            if (match) return <li key={i} className="list-disc ml-4"><strong>{match[1]}</strong>{match[2] ? `: ${match[2]}` : ""}</li>;
          }
          if (trimmed.startsWith("- ")) return <li key={i} className="list-disc ml-4">{trimmed.slice(2)}</li>;
          if (/^\d+\.\s/.test(trimmed)) {
            const text = trimmed.replace(/^\d+\.\s/, "");
            return <li key={i} className="list-decimal ml-4">{text}</li>;
          }
          return <p key={i}>{trimmed}</p>;
        })}
      </div>

      {/* Related course link */}
      {post.courseId && (
        <div className="mt-12 bg-blue-50 border border-blue-100 rounded-2xl p-6 text-center">
          <p className="text-sm text-blue-700 mb-3">
            {loc === "ko" ? "이 장소가 포함된 1일 코스 보기" : "View the day course including this spot"}
          </p>
          <Link href={`/courses/${post.courseId}`}
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-2.5 rounded-xl transition-colors text-sm">
            {loc === "ko" ? "코스 보기" : "View Course"}
          </Link>
        </div>
      )}
    </article>
  );
}
