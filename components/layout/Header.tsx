"use client";

import { useLocale, useTranslations } from "next-intl";
import { Link, usePathname, useRouter } from "@/i18n/navigation";
import { useState } from "react";
import Image from "next/image";
import { Menu, X, Globe } from "lucide-react";

export function Header() {
  const locale = useLocale();
  const t = useTranslations("nav");
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  const nav = [
    { href: "/planner" as const, label: t("planner") },
    { href: "/tours" as const, label: t("tours") },
    { href: "/hotels" as const, label: t("hotels") },
  ];

  function toggleLocale() {
    const nextLocale = locale === "en" ? "ko" : "en";
    router.replace(pathname, { locale: nextLocale });
  }

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center">
            <Image src="/logo-full.png" alt="Tripflowy" width={160} height={40} className="h-8 w-auto" priority />
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {nav.map((item) => (
              <Link key={item.href} href={item.href}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${pathname.startsWith(item.href) ? "bg-blue-50 text-blue-700" : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"}`}>
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-3">
            <button onClick={toggleLocale} className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 transition-colors px-3 py-1.5 rounded-lg hover:bg-gray-50">
              <Globe className="w-4 h-4" />
              <span>{locale === "en" ? "KO" : "EN"}</span>
            </button>
            <Link href="/planner" className="bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
              {t("planMyTrip")}
            </Link>
          </div>

          <button className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-50" onClick={() => setMobileOpen((o) => !o)} aria-label="Toggle menu">
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white px-4 py-4 space-y-1">
          {nav.map((item) => (
            <Link key={item.href} href={item.href} onClick={() => setMobileOpen(false)}
              className={`flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-colors ${pathname.startsWith(item.href) ? "bg-blue-50 text-blue-700" : "text-gray-700 hover:bg-gray-50"}`}>
              {item.label}
            </Link>
          ))}
          <div className="flex items-center gap-3 pt-3 border-t border-gray-100 mt-3">
            <button onClick={() => { toggleLocale(); setMobileOpen(false); }} className="flex items-center gap-1.5 text-sm text-gray-500 px-4 py-2.5 rounded-lg hover:bg-gray-50">
              <Globe className="w-4 h-4" />{locale === "en" ? "한국어" : "English"}
            </button>
            <Link href="/planner" onClick={() => setMobileOpen(false)} className="flex-1 flex justify-center bg-blue-600 text-white text-sm font-medium px-4 py-2.5 rounded-lg hover:bg-blue-700 transition-colors">
              {t("planMyTrip")}
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
