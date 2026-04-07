import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { MapPin } from "lucide-react";

export async function Footer() {
  const t = await getTranslations("footer");

  const columns = [
    {
      heading: t("itineraries"),
      links: [
        { href: "/itineraries?destination=danang" as const, label: "Da Nang" },
        { href: "/itineraries?destination=bangkok" as const, label: "Bangkok" },
        { href: "/itineraries?destination=bali" as const, label: "Bali" },
        { href: "/itineraries?destination=tokyo" as const, label: "Tokyo" },
      ],
    },
    {
      heading: t("tools"),
      links: [
        { href: "/planner" as const, label: t("tripPlanner") },
        { href: "/itineraries" as const, label: t("allItineraries") },
        { href: "/tours" as const, label: t("toursActivities") },
        { href: "/hotels" as const, label: t("whereToStay") },
      ],
    },
    {
      heading: t("travelStyles"),
      links: [
        { href: "/itineraries?style=relaxed" as const, label: t("relaxed") },
        { href: "/itineraries?style=efficient" as const, label: t("efficient") },
        { href: "/itineraries?style=activity-focused" as const, label: t("activityFocused") },
        { href: "/itineraries?style=hotel-focused" as const, label: t("hotelFocused") },
      ],
    },
  ];

  return (
    <footer className="bg-gray-900 text-gray-400 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div>
            <Link href="/" className="flex items-center gap-2 text-white font-bold text-lg mb-4">
              <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center">
                <MapPin className="w-4 h-4 text-white" strokeWidth={2.5} />
              </div>
              Tripflowy
            </Link>
            <p className="text-sm leading-relaxed">{t("tagline")}</p>
          </div>

          {columns.map((col) => (
            <div key={col.heading}>
              <h4 className="text-white text-sm font-semibold mb-4">{col.heading}</h4>
              <ul className="space-y-2">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-sm hover:text-white transition-colors">{link.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-sm">
          <p>{t("copyright", { year: new Date().getFullYear() })}</p>
          <p className="text-gray-500">{t("affiliateDisclosure")}</p>
        </div>
      </div>
    </footer>
  );
}
