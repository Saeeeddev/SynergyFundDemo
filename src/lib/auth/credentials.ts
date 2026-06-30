// Dev-phase: hardcoded admin account (ARCHITECTURE.md §3.3, FEATURES.md §0.1).
// TEMPORARY — replace with a real auth API call when the Django backend is ready.
// See docs/SiteSyerngy_versions/v1/AUTH.md.
//
// NOTE: these credentials live in source on purpose for the demo phase. The
// session's actual security comes from SESSION_SECRET (see ./token.ts), not from
// hiding the password here.

const ADMIN_USERNAME = "Test";
const ADMIN_PASSWORD = "Tesr123";

export function validateCredentials(
  username: string,
  password: string
): boolean {
  return username === ADMIN_USERNAME && password === ADMIN_PASSWORD;
}
