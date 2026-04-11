"use client";

import { memo, useEffect, useRef } from "react";
import { APIProvider, Map, useMap, useMapsLibrary } from "@vis.gl/react-google-maps";
import type { GeneratedDay, Locale } from "@/types";
import { countries } from "@/data/destinations";

const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? "";
const MAP_ID = process.env.NEXT_PUBLIC_GOOGLE_MAP_ID ?? "fc366bd3a2a403e93f8f124f";

// Computed once at module load; previously recomputed inside MapContent on
// every render which caused its useEffect to re-run (even when days/locale
// hadn't actually changed), clearing and redrawing markers each time.
const ALL_CITIES = countries.flatMap((c) => c.cities);

const dayColors = [
  "#2563EB", // blue
  "#10B981", // green
  "#F59E0B", // amber
  "#EF4444", // red
  "#8B5CF6", // purple
  "#EC4899", // pink
  "#06B6D4", // cyan
  "#F97316", // orange
  "#6366F1", // indigo
  "#14B8A6", // teal
];

interface OverviewMapProps {
  days: GeneratedDay[];
  locale: Locale;
}

function MapContent({ days, locale }: { days: GeneratedDay[]; locale: Locale }) {
  const map = useMap();
  const coreLib = useMapsLibrary("core");
  const markerLib = useMapsLibrary("marker");
  const circlesRef = useRef<google.maps.Circle[]>([]);
  const markersRef = useRef<google.maps.marker.AdvancedMarkerElement[]>([]);

  useEffect(() => {
    if (!map || !coreLib || !markerLib) return;

    // Cleanup
    circlesRef.current.forEach((c) => c.setMap(null));
    circlesRef.current = [];
    markersRef.current.forEach((m) => (m.map = null));
    markersRef.current = [];

    const bounds = new coreLib.LatLngBounds();

    days.forEach((day, i) => {
      const locations = day.course.activities
        .filter((a) => a.location)
        .map((a) => a.location!);

      if (locations.length === 0) return;

      // Calculate center of this day's activities
      const centerLat = locations.reduce((sum, l) => sum + l.lat, 0) / locations.length;
      const centerLng = locations.reduce((sum, l) => sum + l.lng, 0) / locations.length;
      const center = { lat: centerLat, lng: centerLng };

      // Calculate radius based on spread of activities (min 1500m)
      let maxDist = 1500;
      for (const loc of locations) {
        const dist = haversineMeters(center, loc);
        if (dist > maxDist) maxDist = dist;
      }
      const radius = Math.max(maxDist * 1.3, 2000); // 30% padding, min 2km

      const color = dayColors[i % dayColors.length];

      // Draw circle
      const circle = new google.maps.Circle({
        map,
        center,
        radius,
        fillColor: color,
        fillOpacity: 0.15,
        strokeColor: color,
        strokeOpacity: 0.4,
        strokeWeight: 2,
      });
      circlesRef.current.push(circle);

      // Day label marker
      const cityLabel = ALL_CITIES.find((c) => c.id === day.city)?.label[locale] ?? day.city;
      const el = document.createElement("div");
      el.style.cssText = `
        background: ${color};
        color: white;
        padding: 4px 10px;
        border-radius: 20px;
        font-size: 12px;
        font-weight: 700;
        white-space: nowrap;
        box-shadow: 0 2px 6px rgba(0,0,0,0.2);
        border: 2px solid white;
      `;
      el.textContent = `Day ${day.dayNumber}`;

      const marker = new markerLib.AdvancedMarkerElement({
        map,
        position: center,
        content: el,
        title: `Day ${day.dayNumber}: ${day.course.title[locale]}`,
      });
      markersRef.current.push(marker);

      // Extend bounds
      bounds.extend({ lat: centerLat + radius / 111320, lng: centerLng + radius / (111320 * Math.cos(centerLat * Math.PI / 180)) });
      bounds.extend({ lat: centerLat - radius / 111320, lng: centerLng - radius / (111320 * Math.cos(centerLat * Math.PI / 180)) });
    });

    // Fit bounds
    if (!bounds.isEmpty()) {
      map.fitBounds(bounds, { top: 50, right: 50, bottom: 50, left: 50 });
    }

    return () => {
      circlesRef.current.forEach((c) => c.setMap(null));
      circlesRef.current = [];
      markersRef.current.forEach((m) => (m.map = null));
      markersRef.current = [];
    };
  }, [map, coreLib, markerLib, days, locale]);

  return null;
}

function haversineMeters(a: { lat: number; lng: number }, b: { lat: number; lng: number }): number {
  const R = 6371000;
  const dLat = (b.lat - a.lat) * Math.PI / 180;
  const dLng = (b.lng - a.lng) * Math.PI / 180;
  const sinLat = Math.sin(dLat / 2);
  const sinLng = Math.sin(dLng / 2);
  const h = sinLat * sinLat + Math.cos(a.lat * Math.PI / 180) * Math.cos(b.lat * Math.PI / 180) * sinLng * sinLng;
  return R * 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
}

function OverviewMapInner({ days, locale }: OverviewMapProps) {
  if (!API_KEY) {
    return (
      <div className="w-full h-[300px] rounded-2xl border border-gray-200 bg-gray-50 flex items-center justify-center">
        <p className="text-sm text-gray-400">
          {locale === "ko" ? "지도를 표시하려면 Google Maps API 키가 필요합니다" : "Google Maps API key required"}
        </p>
      </div>
    );
  }

  const firstLocation = days.flatMap((d) => d.course.activities).find((a) => a.location)?.location;
  const center = firstLocation ?? { lat: 16.05, lng: 108.2 };

  return (
    <div className="space-y-2">
      <APIProvider apiKey={API_KEY}>
        <Map
          style={{ width: "100%", height: "300px", borderRadius: "16px" }}
          defaultCenter={center}
          defaultZoom={11}
          gestureHandling="cooperative"
          disableDefaultUI={false}
          mapId={MAP_ID}
        >
          <MapContent days={days} locale={locale} />
        </Map>
      </APIProvider>

      {/* Day color legend */}
      <div className="flex flex-wrap gap-3 px-1">
        {days.map((day, i) => (
          <div key={day.dayNumber} className="flex items-center gap-1.5 text-xs text-gray-600">
            <span className="w-3 h-3 rounded-full inline-block" style={{ backgroundColor: dayColors[i % dayColors.length] }} />
            Day {day.dayNumber}: {day.course.title[locale]}
          </div>
        ))}
      </div>
    </div>
  );
}

// Memoized so parent re-renders (e.g. user editing form fields) don't force
// the map to re-initialize markers / fitBounds when `days` and `locale` are
// still referentially stable.
export const OverviewMap = memo(OverviewMapInner);
