import type { Metadata } from "next";
import { Geist } from "next/font/google";
import Script from "next/script";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

const GA_MEASUREMENT_ID = "G-3Y0XB545M3";
const ADSENSE_CLIENT_ID = "ca-pub-1445087798097280";

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
    metadataBase: new URL("https://www.tripflowy.com"),
    title: {
      default: t("title"),
      template: "%s | TripFlowy",
    },
    description: t("description"),
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
    icons: {
      icon: "/logo-square-dark.png",
      apple: "/logo-square-dark.png",
    },
    openGraph: {
      siteName: "TripFlowy",
      type: "website",
      locale: locale === "ko" ? "ko_KR" : "en_US",
      images: [{ url: "/logo-square-dark.png", width: 512, height: 512, alt: "TripFlowy" }],
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
        "google-adsense-account": ADSENSE_CLIENT_ID,
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
      <head>
        <link rel="alternate" type="application/rss+xml" title="Tripflowy" href="/rss.xml" />
      </head>
      <body className="min-h-full flex flex-col font-[family-name:var(--font-geist)] antialiased bg-[#f8fafc] text-[#0f172a]">
        {/* Google Analytics 4 (gtag.js) */}
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
          strategy="afterInteractive"
        />
        <Script id="ga4-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_MEASUREMENT_ID}');
          `}
        </Script>

        <NextIntlClientProvider messages={messages}>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
