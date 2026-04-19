import type { Hotel } from "@/types";
import { Star, MapPin, ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { CoverImage } from "@/components/ui/CoverImage";
import { priceRangeLabel, styleLabel } from "@/lib/utils";

interface HotelCardProps {
  hotel: Hotel;
  locale?: "en" | "ko";
  context?: string; // e.g. "Best for this relaxed route"
}

export function HotelCard({ hotel, locale = "en", context }: HotelCardProps) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-md hover:border-gray-200 transition-all">
      {/* Cover */}
      <CoverImage
        alt={hotel.name}
        gradient={hotel.coverGradient}
        initial={hotel.destination.charAt(0).toUpperCase()}
      >
        <div className="absolute bottom-3 left-3">
          <span className="bg-white/25 backdrop-blur-sm text-white text-xs font-semibold px-2.5 py-1 rounded-full">
            {hotel.destinationLabel[locale]}
          </span>
        </div>
        <div className="absolute top-3 right-3">
          <span className="bg-white text-gray-900 text-xs font-bold px-2.5 py-1 rounded-full shadow-sm">
            {hotel.priceRange} · {priceRangeLabel(hotel.priceRange)}
          </span>
        </div>
      </CoverImage>

      {/* Content */}
      <div className="p-5">
        {context && (
          <p className="text-xs font-medium text-blue-600 mb-2">{context}</p>
        )}

        <h3 className="font-semibold text-gray-900 text-[15px] mb-1">{hotel.name}</h3>

        <div className="flex items-center gap-3 mb-3 text-xs text-gray-500">
          <span className="flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5" />
            {hotel.location[locale]}
          </span>
          <span className="flex items-center gap-1 text-amber-500">
            <Star className="w-3.5 h-3.5 fill-current" />
            {hotel.rating} ({hotel.reviewCount.toLocaleString()})
          </span>
        </div>

        <p className="text-sm text-gray-500 leading-relaxed mb-4 line-clamp-2">
          {hotel.description[locale]}
        </p>

        <div className="flex flex-wrap gap-1.5 mb-4">
          {hotel.style.map((s) => (
            <Badge key={s} variant="green">
              {styleLabel(s, locale)}
            </Badge>
          ))}
        </div>

        <a
          href={hotel.affiliateUrl}
          target="_blank"
          rel="noopener noreferrer sponsored"
          className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold py-2.5 px-4 rounded-xl transition-colors"
        >
          Check Availability
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>
    </div>
  );
}
