import type { Metadata } from "next";
import { generateBreadcrumbJsonLd, generateWebApplicationJsonLd } from "@/lib/jsonld";
import { PAGE_TITLES, META_DESCRIPTIONS } from "@/content/brand";
import type { Locale } from "@/types";

const BASE_URL = "https://www.tripflowy.com";

interface LayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: LayoutProps): Promise<Metadata> {
  const { locale } = await params;
  const isKo = locale === "ko";
  return {
    title: isKo ? PAGE_TITLES.plannerKo : PAGE_TITLES.plannerEn,
    description: isKo ? META_DESCRIPTIONS.plannerKo : META_DESCRIPTIONS.plannerEn,
    keywords: isKo
      ? "여행 플래너, 검증된 여행 일정, 현장 검증 루트, 트플, TripFlowy"
      : "trip planner, field-tested itinerary, verified travel route, TripFlowy",
    openGraph: {
      title: isKo ? PAGE_TITLES.plannerOgKo : PAGE_TITLES.plannerOgEn,
      description: isKo ? META_DESCRIPTIONS.plannerKo : META_DESCRIPTIONS.plannerEn,
    },
    alternates: {
      canonical: isKo ? "/ko/planner" : "/planner",
      languages: {
        en: "/planner",
        ko: "/ko/planner",
        "x-default": "/planner",
      },
    },
  };
}

export default async function PlannerLayout({ children, params }: LayoutProps) {
  const { locale } = await params;
  const loc = locale as Locale;

  const breadcrumbJsonLd = generateBreadcrumbJsonLd([
    { name: loc === "ko" ? "홈" : "Home", url: `${BASE_URL}${loc === "ko" ? "/ko" : ""}` },
    { name: loc === "ko" ? "여행 플래너" : "Trip Planner", url: `${BASE_URL}${loc === "ko" ? "/ko" : ""}/planner` },
  ]);
  const webAppJsonLd = generateWebApplicationJsonLd(loc);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppJsonLd) }}
      />
      {children}
    </>
  );
}
