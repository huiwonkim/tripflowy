"use client";

import { useEffect, useMemo, useRef } from "react";
import { APIProvider, Map, useMap, useMapsLibrary } from "@vis.gl/react-google-maps";
import { Map as MapIcon } from "lucide-react";
import type { Coordinates, DayActivity, Locale } from "@/types";

const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? "";
const MAP_ID = process.env.NEXT_PUBLIC_GOOGLE_MAP_ID ?? "fc366bd3a2a403e93f8f124f";

interface DayRouteMapProps {
  /** Day's activities in timeline order (already sorted by time). */
  activities: DayActivity[];
  /** Optional accommodation coordinate — rendered as a home anchor at start/end. */
  accommodation?: Coordinates;
  locale: Locale;
  /** 0-indexed day position for color variation. */
  dayIndex?: number;
}

const dayColors = [
  "#2563EB", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6",
  "#EC4899", "#06B6D4", "#F97316", "#6366F1", "#14B8A6",
];

function Content({ activities, accommodation, locale, dayIndex = 0 }: DayRouteMapProps) {
  const map = useMap();
  const coreLib = useMapsLibrary("core");
  const markerLib = useMapsLibrary("marker");
  const markersRef = useRef<google.maps.marker.AdvancedMarkerElement[]>([]);
  const polylineRef = useRef<google.maps.Polyline | null>(null);

  // Extract coordinate sequence (accommodation → activities → accommodation)
  const points = useMemo(() => {
    const acts = activities.filter((a) => a.location).map((a) => a.location!);
    const seq: Coordinates[] = [];
    if (accommodation) seq.push(accommodation);
    seq.push(...acts);
    if (accommodation && acts.length > 0) seq.push(accommodation);
    return { seq, actCount: acts.length };
  }, [activities, accommodation]);

  useEffect(() => {
    if (!map || !coreLib || !markerLib) return;

    // Cleanup previous
    markersRef.current.forEach((m) => (m.map = null));
    markersRef.current = [];
    if (polylineRef.current) {
      polylineRef.current.setMap(null);
      polylineRef.current = null;
    }

    if (points.seq.length === 0) return;

    const bounds = new coreLib.LatLngBounds();
    const color = dayColors[dayIndex % dayColors.length];

    // Accommodation marker (home) — positioned at seq[0] if accommodation present
    let activityStartIdx = 0;
    if (accommodation) {
      const el = document.createElement("div");
      el.style.cssText =
        "width:28px;height:28px;background:#1F2937;color:#fff;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:14px;box-shadow:0 2px 6px rgba(0,0,0,0.3);border:2px solid white;";
      el.textContent = "🏨";
      el.title = locale === "ko" ? "숙소" : "Stay";
      const m = new markerLib.AdvancedMarkerElement({
        map, position: accommodation, content: el,
        title: locale === "ko" ? "숙소" : "Stay",
      });
      markersRef.current.push(m);
      bounds.extend(accommodation);
      activityStartIdx = 1;
    }

    // Numbered markers for activities
    const actLocations = activities.filter((a) => a.location);
    actLocations.forEach((act, i) => {
      if (!act.location) return;
      const el = document.createElement("div");
      el.style.cssText = `width:28px;height:28px;background:${color};color:#fff;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:700;box-shadow:0 2px 6px rgba(0,0,0,0.3);border:2px solid white;`;
      el.textContent = String(i + 1);
      el.title = `${i + 1}. ${act.title[locale]}`;
      const m = new markerLib.AdvancedMarkerElement({
        map, position: act.location, content: el,
        title: `${i + 1}. ${act.title[locale]}`,
      });
      markersRef.current.push(m);
      bounds.extend(act.location);
    });

    // Straight-line polyline between all points
    if (points.seq.length >= 2) {
      polylineRef.current = new google.maps.Polyline({
        map,
        path: points.seq,
        geodesic: false,
        strokeColor: color,
        strokeOpacity: 0.8,
        strokeWeight: 3,
      });
    }

    if (!bounds.isEmpty()) {
      map.fitBounds(bounds, { top: 40, right: 40, bottom: 40, left: 40 });
    }
  }, [map, coreLib, markerLib, points, activities, accommodation, dayIndex, locale]);

  return null;
}

/**
 * Interactive per-day route map: numbered pins for each activity
 * in visit order, connected by straight-line polyline, with the
 * accommodation rendered as a home anchor when provided.
 *
 * Uses simple Polyline (no Google Directions API) for MVP cost reasons.
 * V2 may opt-in to Directions for realistic walking/transit paths.
 */
export function DayRouteMap(props: DayRouteMapProps) {
  const activityCoords = props.activities.filter((a) => a.location);

  // Fallback: if no API key or no coordinates, render a graceful placeholder
  if (!API_KEY || activityCoords.length === 0) {
    return (
      <div className="h-[240px] rounded-xl bg-gray-50 border border-dashed border-gray-200 flex items-center justify-center">
        <div className="text-center px-4">
          <MapIcon className="w-7 h-7 text-gray-300 mx-auto mb-1.5" />
          <p className="text-sm text-gray-400">
            {!API_KEY
              ? props.locale === "ko"
                ? "지도 API 키가 설정되지 않았습니다"
                : "Map API key not configured"
              : props.locale === "ko"
                ? "경로를 그릴 좌표가 없습니다"
                : "No coordinates to plot"}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full rounded-xl overflow-hidden border border-gray-100" style={{ height: 240 }}>
      <APIProvider apiKey={API_KEY}>
        <Map
          defaultCenter={activityCoords[0].location!}
          defaultZoom={13}
          mapId={MAP_ID}
          gestureHandling="cooperative"
          disableDefaultUI={false}
          style={{ width: "100%", height: "100%" }}
        >
          <Content {...props} />
        </Map>
      </APIProvider>
    </div>
  );
}
