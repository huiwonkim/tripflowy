import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata" });
  return {
    title: {
      default: t("title"),
      template: "%s | Tripflowy",
    },
    description: t("description"),
    icons: {
      icon: "/logo-square-dark.png",
      apple: "/logo-square-dark.png",
    },
    openGraph: {
      siteName: "Tripflowy",
      type: "website",
      locale: locale === "ko" ? "ko_KR" : "en_US",
      images: [{ url: "/logo-square-dark.png", width: 512, height: 512, alt: "Tripflowy" }],
    },
    twitter: {
      card: "summary_large_image",
      images: ["/logo-square-dark.png"],
    },
    alternates: {
      canonical: "/",
      languages: { en: "/", ko: "/ko" },
    },
    verification: {
      other: {
        "naver-site-verification": "49a63fc5aa8b8b14b2e9a62ea493b057f70bae1c",
      },
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!routing.locales.includes(locale as "en" | "ko")) notFound();
  setRequestLocale(locale);

  const messages = await getMessages();

  return (
    <html lang={locale} className={`${geist.variable} h-full`}>
      <body className="min-h-full flex flex-col font-[family-name:var(--font-geist)] antialiased bg-[#f8fafc] text-[#0f172a]">
        <NextIntlClientProvider messages={messages}>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
