'use server'

import { validateCredentials } from '@/lib/auth/credentials'
import { setSession } from '@/lib/auth/session'

export interface LoginResult {
  ok: true
}

export interface LoginError {
  ok: false
  error: string
}

export type LoginResponse = LoginResult | LoginError

// Validates credentials, sets the auth cookie, returns ok/error.
// The client handles navigation on success [F §0.1, A §3.3]
export async function loginAction(
  username: string,
  password: string,
): Promise<LoginResponse> {
  const result = validateCredentials(username.trim(), password)

  if (!result.ok) {
    return { ok: false, error: 'نام کاربری یا رمز عبور اشتباه است' }
  }

  await setSession(result.token)
  return { ok: true }
}
