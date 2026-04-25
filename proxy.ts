import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import type { NextFetchEvent, NextRequest } from "next/server";
import { logRequest } from "./lib/analytics/log-request";

const intlMiddleware = createMiddleware(routing);

export function proxy(request: NextRequest, event: NextFetchEvent) {
  event.waitUntil(logRequest(request).catch(() => {}));
  return intlMiddleware(request);
}

export const config = {
  matcher: [
    "/((?!api|admin|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.*\\..*).*)",
  ],
};
