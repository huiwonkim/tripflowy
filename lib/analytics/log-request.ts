import type { NextRequest } from "next/server";
import { getRedis, shouldExpire } from "./redis";
import {
  KEY,
  TTL,
  detectBot,
  detectLlmReferer,
  parseUtm,
  todayUtc,
  utmAggKey,
  type RawEntry,
} from "./log-schema";

const UA_MAX = 200;

export async function logRequest(request: NextRequest): Promise<void> {
  const redis = getRedis();
  if (!redis) return;

  const url = new URL(request.url);
  const ua = request.headers.get("user-agent") ?? "";
  const ref = request.headers.get("referer");
  const bot = detectBot(ua);
  const llm = detectLlmReferer(ref);
  const utm = parseUtm(url.searchParams);

  const date = todayUtc();
  const entry: RawEntry = {
    ts: new Date().toISOString(),
    path: url.pathname,
    ref: ref ?? null,
    ua: ua.slice(0, UA_MAX),
    bot,
    llm,
    utm_s: utm.s,
    utm_m: utm.m,
    utm_c: utm.c,
    utm_co: utm.co,
    utm_t: utm.t,
  };

  const pipe = redis.pipeline();

  pipe.lpush(KEY.raw(date), JSON.stringify(entry));
  if (shouldExpire(KEY.raw(date))) {
    pipe.expire(KEY.raw(date), TTL.raw, "NX");
  }

  pipe.hincrby(KEY.daily(date), "total", 1);
  if (bot) pipe.hincrby(KEY.daily(date), "bot", 1);
  if (llm) pipe.hincrby(KEY.daily(date), "llm", 1);
  if (utm.s || utm.m || utm.c) pipe.hincrby(KEY.daily(date), "utm", 1);
  if (shouldExpire(KEY.daily(date))) {
    pipe.expire(KEY.daily(date), TTL.daily, "NX");
  }

  pipe.hincrby(KEY.path(date), entry.path, 1);
  if (shouldExpire(KEY.path(date))) {
    pipe.expire(KEY.path(date), TTL.path, "NX");
  }

  if (bot) {
    pipe.hincrby(KEY.bot(date), bot, 1);
    if (shouldExpire(KEY.bot(date))) {
      pipe.expire(KEY.bot(date), TTL.bot, "NX");
    }
  }

  if (llm) {
    pipe.hincrby(KEY.llm(date), llm, 1);
    if (shouldExpire(KEY.llm(date))) {
      pipe.expire(KEY.llm(date), TTL.llm, "NX");
    }
  }

  const utmKey = utmAggKey(utm);
  if (utmKey) {
    pipe.hincrby(KEY.utm(date), utmKey, 1);
    if (shouldExpire(KEY.utm(date))) {
      pipe.expire(KEY.utm(date), TTL.utm, "NX");
    }
  }

  if (shouldExpire(`index:${date}`)) {
    pipe.zadd(KEY.index, { score: Date.now(), member: date });
  }

  await pipe.exec();
}
