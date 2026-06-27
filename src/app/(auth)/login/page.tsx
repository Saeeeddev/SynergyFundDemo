// Login page — no sidebar, no top bar [F §0.1, A §3.2]
// Single centered card: logo → title → subtitle → form [D §11]
// Card: --r-card, --shadow-md, 32px padding (24px on phone) [D §11, M §6.1]
import { LoginForm } from './LoginForm'

export default function LoginPage() {
  return (
    <div className="w-full" style={{ maxWidth: 'min(92vw, 420px)' }}>
      <div
        className="bg-surface border border-border rounded-card flex flex-col gap-6 p-6 md:p-8"
        style={{ boxShadow: 'var(--shadow-md)' }}
      >
        {/* Logo [F §0.1 item 1] */}
        <div className="flex flex-col items-center gap-3">
          {/* Solar-identity mark — gold sun icon chip, swap for <Image> when asset is ready */}
          <div
            className="w-12 h-12 rounded-chip flex items-center justify-center"
            style={{ background: 'var(--gold-tint)' }}
          >
            <svg
              width="28"
              height="28"
              viewBox="0 0 28 28"
              fill="none"
              aria-hidden="true"
            >
              {/* Sun/solar icon */}
              <circle cx="14" cy="14" r="5" stroke="var(--gold-deep)" strokeWidth="1.8" />
              {/* Rays */}
              {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => {
                const rad = (deg * Math.PI) / 180
                const x1 = 14 + 7.5 * Math.cos(rad)
                const y1 = 14 + 7.5 * Math.sin(rad)
                const x2 = 14 + 9.5 * Math.cos(rad)
                const y2 = 14 + 9.5 * Math.sin(rad)
                return (
                  <line
                    key={deg}
                    x1={x1.toFixed(2)}
                    y1={y1.toFixed(2)}
                    x2={x2.toFixed(2)}
                    y2={y2.toFixed(2)}
                    stroke="var(--gold-deep)"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                  />
                )
              })}
            </svg>
          </div>
          <span className="text-[15px] font-semibold text-text leading-none">
           synergy1
          </span>
        </div>

        {/* Title + subtitle [F §0.1 items 2–3] */}
        <div className="flex flex-col gap-1">
          <h1
            className="text-start text-text"
            style={{ fontSize: '17px', lineHeight: '26px', fontWeight: 600 }}
          >
            ورود به پنل
          </h1>
          <p
            className="text-start text-text-muted"
            style={{ fontSize: '12px', lineHeight: '18px' }}
          >
            لطفاً با اطلاعات مدیریتی خود وارد شوید
          </p>
        </div>

        {/* Username + password + submit + error [F §0.1 items 4–7] */}
        <LoginForm />
      </div>
    </div>
  )
}
