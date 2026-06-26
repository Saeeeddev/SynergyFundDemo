import type { Metadata, Viewport } from "next";
import "./globals.css";
import Providers from "./providers";

export const metadata: Metadata = {
  title: "Synergy Fund — پنل کاربری",
  description: "پنل سرمایه‌گذاری در نیروگاه‌های خورشیدی",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fa" dir="rtl">
      <head>
        {/* Self-hosted Yekan Bakh — DESIGN.md §3.1, ARCHITECTURE.md §3.3 */}
        <link rel="stylesheet" href="/fonts/fonts.css" />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
