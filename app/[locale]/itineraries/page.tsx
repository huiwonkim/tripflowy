import { redirect } from "next/navigation";

interface PageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<Record<string, string>>;
}

export default async function ItinerariesPage({ params, searchParams }: PageProps) {
  const { locale } = await params;
  const sp = await searchParams;
  const query = new URLSearchParams(sp).toString();
  const prefix = locale === "ko" ? "/ko" : "";
  redirect(`${prefix}/planner${query ? `?${query}` : ""}`);
}
