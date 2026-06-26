// Session management via HTTP-only cookie (ARCHITECTURE.md §3.3)
// Server-safe: getSession() reads the cookie from the request in server context;
// setSession/clearSession are used in Route Handlers or server actions.

import { cookies } from "next/headers";

const COOKIE_NAME = "synergy_auth";

export async function getSession(): Promise<{ token: string } | null> {
  const jar = await cookies();
  const token = jar.get(COOKIE_NAME)?.value;
  if (!token) return null;
  return { token };
}

export async function setSession(token: string): Promise<void> {
  const jar = await cookies();
  jar.set(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });
}

export async function clearSession(): Promise<void> {
  const jar = await cookies();
  jar.delete(COOKIE_NAME);
}
