import type { DayCourse, FAQ, Locale, GeneratedItinerary, BlogPost } from "@/types";

const BASE_URL = "https://www.tripflowy.com";

/**
 * Organization schema — enables Google brand knowledge panel.
 * Render once on the homepage.
 */
export function generateOrganizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Tripflowy",
    url: BASE_URL,
    logo: `${BASE_URL}/logo-square-color.png`,
    description: "Itinerary-first travel planning for Asia, Europe, and beyond — courses curated by real travelers.",
  };
}

/**
 * WebSite schema with SearchAction — enables Google sitelinks search box.
 * Render once on the homepage.
 */
export function generateWebSiteJsonLd(locale: Locale) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Tripflowy",
    url: BASE_URL,
    inLanguage: locale === "ko" ? "ko-KR" : "en-US",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${BASE_URL}/posts?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

export function generateCourseJsonLd(course: DayCourse, locale: Locale) {
  return {
    "@context": "https://schema.org",
    "@type": "TouristTrip",
    name: course.title[locale],
    description: course.summary[locale],
    touristType: course.travelerTypes.join(", "),
    url: `${BASE_URL}${locale === "ko" ? "/ko" : ""}/courses/${course.id}`,
    itinerary: {
      "@type": "ItemList",
      itemListElement: course.activities.map((a, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: a.title[locale],
        description: a.description[locale],
      })),
    },
  };
}

export function generateItineraryJsonLd(itinerary: GeneratedItinerary, locale: Locale, cityNames: string[]) {
  return {
    "@context": "https://schema.org",
    "@type": "TravelAction",
    name: `${cityNames.join(" + ")} ${itinerary.duration}-Day Itinerary`,
    description: `Auto-generated ${itinerary.duration}-day itinerary for ${cityNames.join(", ")}`,
    inLanguage: locale === "ko" ? "ko-KR" : "en-US",
    location: cityNames.map((name) => ({
      "@type": "Place",
      name,
    })),
  };
}

export function generateBreadcrumbJsonLd(
  items: { name: string; url?: string }[]
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      ...(item.url ? { item: item.url } : {}),
    })),
  };
}

/**
 * CollectionPage schema — use on listing pages (e.g. /posts, /courses)
 * to help Google understand the page lists multiple items.
 */
export function generateCollectionPageJsonLd(params: {
  name: string;
  description: string;
  url: string;
  locale: Locale;
  items: { name: string; url: string }[];
}) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: params.name,
    description: params.description,
    url: params.url,
    inLanguage: params.locale === "ko" ? "ko-KR" : "en-US",
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: params.items.length,
      itemListElement: params.items.map((item, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: item.name,
        url: item.url,
      })),
    },
  };
}

export function generateArticleJsonLd(post: BlogPost, locale: Locale) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title[locale],
    description: post.excerpt[locale],
    author: {
      "@type": "Organization",
      name: "Tripflowy",
      url: BASE_URL,
    },
    publisher: {
      "@type": "Organization",
      name: "Tripflowy",
      url: BASE_URL,
      logo: {
        "@type": "ImageObject",
        url: `${BASE_URL}/logo-square-color.png`,
      },
    },
    datePublished: post.publishedAt,
    ...(post.updatedAt ? { dateModified: post.updatedAt } : {}),
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${BASE_URL}/${locale === "ko" ? "ko/" : ""}posts/${post.slug}`,
    },
    ...(post.coverImage
      ? { image: { "@type": "ImageObject", url: `${BASE_URL}${post.coverImage}` } }
      : {}),
    inLanguage: locale === "ko" ? "ko-KR" : "en-US",
  };
}

export function generateFaqJsonLd(faqs: FAQ[], locale: Locale) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question[locale],
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer[locale],
      },
    })),
  };
}
