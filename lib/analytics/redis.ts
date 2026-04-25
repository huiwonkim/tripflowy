import { Redis } from "@upstash/redis";

let client: Redis | null = null;

export function getRedis(): Redis | null {
  if (client) return client;
  const url = process.env.KV_REST_API_URL;
  const token = process.env.KV_REST_API_TOKEN;
  if (!url || !token) return null;
  client = new Redis({ url, token });
  return client;
}

const expiredKeys = new Set<string>();

export function shouldExpire(key: string): boolean {
  if (expiredKeys.has(key)) return false;
  expiredKeys.add(key);
  return true;
}
