import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { ArrowLeft, Calendar, Clock, List } from "lucide-react";
import { posts, getPostBySlug } from "@/data/posts";
import { countries } from "@/data/destinations";
import { Badge } from "@/components/ui/Badge";
import { generateBreadcrumbJsonLd, generateArticleJsonLd, generateFaqJsonLd } from "@/lib/jsonld";
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
      canonical: `/posts/${slug}`,
      languages: { en: `/posts/${slug}`, ko: `/ko/posts/${slug}` },
    },
    openGraph: {
      title: post.title[loc],
      description: post.excerpt[loc],
      type: "article",
      publishedTime: post.publishedAt,
      ...(post.updatedAt ? { modifiedTime: post.updatedAt } : {}),
      ...(post.coverImage ? { images: [{ url: post.coverImage }] } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: post.title[loc],
      description: post.excerpt[loc],
    },
  };
}

/** Extract h2/h3 headings for table of contents */
function extractTOC(content: string): { level: number; text: string; id: string }[] {
  const toc: { level: number; text: string; id: string }[] = [];
  for (const line of content.split("\n")) {
    const trimmed = line.trim();
    if (trimmed.startsWith("### ")) {
      const text = trimmed.slice(4);
      toc.push({ level: 3, text, id: slugify(text) });
    } else if (trimmed.startsWith("## ")) {
      const text = trimmed.slice(3);
      toc.push({ level: 2, text, id: slugify(text) });
    }
  }
  return toc;
}

function slugify(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9가-힣]+/g, "-").replace(/^-|-$/g, "");
}

/** Render markdown-like content with image support */
function renderContent(content: string, post: BlogPost, locale: Locale) {
  const lines = content.split("\n");
  const elements: React.ReactNode[] = [];
  let imageIndex = 0;

  for (let i = 0; i < lines.length; i++) {
    const trimmed = lines[i].trim();

    if (!trimmed) {
      elements.push(<div key={i} className="h-2" />);
      continue;
    }

    // Image placeholder: ![alt](index)
    const imgMatch = trimmed.match(/^!\[(.+?)\]\((\d+)\)$/);
    if (imgMatch && post.images) {
      const idx = Number(imgMatch[2]);
      const img = post.images[idx];
      if (img) {
        elements.push(
          <figure key={i} className="my-6">
            <Image src={img.src} alt={img.alt[locale]} width={800} height={500} className="rounded-xl w-full h-auto" />
            {img.caption && <figcaption className="text-center text-xs text-gray-400 mt-2">{img.caption[locale]}</figcaption>}
          </figure>
        );
        continue;
      }
    }

    if (trimmed.startsWith("## ")) {
      const text = trimmed.slice(3);
      elements.push(<h2 key={i} id={slugify(text)} className="text-xl font-bold text-gray-900 mt-10 mb-4 scroll-mt-20">{text}</h2>);
    } else if (trimmed.startsWith("### ")) {
      const text = trimmed.slice(4);
      elements.push(<h3 key={i} id={slugify(text)} className="text-lg font-bold text-gray-900 mt-8 mb-3 scroll-mt-20">{text}</h3>);
    } else if (trimmed.startsWith("- **")) {
      const match = trimmed.match(/^- \*\*(.+?)\*\*:?\s*(.*)$/);
      if (match) {
        elements.push(<li key={i} className="list-disc ml-5 text-gray-600 leading-relaxed"><strong className="text-gray-900">{match[1]}</strong>{match[2] ? `: ${match[2]}` : ""}</li>);
      }
    } else if (trimmed.startsWith("- ")) {
      elements.push(<li key={i} className="list-disc ml-5 text-gray-600 leading-relaxed">{trimmed.slice(2)}</li>);
    } else if (/^\d+\.\s/.test(trimmed)) {
      const text = trimmed.replace(/^\d+\.\s/, "");
      elements.push(<li key={i} className="list-decimal ml-5 text-gray-600 leading-relaxed">{text}</li>);
    } else {
      elements.push(<p key={i} className="text-gray-600 leading-relaxed mb-4">{trimmed}</p>);
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

  const wordCount = content.split(/\s+/).length;
  const readingMin = Math.max(1, Math.ceil(wordCount / 200));

  const toc = extractTOC(content);

  // JSON-LD: Article + Breadcrumb + FAQ
  const jsonLd: Record<string, unknown>[] = [
    generateArticleJsonLd(post, loc),
    generateBreadcrumbJsonLd([
      { name: "Home", url: "https://tripflowy.com" },
      { name: loc === "ko" ? "가이드" : "Guides", url: "https://tripflowy.com/posts" },
      { name: post.title[loc] },
    ]),
  ];
  if (post.faq?.length) {
    jsonLd.push(generateFaqJsonLd(post.faq, loc));
  }

  return (
    <article className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
      {jsonLd.map((ld, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      ))}

      <Link href="/posts" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 transition-colors mb-6">
        <ArrowLeft className="w-4 h-4" /> {loc === "ko" ? "전체 가이드" : "All Guides"}
      </Link>

      {/* Hero */}
      {post.coverImage ? (
        <div className="relative rounded-3xl overflow-hidden mb-8">
          <Image src={post.coverImage} alt={post.title[loc]} width={1200} height={600} className="w-full h-64 sm:h-80 object-cover" priority />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-8">
            <div className="flex flex-wrap gap-2 mb-3">
              <span className="bg-white/20 backdrop-blur-sm text-white text-xs font-medium px-3 py-1 rounded-full">{cityLabel}</span>
              {post.tags.slice(0, 3).map((tag) => (
                <span key={tag} className="bg-white/20 backdrop-blur-sm text-white text-xs font-medium px-3 py-1 rounded-full">{tag}</span>
              ))}
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white leading-tight mb-2">{post.title[loc]}</h1>
            <div className="flex gap-4 text-sm text-white/70">
              <span className="flex items-center gap-1"><Calendar className="w-4 h-4" />{post.publishedAt}</span>
              <span className="flex items-center gap-1"><Clock className="w-4 h-4" />{readingMin} min</span>
            </div>
          </div>
        </div>
      ) : (
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
              <span className="flex items-center gap-1"><Clock className="w-4 h-4" />{readingMin} min</span>
            </div>
          </div>
        </div>
      )}

      {/* Table of Contents */}
      {toc.length > 2 && (
        <nav className="bg-gray-50 border border-gray-100 rounded-2xl p-5 mb-8">
          <div className="flex items-center gap-2 mb-3">
            <List className="w-4 h-4 text-gray-500" />
            <h2 className="text-sm font-semibold text-gray-700">{loc === "ko" ? "목차" : "Table of Contents"}</h2>
          </div>
          <ul className="space-y-1.5">
            {toc.map((item) => (
              <li key={item.id} className={item.level === 3 ? "ml-4" : ""}>
                <a href={`#${item.id}`} className="text-sm text-blue-600 hover:text-blue-800 hover:underline transition-colors">
                  {item.text}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      )}

      {/* Content */}
      <div className="max-w-none">
        {renderContent(content, post, loc)}
      </div>

      {/* FAQ section */}
      {post.faq && post.faq.length > 0 && (
        <section className="mt-12 border-t border-gray-100 pt-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">{loc === "ko" ? "자주 묻는 질문" : "FAQ"}</h2>
          <div className="space-y-4">
            {post.faq.map((item, i) => (
              <details key={i} className="bg-white border border-gray-100 rounded-xl overflow-hidden group">
                <summary className="px-5 py-4 cursor-pointer text-sm font-medium text-gray-900 hover:bg-gray-50 transition-colors list-none flex items-center justify-between">
                  {item.question[loc]}
                  <span className="text-gray-400 group-open:rotate-180 transition-transform">&#9662;</span>
                </summary>
                <div className="px-5 pb-4 text-sm text-gray-600 leading-relaxed">
                  {item.answer[loc]}
                </div>
              </details>
            ))}
          </div>
        </section>
      )}

      {/* Related course */}
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
