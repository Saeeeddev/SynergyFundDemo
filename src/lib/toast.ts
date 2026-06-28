// Tiny framework-agnostic toast store (pub/sub).
// Lives outside React so non-component code — e.g. the React Query global
// error handler — can raise a toast: `toast.error('...')`.

export type ToastType = 'error' | 'success' | 'info'

export interface ToastItem {
  id: number
  message: string
  type: ToastType
  /** auto-dismiss after this many ms (0 = sticky) */
  duration: number
}

type Listener = (toasts: ToastItem[]) => void

let toasts: ToastItem[] = []
let nextId = 1
const listeners = new Set<Listener>()

function emit() {
  for (const l of listeners) l(toasts)
}

export function subscribeToasts(listener: Listener): () => void {
  listeners.add(listener)
  listener(toasts)
  return () => {
    listeners.delete(listener)
  }
}

export function dismissToast(id: number) {
  toasts = toasts.filter((t) => t.id !== id)
  emit()
}

function push(message: string, type: ToastType, duration: number): number {
  // De-dupe: if an identical message is already showing, don't stack it.
  const existing = toasts.find((t) => t.message === message && t.type === type)
  if (existing) return existing.id

  const id = nextId++
  toasts = [...toasts, { id, message, type, duration }]
  emit()
  if (duration > 0 && typeof window !== 'undefined') {
    window.setTimeout(() => dismissToast(id), duration)
  }
  return id
}

export const toast = {
  error: (message: string, duration = 6000) => push(message, 'error', duration),
  success: (message: string, duration = 4000) => push(message, 'success', duration),
  info: (message: string, duration = 4000) => push(message, 'info', duration),
}

// Map an unknown error (axios / fetch / generic) to a friendly Farsi message.
export function toFriendlyMessage(error: unknown): string {
  // Network-level failure (no response) — the classic "slow/offline" case.
  const e = error as { code?: string; response?: { status?: number }; message?: string } | undefined
  if (e?.code === 'ERR_NETWORK' || e?.message === 'Network Error') {
    return 'اتصال به سرور برقرار نشد. اتصال اینترنت خود را بررسی کنید.'
  }
  const status = e?.response?.status
  if (status === 401 || status === 403) {
    return 'دسترسی شما منقضی شده است. لطفاً دوباره وارد شوید.'
  }
  if (status && status >= 500) {
    return 'خطایی در سرور رخ داد. لطفاً کمی بعد دوباره تلاش کنید.'
  }
  if (e?.code === 'ECONNABORTED') {
    return 'پاسخی از سرور دریافت نشد. اینترنت شما ممکن است کند باشد.'
  }
  return 'مشکلی پیش آمد. لطفاً دوباره تلاش کنید.'
}
