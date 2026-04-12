import type { Metadata } from "next";
import { generateBreadcrumbJsonLd, generateWebApplicationJsonLd } from "@/lib/jsonld";
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
    title: isKo
      ? "여행 플래너 — 자동 일정 생성"
      : "Trip Planner — Auto-Generate Itineraries",
    description: isKo
      ? "출발 도시, 여행 기간, 선호 스타일을 선택하면 자동으로 일정이 만들어집니다. 일본, 베트남, 유럽, 미국 등 30+ 도시 지원. 항공·숙소·현지 비용까지 한 번에 확인."
      : "Pick your destination, trip duration, and travel style — get a personalized day-by-day itinerary instantly. Supports 30+ cities across Asia, Europe, and the US with flight, hotel, and local cost estimates.",
    keywords: isKo
      ? "여행 플래너, 일정 자동 생성, 여행 일정 만들기, 트플, TripFlowy"
      : "trip planner, auto itinerary, travel planner, TripFlowy",
    openGraph: {
      title: isKo ? "여행 플래너 — 자동 일정 생성 | TripFlowy" : "Trip Planner — Auto-Generate Itineraries | TripFlowy",
      description: isKo
        ? "도시, 기간, 스타일만 선택하면 검증된 여행 일정이 자동으로 만들어집니다."
        : "Select destination, duration, and style to auto-generate verified travel itineraries.",
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
