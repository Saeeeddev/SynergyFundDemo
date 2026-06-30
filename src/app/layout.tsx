import type { Metadata, Viewport } from "next";
import { Analytics } from "@vercel/analytics/next";
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
      {/* suppressHydrationWarning: browser extensions (e.g. ColorZilla's
          cz-shortcut-listen) inject attributes on <body> before React hydrates,
          causing a benign hydration mismatch. This only ignores attribute diffs
          on <body> itself, not real mismatches in the tree. */}
      <body suppressHydrationWarning>
        <Providers>{children}</Providers>
        {/* Vercel Web Analytics — page views & visitors (only sends on Vercel deploys) */}
        <Analytics />
      </body>
    </html>
  );
}
