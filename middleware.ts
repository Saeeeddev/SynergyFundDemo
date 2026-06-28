import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyToken } from "@/lib/auth/token";

// Route-level auth guard [ARCHITECTURE.md §3.4, FEATURES.md §0.2]
// Runs on the Edge before any page renders — no DB access here.
// Cookie: synergy_auth (HTTP-only, HMAC-signed by lib/auth/session.ts).
// The cookie's signature is verified here, so it cannot be forged.

const COOKIE_NAME = "synergy_auth";

// Paths that are always public — no auth required
const PUBLIC_PREFIXES = ["/_next", "/fonts", "/api", "/favicon.ico"];

function isPublic(pathname: string): boolean {
  return PUBLIC_PREFIXES.some((prefix) => pathname.startsWith(prefix));
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Always allow static assets, fonts, api routes
  if (isPublic(pathname)) {
    return NextResponse.next();
  }

  // Trust the cookie only if its HMAC signature verifies against SESSION_SECRET.
  const session = await verifyToken(request.cookies.get(COOKIE_NAME)?.value);
  const hasSession = session !== null;

  // Authenticated user visiting /login → redirect to /dashboard [F §0.2]
  if (pathname === "/login" && hasSession) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // Unauthenticated user visiting any panel route → redirect to /login [F §0.2]
  if (pathname !== "/login" && !hasSession) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
