import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/** Common typo: missing “l” in ali — send to the live Netlify subdomain. */
const TYPO_HOSTS = new Set(["zubair-ai.netlify.app"]);

const CANONICAL_HOST = process.env.CANONICAL_HOST ?? "zubair-ali.netlify.app";

export function middleware(request: NextRequest) {
  const host = request.nextUrl.hostname;
  if (!TYPO_HOSTS.has(host)) {
    return NextResponse.next();
  }

  const url = request.nextUrl.clone();
  url.hostname = CANONICAL_HOST;
  url.protocol = "https";
  url.port = "";
  return NextResponse.redirect(url, 308);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|assets/).*)"],
};
