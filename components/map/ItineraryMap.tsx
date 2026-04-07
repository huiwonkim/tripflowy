"use client";

import { useEffect, useRef } from "react";
import type { GeneratedDay, ActivityType, Locale } from "@/types";

// Activity type → marker color mapping
const typeColors: Record<ActivityType, string> = {
  transport: "#6B7280",   // gray
  sightseeing: "#2563EB", // blue
  dining: "#F59E0B",      // amber
  accommodation: "#8B5CF6", // purple
  tour: "#10B981",        // green
  free: "#EC4899",        // pink
  beach: "#06B6D4",       // cyan
  shopping: "#F97316",    // orange
};

const typeLabels: Record<ActivityType, { en: string; ko: string }> = {
  sightseeing: { en: "Sightseeing", ko: "관광" },
  dining: { en: "Restaurant", ko: "식당" },
  tour: { en: "Tour", ko: "투어" },
  transport: { en: "Transport", ko: "이동" },
  accommodation: { en: "Hotel", ko: "숙소" },
  free: { en: "Free time", ko: "자유시간" },
  beach: { en: "Beach", ko: "해변" },
  shopping: { en: "Shopping", ko: "쇼핑" },
};

interface ItineraryMapProps {
  days: GeneratedDay[];
  locale: Locale;
  mapId?: string;
  height?: number;
}

export function ItineraryMap({ days, locale, mapId = "main", height = 400 }: ItineraryMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    // Dynamically import leaflet to avoid SSR issues
    import("leaflet").then((L) => {
      // Fix default icon path issue
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
        iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
        shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
      });

      // Collect all activity locations with GPS
      const points: { lat: number; lng: number; label: string; type: ActivityType; dayNum: number; order: number }[] = [];
      let globalOrder = 1;
      for (const day of days) {
        for (const activity of day.course.activities) {
          if (activity.location) {
            points.push({
              lat: activity.location.lat,
              lng: activity.location.lng,
              label: activity.title[locale],
              type: activity.type,
              dayNum: day.dayNumber,
              order: globalOrder++,
            });
          }
        }
      }

      if (points.length === 0) return;

      // Create map
      const map = L.map(mapRef.current!, {
        scrollWheelZoom: false,
      });
      mapInstanceRef.current = map;

      // OpenStreetMap tiles
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 18,
      }).addTo(map);

      // Add markers
      const latLngs: L.LatLngExpression[] = [];
      for (const pt of points) {
        const color = typeColors[pt.type] ?? "#6B7280";
        const icon = L.divIcon({
          className: "custom-marker",
          html: `<div style="
            background: ${color};
            color: white;
            width: 28px;
            height: 28px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 12px;
            font-weight: 700;
            border: 2px solid white;
            box-shadow: 0 2px 6px rgba(0,0,0,0.3);
          ">${pt.order}</div>`,
          iconSize: [28, 28],
          iconAnchor: [14, 14],
        });

        const typeLabel = typeLabels[pt.type]?.[locale] ?? pt.type;
        L.marker([pt.lat, pt.lng], { icon })
          .addTo(map)
          .bindPopup(`<b>${pt.order}. ${pt.label}</b><br/><span style="color:${color};font-weight:600">${typeLabel}</span><br/>Day ${pt.dayNum}`);

        latLngs.push([pt.lat, pt.lng]);
      }

      // Draw route polyline
      if (latLngs.length > 1) {
        L.polyline(latLngs, {
          color: "#2563EB",
          weight: 2,
          opacity: 0.5,
          dashArray: "8, 8",
        }).addTo(map);
      }

      // Fit bounds
      const bounds = L.latLngBounds(latLngs);
      map.fitBounds(bounds, { padding: [40, 40] });
    });

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [days, locale, mapId]);

  // Collect legend types
  const usedTypes = new Set<ActivityType>();
  for (const day of days) {
    for (const a of day.course.activities) {
      usedTypes.add(a.type);
    }
  }

  return (
    <div className="space-y-3">
      {/* Map */}
      <div ref={mapRef} style={{ height: `${height}px` }} className="w-full rounded-2xl overflow-hidden border border-gray-200 z-0" />

      {/* Legend */}
      <div className="flex flex-wrap gap-3 px-1">
        {Array.from(usedTypes).map((type) => (
          <div key={type} className="flex items-center gap-1.5 text-xs text-gray-600">
            <span
              className="w-3 h-3 rounded-full inline-block"
              style={{ backgroundColor: typeColors[type] }}
            />
            {typeLabels[type]?.[locale] ?? type}
          </div>
        ))}
      </div>
    </div>
  );
}
