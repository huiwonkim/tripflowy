import type { Metadata } from "next";

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

export default function PlannerLayout({ children }: LayoutProps) {
  return children;
}
