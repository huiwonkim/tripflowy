import type { DayCourse, FAQ, Locale, GeneratedItinerary, CityInfo, BlogPost } from "@/types";

export function generateCourseJsonLd(course: DayCourse, locale: Locale) {
  return {
    "@context": "https://schema.org",
    "@type": "TouristTrip",
    name: course.title[locale],
    description: course.summary[locale],
    touristType: course.travelerTypes.join(", "),
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

export function generateArticleJsonLd(post: BlogPost, locale: Locale) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title[locale],
    description: post.excerpt[locale],
    author: {
      "@type": "Organization",
      name: "Tripflowy",
      url: "https://tripflowy.com",
    },
    publisher: {
      "@type": "Organization",
      name: "Tripflowy",
      url: "https://tripflowy.com",
      logo: {
        "@type": "ImageObject",
        url: "https://tripflowy.com/logo-square-color.png",
      },
    },
    datePublished: post.publishedAt,
    ...(post.updatedAt ? { dateModified: post.updatedAt } : {}),
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://tripflowy.com/${locale === "ko" ? "ko/" : ""}posts/${post.slug}`,
    },
    ...(post.coverImage
      ? { image: { "@type": "ImageObject", url: `https://tripflowy.com${post.coverImage}` } }
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
