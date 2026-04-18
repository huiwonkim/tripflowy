/**
 * LocalStorage-backed save/list for generated itineraries.
 *
 * No account needed — each browser keeps its own list (max 20, LRU eviction).
 * Shape mirrors the v2 URL payload so stored items can be shared via `buildShareableUrl`.
 */
import type { GeneratedItinerary, PlannerInput } from "@/types";
import { encodeItinerary } from "./itinerary-encoding";

const STORAGE_KEY = "tripflowy:itineraries";
const STORAGE_VERSION = 2;
const MAX_ITEMS = 20;

export interface StoredItinerary {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  /** Encoded payload — feed to `decodeItinerary` to restore. */
  encoded: string;
  /** Cached title fields for list display (no need to decode for rendering). */
  preview: {
    destinations: string[];
    nights: number;
    dayCount: number;
  };
}

interface Store {
  version: number;
  items: StoredItinerary[];
}

function readStore(): Store {
  if (typeof window === "undefined") return { version: STORAGE_VERSION, items: [] };
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return { version: STORAGE_VERSION, items: [] };
    const parsed = JSON.parse(raw);
    if (!parsed || parsed.version !== STORAGE_VERSION || !Array.isArray(parsed.items)) {
      return { version: STORAGE_VERSION, items: [] };
    }
    return parsed as Store;
  } catch {
    return { version: STORAGE_VERSION, items: [] };
  }
}

function writeStore(store: Store) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
  } catch {
    // quota / private mode — silently ignore
  }
}

export function listStoredItineraries(): StoredItinerary[] {
  return readStore().items.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

function makeId(): string {
  return `it_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

/**
 * Persist the current itinerary under a user-chosen name.
 * Returns the stored record. Evicts oldest entries when the list exceeds MAX_ITEMS.
 */
export function saveItinerary(
  name: string,
  itinerary: GeneratedItinerary,
  input: PlannerInput,
): StoredItinerary {
  const encoded = encodeItinerary(itinerary, input);
  const store = readStore();
  const now = new Date().toISOString();

  const record: StoredItinerary = {
    id: makeId(),
    name: name.trim() || `${input.destinations.join(" + ")} ${Number(input.duration) + 1}일`,
    createdAt: now,
    updatedAt: now,
    encoded,
    preview: {
      destinations: [...input.destinations],
      nights: Number(input.duration) || 0,
      dayCount: itinerary.days.length,
    },
  };

  store.items.unshift(record);
  while (store.items.length > MAX_ITEMS) store.items.pop();
  writeStore(store);
  return record;
}

export function removeStoredItinerary(id: string) {
  const store = readStore();
  store.items = store.items.filter((it) => it.id !== id);
  writeStore(store);
}

/**
 * Produce a full URL to revisit a stored itinerary.
 * (`encoded` already contains everything needed.)
 */
export function buildUrlForStored(record: StoredItinerary): string {
  if (typeof window === "undefined") return `/planner?v=2&s=${record.encoded}`;
  return `${window.location.origin}/${window.location.pathname.startsWith("/ko") ? "ko/" : ""}planner?v=2&s=${record.encoded}`;
}
