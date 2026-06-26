// Full-screen shell for auth pages — no sidebar, no top bar [F §0.1, A §3.2]
// overflow-y-auto + py-8 ensures the card stays reachable when the keyboard is open [M §6.1]
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-[100dvh] flex items-center justify-center bg-bg overflow-y-auto py-8 px-4">
      {children}
    </div>
  );
}
