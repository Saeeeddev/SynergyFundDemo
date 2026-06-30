'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff } from 'lucide-react'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Spinner } from '@/components/ui/Spinner'
import { loginAction } from './actions'

interface FormValues {
  username: string
  password: string
}

// [F §0.1] Login form: username + password + submit + error message
// react-hook-form for state [A §3.1]; calls server action on submit.
// Mobile: 48px inputs (Input component base height), full-width primary CTA [M §6.1]
export function LoginForm() {
  const router = useRouter()
  const [serverError, setServerError] = useState<string | null>(null)
  const [isPending, setIsPending] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({ mode: 'onSubmit' })

  const onSubmit = async (data: FormValues) => {
    setIsPending(true)
    setServerError(null)

    try {
      const result = await loginAction(data.username, data.password)
      if (result.ok) {
        // Cookie is set; push to dashboard and refresh server state.
        // Keep isPending=true so the spinner shows while the dashboard loads —
        // navigation can take a moment on slow connections. [F §0.1]
        router.push('/dashboard')
        router.refresh()
      } else {
        setServerError(result.error)
        setIsPending(false)
      }
    } catch {
      setServerError('خطایی رخ داده است. اتصال اینترنت خود را بررسی کنید.')
      setIsPending(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-5">
      <Input
        label="نام کاربری"
        placeholder="نام کاربری را وارد کنید"
        type="text"
        autoComplete="username"
        inputMode="text"
        error={errors.username ? 'نام کاربری الزامی است' : undefined}
        {...register('username', { required: true })}
      />

      <Input
        label="رمز عبور"
        placeholder="رمز عبور را وارد کنید"
        type={showPassword ? 'text' : 'password'}
        autoComplete="current-password"
        error={errors.password ? 'رمز عبور الزامی است' : undefined}
        endAdornment={
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            aria-label={showPassword ? 'پنهان کردن رمز عبور' : 'نمایش رمز عبور'}
            aria-pressed={showPassword}
            className="flex items-center justify-center w-9 h-9 rounded-md text-text-muted hover:text-text hover:bg-hover transition-colors"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        }
        {...register('password', { required: true })}
      />

      {/* Server-side error [F §0.1] — shown only when present, hidden when none */}
      {serverError && (
        <p role="alert" className="text-[12px] leading-tight text-red-base text-start">
          {serverError}
        </p>
      )}

      <Button
        variant="primary"
        size="wide"
        type="submit"
        fullWidth
        disabled={isPending}
        icon={isPending ? <Spinner size={18} /> : undefined}
      >
        {isPending ? 'در حال ورود…' : 'ورود'}
      </Button>
    </form>
  )
}
