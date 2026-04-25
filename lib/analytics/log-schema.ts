/**
 * Analytics log schema — see /docs/analytics-schema.md for design rationale.
 * Shared between middleware (write) and /app/admin/analytics (read).
 */

export type RawEntry = {
  ts: string;
  path: string;
  ref: string | null;
  ua: string;
  bot: string | null;
  llm: string | null;
  utm_s: string | null;
  utm_m: string | null;
  utm_c: string | null;
  utm_co: string | null;
  utm_t: string | null;
};

export const TTL = {
  raw: 30 * 86400,
  daily: 365 * 86400,
  path: 90 * 86400,
  bot: 365 * 86400,
  llm: 365 * 86400,
  utm: 180 * 86400,
} as const;

export const KEY = {
  raw: (date: string) => `log:raw:${date}`,
  daily: (date: string) => `log:agg:daily:${date}`,
  path: (date: string) => `log:agg:path:${date}`,
  bot: (date: string) => `log:agg:bot:${date}`,
  llm: (date: string) => `log:agg:llm:${date}`,
  utm: (date: string) => `log:agg:utm:${date}`,
  index: "log:index:dates",
} as const;

export function todayUtc(now: Date = new Date()): string {
  return now.toISOString().slice(0, 10);
}

const BOT_PATTERNS: Array<[RegExp, string]> = [
  [/GPTBot/i, "GPTBot"],
  [/ChatGPT-User/i, "ChatGPT-User"],
  [/OAI-SearchBot/i, "OAI-SearchBot"],
  [/ClaudeBot/i, "ClaudeBot"],
  [/Claude-Web/i, "Claude-Web"],
  [/anthropic-ai/i, "anthropic-ai"],
  [/PerplexityBot/i, "PerplexityBot"],
  [/Perplexity-User/i, "Perplexity-User"],
  [/Google-Extended/i, "Google-Extended"],
  [/Bytespider/i, "Bytespider"],
  [/CCBot/i, "CCBot"],
  [/Applebot-Extended/i, "Applebot-Extended"],
  [/Applebot/i, "Applebot"],
  [/Googlebot/i, "Googlebot"],
  [/Bingbot/i, "Bingbot"],
  [/DuckDuckBot/i, "DuckDuckBot"],
  [/YandexBot/i, "YandexBot"],
  [/Yeti/i, "NaverBot"],
];

export function detectBot(ua: string | null): string | null {
  if (!ua) return null;
  for (const [pattern, name] of BOT_PATTERNS) {
    if (pattern.test(ua)) return name;
  }
  return null;
}

const LLM_HOSTS = new Set([
  "chatgpt.com",
  "chat.openai.com",
  "perplexity.ai",
  "www.perplexity.ai",
  "claude.ai",
  "gemini.google.com",
  "bard.google.com",
  "copilot.microsoft.com",
  "you.com",
  "phind.com",
]);

export function detectLlmReferer(referer: string | null): string | null {
  if (!referer) return null;
  try {
    const host = new URL(referer).hostname.toLowerCase();
    return LLM_HOSTS.has(host) ? host : null;
  } catch {
    return null;
  }
}

export function parseUtm(searchParams: URLSearchParams): {
  s: string | null;
  m: string | null;
  c: string | null;
  co: string | null;
  t: string | null;
} {
  return {
    s: searchParams.get("utm_source"),
    m: searchParams.get("utm_medium"),
    c: searchParams.get("utm_campaign"),
    co: searchParams.get("utm_content"),
    t: searchParams.get("utm_term"),
  };
}

export function utmAggKey(utm: {
  s: string | null;
  m: string | null;
  c: string | null;
}): string | null {
  if (!utm.s && !utm.m && !utm.c) return null;
  return `${utm.s ?? "-"}/${utm.m ?? "-"}/${utm.c ?? "-"}`;
}
