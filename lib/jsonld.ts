import type { Itinerary, FAQ, Locale } from "@/types";

export function generateItineraryJsonLd(itin: Itinerary, locale: Locale) {
  const totalBudgetMin = itin.budget?.reduce((s, b) => s + b.min, 0);
  const totalBudgetMax = itin.budget?.reduce((s, b) => s + b.max, 0);

  return {
    "@context": "https://schema.org",
    "@type": "TravelAction",
    name: itin.title[locale],
    description: itin.summary[locale],
    location: {
      "@type": "Place",
      name: itin.destinationLabel[locale],
    },
    ...(totalBudgetMin && totalBudgetMax
      ? {
          offers: {
            "@type": "AggregateOffer",
            lowPrice: totalBudgetMin,
            highPrice: totalBudgetMax,
            priceCurrency: itin.budget?.[0]?.currency ?? "USD",
          },
        }
      : {}),
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
