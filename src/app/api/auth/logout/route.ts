import { NextResponse } from 'next/server'
import { clearSession } from '@/lib/auth/session'

// POST /api/auth/logout — clears the auth cookie and returns 200 [F §0.2]
export async function POST() {
  await clearSession()
  return NextResponse.json({ ok: true })
}
