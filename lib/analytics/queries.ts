import { getRedis } from "./redis";
import { KEY, todayUtc } from "./log-schema";

export type DailyTotals = {
  total: number;
  bot: number;
  llm: number;
  utm: number;
};

export type Counter = { key: string; count: number };

function toCounters(hash: Record<string, string | number> | null): Counter[] {
  if (!hash) return [];
  return Object.entries(hash)
    .map(([key, value]) => ({ key, count: Number(value) || 0 }))
    .sort((a, b) => b.count - a.count);
}

export async function fetchRecentDates(limit = 30): Promise<string[]> {
  const redis = getRedis();
  if (!redis) return [];
  const result = await redis.zrange(KEY.index, 0, limit - 1, { rev: true });
  return (result as string[]) ?? [];
}

export async function fetchDailyTotals(date: string): Promise<DailyTotals> {
  const redis = getRedis();
  if (!redis) return { total: 0, bot: 0, llm: 0, utm: 0 };
  const hash = await redis.hgetall<Record<string, string>>(KEY.daily(date));
  return {
    total: Number(hash?.total ?? 0),
    bot: Number(hash?.bot ?? 0),
    llm: Number(hash?.llm ?? 0),
    utm: Number(hash?.utm ?? 0),
  };
}

async function fetchHashCounters(key: string): Promise<Counter[]> {
  const redis = getRedis();
  if (!redis) return [];
  const hash = await redis.hgetall<Record<string, string>>(key);
  return toCounters(hash);
}

export function fetchPathCounters(date: string): Promise<Counter[]> {
  return fetchHashCounters(KEY.path(date));
}

export function fetchBotCounters(date: string): Promise<Counter[]> {
  return fetchHashCounters(KEY.bot(date));
}

export function fetchLlmCounters(date: string): Promise<Counter[]> {
  return fetchHashCounters(KEY.llm(date));
}

export function fetchUtmCounters(date: string): Promise<Counter[]> {
  return fetchHashCounters(KEY.utm(date));
}

export type DashboardData = {
  date: string;
  totals: DailyTotals;
  paths: Counter[];
  bots: Counter[];
  llms: Counter[];
  utms: Counter[];
  recentDates: string[];
  redisConfigured: boolean;
};

export async function fetchDashboard(date?: string): Promise<DashboardData> {
  const redis = getRedis();
  const targetDate = date ?? todayUtc();
  if (!redis) {
    return {
      date: targetDate,
      totals: { total: 0, bot: 0, llm: 0, utm: 0 },
      paths: [],
      bots: [],
      llms: [],
      utms: [],
      recentDates: [],
      redisConfigured: false,
    };
  }
  const [totals, paths, bots, llms, utms, recentDates] = await Promise.all([
    fetchDailyTotals(targetDate),
    fetchPathCounters(targetDate),
    fetchBotCounters(targetDate),
    fetchLlmCounters(targetDate),
    fetchUtmCounters(targetDate),
    fetchRecentDates(),
  ]);
  return {
    date: targetDate,
    totals,
    paths,
    bots,
    llms,
    utms,
    recentDates,
    redisConfigured: true,
  };
}
