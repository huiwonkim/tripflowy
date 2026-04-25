import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Admin · TripFlowy",
  robots: { index: false, follow: false, nocache: true },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body className="min-h-screen bg-slate-50 text-slate-900 antialiased">
        <header className="border-b border-slate-200 bg-white">
          <div className="mx-auto max-w-6xl px-6 py-4 flex items-center justify-between">
            <Link href="/admin/analytics" className="font-semibold tracking-tight">
              TripFlowy Admin
            </Link>
            <nav className="text-sm text-slate-600">
              <Link href="/admin/analytics" className="hover:text-slate-900">
                Analytics
              </Link>
            </nav>
          </div>
        </header>
        <main className="mx-auto max-w-6xl px-6 py-8">{children}</main>
      </body>
    </html>
  );
}
