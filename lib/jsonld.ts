import type { DayCourse, FAQ, Locale, GeneratedItinerary, BlogPost, Tour, Hotel } from "@/types";
import { getAuthor } from "@/lib/authors";
import { META_DESCRIPTIONS } from "@/content/brand";

const BASE_URL = "https://www.tripflowy.com";

/**
 * Organization schema — enables Google brand knowledge panel.
 * Render once on the homepage.
 */
export function generateOrganizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "TripFlowy",
    alternateName: "트플",
    url: BASE_URL,
    logo: `${BASE_URL}/logo-square-color.png`,
    description: "Verified travel itinerary templates built from on-site experience across Asia, Europe, and beyond.",
    email: "hello@tripflowy.com",
    contactPoint: {
      "@type": "ContactPoint",
      email: "hello@tripflowy.com",
      contactType: "customer service",
      availableLanguage: ["English", "Korean"],
    },
    sameAs: [
      "https://www.tripflowy.com",
    ],
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
    name: "TripFlowy",
    alternateName: "트플",
    url: BASE_URL,
    inLanguage: locale === "ko" ? "ko-KR" : "en-US",
    description: locale === "ko"
      ? META_DESCRIPTIONS.homeKo
      : "Auto-generate day-by-day travel itineraries by choosing your destination, duration, and travel style",
    publisher: { "@type": "Organization", name: "TripFlowy", url: BASE_URL },
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

export function generateArticleJsonLd(post: BlogPost, locale: Locale, cityLabel?: string, wordCount?: number) {
  const author = getAuthor(post.authorId);
  return {
    "@context": "https://schema.org",
    "@type": ["Article", "TravelGuide"],
    headline: post.title[locale],
    description: post.excerpt[locale],
    author: {
      "@type": "Person",
      name: author.name[locale],
      ...(author.nickname ? { alternateName: author.nickname[locale] } : {}),
      jobTitle: author.role[locale],
      description: author.bio[locale],
      knowsAbout: author.expertise,
      worksFor: {
        "@type": "Organization",
        name: "TripFlowy",
        url: BASE_URL,
      },
      ...(author.url ? { url: author.url } : {}),
      ...(author.sameAs?.length ? { sameAs: author.sameAs } : {}),
      ...(author.image ? { image: `${BASE_URL}${author.image}` } : {}),
    },
    publisher: {
      "@type": "Organization",
      name: "TripFlowy",
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
    ...(cityLabel ? { about: { "@type": "Place", name: cityLabel } } : {}),
    ...(wordCount ? { wordCount, timeRequired: `PT${Math.max(1, Math.ceil(wordCount / 200))}M` } : {}),
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
    speakable: {
      "@type": "SpeakableSpecification",
      cssSelector: [".faq-question", ".faq-answer"],
    },
  };
}

/**
 * HowTo schema — "How TripFlowy works" 3-step process on homepage.
 * Helps Google show rich results and AI engines understand the workflow.
 */
export function generateHowToJsonLd(locale: Locale, steps: { name: string; text: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: locale === "ko" ? "TripFlowy로 여행 일정 만드는 법" : "How to plan a trip with TripFlowy",
    description: locale === "ko"
      ? "도시, 기간, 스타일을 선택하면 자동으로 하루 코스 기반 여행 일정을 만들어줍니다."
      : "Choose your destination, duration, and travel style to auto-generate a day-by-day itinerary.",
    step: steps.map((s, i) => ({
      "@type": "HowToStep",
      position: i + 1,
      name: s.name,
      text: s.text,
    })),
  };
}

/**
 * ItemList schema for destinations — helps search engines and AI understand
 * which cities/countries TripFlowy covers.
 */
export function generateDestinationItemListJsonLd(
  destinations: { name: string; url: string }[],
) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "TripFlowy Destinations",
    numberOfItems: destinations.length,
    itemListElement: destinations.map((d, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: d.name,
      url: d.url,
    })),
  };
}

/**
 * WebApplication schema — planner page. Helps AI engines classify the tool.
 */
export function generateWebApplicationJsonLd(locale: Locale) {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "TripFlowy Trip Planner",
    alternateName: "트플 여행 플래너",
    url: `${BASE_URL}${locale === "ko" ? "/ko" : ""}/planner`,
    applicationCategory: "TravelApplication",
    operatingSystem: "Any",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    description: locale === "ko"
      ? "도시, 기간, 여행 스타일을 선택하면 자동으로 맞춤 일정을 생성합니다. 항공·숙소·현지 비용 견적까지 한 번에."
      : "Select your destination, duration, and travel style to auto-generate a personalized day-by-day itinerary with flight, hotel, and local cost estimates.",
    inLanguage: locale === "ko" ? "ko-KR" : "en-US",
    provider: { "@type": "Organization", name: "TripFlowy", url: BASE_URL },
  };
}

/**
 * Product schema for individual tours — enables Google rich results
 * with price, rating, and availability.
 */
export function generateTourJsonLd(tour: Tour, locale: Locale) {
  return {
    "@context": "https://schema.org",
    "@type": "TouristAttraction",
    name: tour.title[locale],
    description: tour.description[locale],
    url: tour.affiliateUrl,
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: tour.rating,
      reviewCount: tour.reviewCount,
      bestRating: 5,
    },
  };
}

/**
 * LodgingBusiness schema for individual hotels — enables Google rich results
 * with rating and location.
 */
export function generateHotelJsonLd(hotel: Hotel, locale: Locale) {
  return {
    "@context": "https://schema.org",
    "@type": "LodgingBusiness",
    name: hotel.name,
    description: hotel.description[locale],
    url: hotel.affiliateUrl,
    address: {
      "@type": "PostalAddress",
      addressLocality: hotel.destinationLabel[locale],
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: hotel.rating,
      reviewCount: hotel.reviewCount,
      bestRating: 5,
    },
    priceRange: hotel.priceRange,
  };
}

/**
 * Trip schema for planner results — helps AI engines extract structured
 * itinerary data from the planner output.
 */
export function generateTripJsonLd(itinerary: GeneratedItinerary, locale: Locale, cityLabels: string[]) {
  return {
    "@context": "https://schema.org",
    "@type": "Trip",
    name: locale === "ko"
      ? `${cityLabels.join(" + ")} ${itinerary.duration}일 여행`
      : `${cityLabels.join(" + ")} ${itinerary.duration}-Day Trip`,
    description: locale === "ko"
      ? `${cityLabels.join(", ")} ${itinerary.duration}일 맞춤 여행 일정`
      : `Personalized ${itinerary.duration}-day itinerary for ${cityLabels.join(", ")}`,
    numberOfDays: itinerary.duration,
    itinerary: {
      "@type": "ItemList",
      numberOfItems: itinerary.days.length,
      itemListElement: itinerary.days.map((day) => ({
        "@type": "ListItem",
        position: day.dayNumber,
        item: {
          "@type": "TouristTrip",
          name: day.course.title[locale],
          description: day.course.summary[locale],
          touristType: itinerary.travelerType,
        },
      })),
    },
    provider: { "@type": "Organization", name: "TripFlowy", url: BASE_URL },
  };
}
