"use client";

import { useCallback, useEffect, useRef } from "react";
import { APIProvider, Map, useMap, useMapsLibrary } from "@vis.gl/react-google-maps";
import type { GeneratedDay, ActivityType, Locale } from "@/types";

const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? "";

const typeColors: Record<ActivityType, string> = {
  transport: "#6B7280",
  sightseeing: "#2563EB",
  dining: "#F59E0B",
  accommodation: "#8B5CF6",
  tour: "#10B981",
  free: "#EC4899",
  beach: "#06B6D4",
  shopping: "#F97316",
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

interface Point {
  lat: number;
  lng: number;
  label: string;
  type: ActivityType;
  dayNum: number;
  order: number;
}

function collectPoints(days: GeneratedDay[], locale: Locale): Point[] {
  const points: Point[] = [];
  let order = 1;
  for (const day of days) {
    for (const activity of day.course.activities) {
      if (activity.location) {
        points.push({
          lat: activity.location.lat,
          lng: activity.location.lng,
          label: activity.title[locale],
          type: activity.type,
          dayNum: day.dayNumber,
          order: order++,
        });
      }
    }
  }
  return points;
}

/** Inner component that uses the map instance */
function MapContent({ points, locale }: { points: Point[]; locale: Locale }) {
  const map = useMap();
  const coreLib = useMapsLibrary("core");
  const markerLib = useMapsLibrary("marker");
  const markersRef = useRef<google.maps.marker.AdvancedMarkerElement[]>([]);
  const polylineRef = useRef<google.maps.Polyline | null>(null);

  useEffect(() => {
    if (!map || !coreLib || !markerLib || points.length === 0) return;

    // Clean up previous markers
    markersRef.current.forEach((m) => (m.map = null));
    markersRef.current = [];
    if (polylineRef.current) {
      polylineRef.current.setMap(null);
      polylineRef.current = null;
    }

    const bounds = new coreLib.LatLngBounds();
    const path: google.maps.LatLngLiteral[] = [];

    for (const pt of points) {
      const pos = { lat: pt.lat, lng: pt.lng };
      bounds.extend(pos);
      path.push(pos);

      const color = typeColors[pt.type] ?? "#6B7280";
      const el = document.createElement("div");
      el.style.cssText = `
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
        cursor: pointer;
      `;
      el.textContent = String(pt.order);

      const marker = new markerLib.AdvancedMarkerElement({
        map,
        position: pos,
        content: el,
        title: `${pt.order}. ${pt.label}`,
      });

      // Info window on click
      const typeLabel = typeLabels[pt.type]?.[locale] ?? pt.type;
      const infoWindow = new google.maps.InfoWindow({
        content: `<div style="font-size:13px;max-width:200px"><b>${pt.order}. ${pt.label}</b><br/><span style="color:${color};font-weight:600">${typeLabel}</span><br/>Day ${pt.dayNum}</div>`,
      });
      marker.addListener("click", () => {
        infoWindow.open({ anchor: marker, map });
      });

      markersRef.current.push(marker);
    }

    // Polyline
    if (path.length > 1) {
      polylineRef.current = new google.maps.Polyline({
        path,
        strokeColor: "#2563EB",
        strokeWeight: 2,
        strokeOpacity: 0.5,
        geodesic: true,
        map,
      });
    }

    // Fit bounds
    if (points.length === 1) {
      map.setCenter(path[0]);
      map.setZoom(14);
    } else {
      map.fitBounds(bounds, { top: 40, right: 40, bottom: 40, left: 40 });
    }

    return () => {
      markersRef.current.forEach((m) => (m.map = null));
      markersRef.current = [];
      if (polylineRef.current) {
        polylineRef.current.setMap(null);
        polylineRef.current = null;
      }
    };
  }, [map, coreLib, markerLib, points, locale]);

  return null;
}

export function ItineraryMap({ days, locale, mapId = "main", height = 400 }: ItineraryMapProps) {
  const points = collectPoints(days, locale);

  if (!API_KEY) {
    // Fallback: no API key — show placeholder
    return (
      <div style={{ height: `${height}px` }} className="w-full rounded-2xl border border-gray-200 bg-gray-50 flex items-center justify-center">
        <p className="text-sm text-gray-400">
          {locale === "ko" ? "지도를 표시하려면 Google Maps API 키가 필요합니다" : "Google Maps API key required"}
        </p>
      </div>
    );
  }

  if (points.length === 0) return null;

  const center = { lat: points[0].lat, lng: points[0].lng };

  // Collect used types for legend
  const usedTypes = new Set<ActivityType>();
  for (const day of days) {
    for (const a of day.course.activities) {
      usedTypes.add(a.type);
    }
  }

  return (
    <div className="space-y-3">
      <APIProvider apiKey={API_KEY}>
        <Map
          style={{ width: "100%", height: `${height}px`, borderRadius: "16px" }}
          defaultCenter={center}
          defaultZoom={12}
          gestureHandling="cooperative"
          disableDefaultUI={false}
          mapId={mapId}
        >
          <MapContent points={points} locale={locale} />
        </Map>
      </APIProvider>

      {/* Legend */}
      <div className="flex flex-wrap gap-3 px-1">
        {Array.from(usedTypes).map((type) => (
          <div key={type} className="flex items-center gap-1.5 text-xs text-gray-600">
            <span className="w-3 h-3 rounded-full inline-block" style={{ backgroundColor: typeColors[type] }} />
            {typeLabels[type]?.[locale] ?? type}
          </div>
        ))}
      </div>
    </div>
  );
}
