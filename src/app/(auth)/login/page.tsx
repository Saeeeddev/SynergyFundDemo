// Login page — no sidebar, no top bar [F §0.1, A §3.2]
// Single centered card: logo → title → subtitle → form [D §11]
// Card: --r-card, --shadow-md, 32px padding (24px on phone) [D §11, M §6.1]
import { LoginForm } from './LoginForm'

export default function LoginPage() {
  return (
    <div className="w-full" style={{ maxWidth: 'min(92vw, 420px)' }}>
      <div
        className="bg-sky-300/20 border border-sky-100/45 rounded-[20px] flex flex-col gap-6 p-6 md:p-8"
        style={{
          background:
            'linear-gradient(135deg, rgba(125,211,252,0.24), rgba(14,165,233,0.14) 52%, rgba(255,255,255,0.12))',
          backdropFilter: 'blur(28px) saturate(190%)',
          WebkitBackdropFilter: 'blur(28px) saturate(190%)',
          boxShadow:
            '0 24px 70px rgba(2,132,199,0.24), inset 0 1px 0 rgba(255,255,255,0.58), inset 0 -1px 0 rgba(186,230,253,0.22)',
        }}
      >
        {/* Title [F §0.1 items 2–3] */}
        <div className="flex flex-col gap-1">
          <h1
            className="text-start text-text"
            style={{ fontSize: '17px', lineHeight: '26px', fontWeight: 600 }}
          >
            ورود به پنل
          </h1>
        </div>

        {/* Username + password + submit + error [F §0.1 items 4–7] */}
        <LoginForm />
      </div>
    </div>
  )
}
