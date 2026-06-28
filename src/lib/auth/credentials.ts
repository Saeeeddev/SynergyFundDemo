// Dev-phase: hardcoded admin account (ARCHITECTURE.md §3.3, FEATURES.md §0.1).
// Replace with a real auth API call when the backend is ready.

export interface CredentialResult {
  ok: true;
  token: string;
}

export interface CredentialFailure {
  ok: false;
}

export type CredentialsResponse = CredentialResult | CredentialFailure;

const ADMIN_USERNAME = "Saeed";
const ADMIN_PASSWORD = "S@eed123";

export function validateCredentials(
  username: string,
  password: string
): CredentialsResponse {
  if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
    return { ok: true, token: "dev-token-admin-synergy" };
  }
  return { ok: false };
}
