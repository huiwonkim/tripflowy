import type { Tour } from "@/types";
import { Clock, Star, ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { styleLabel } from "@/lib/utils";

interface TourCardProps {
  tour: Tour;
  locale?: "en" | "ko";
}

export function TourCard({ tour, locale = "en" }: TourCardProps) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-md hover:border-gray-200 transition-all group">
      {/* Cover */}
      <div className={`h-40 bg-gradient-to-br ${tour.coverGradient} relative`}>
        <div className="absolute inset-0 bg-black/15" />
        <div className="absolute bottom-3 left-3">
          <span className="bg-white/25 backdrop-blur-sm text-white text-xs font-semibold px-2.5 py-1 rounded-full">
            {tour.destinationLabel[locale]}
          </span>
        </div>
        <div className="absolute top-3 right-3">
          <span className="bg-white text-gray-900 text-xs font-bold px-2.5 py-1 rounded-full shadow-sm">
            from ${tour.price}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="font-semibold text-gray-900 text-[15px] mb-1 leading-snug">
          {tour.title[locale]}
        </h3>

        <div className="flex items-center gap-3 mb-3 text-xs text-gray-500">
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            {tour.durationLabel[locale]}
          </span>
          <span className="flex items-center gap-1 text-amber-500">
            <Star className="w-3.5 h-3.5 fill-current" />
            {tour.rating} ({tour.reviewCount.toLocaleString()})
          </span>
        </div>

        <p className="text-sm text-gray-500 leading-relaxed mb-4 line-clamp-2">
          {tour.description[locale]}
        </p>

        <div className="flex flex-wrap gap-1.5 mb-4">
          {tour.style.map((s) => (
            <Badge key={s} variant="blue">
              {styleLabel(s, locale)}
            </Badge>
          ))}
        </div>

        <a
          href={tour.affiliateUrl}
          target="_blank"
          rel="noopener noreferrer sponsored"
          className="w-full flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-600 text-white text-sm font-semibold py-2.5 px-4 rounded-xl transition-colors"
        >
          Book This Tour
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>
    </div>
  );
}
