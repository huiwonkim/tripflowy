export const PUBLIC_MODE = process.env.NEXT_PUBLIC_PUBLIC_MODE === "true";

export const PUBLIC_CITY_IDS = ["tokyo"] as const;

export function isPublicCity(id: string): boolean {
  if (!PUBLIC_MODE) return true;
  return (PUBLIC_CITY_IDS as readonly string[]).includes(id);
}
