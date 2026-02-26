import type { Metadata, Viewport } from "next";
import { IBM_Plex_Sans_Arabic } from "next/font/google";
import "./globals.css";
import ThemeProvider from "@/components/ThemeProvider";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import Script from "next/script";

const ibmPlexArabic = IBM_Plex_Sans_Arabic({
  variable: "--font-arabic",
  subsets: ["arabic", "latin"],
  weight: ["400", "600", "700"],
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#10b981",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: {
    default: "مزرعتي — إدارة المزرعة الذكية",
    template: "%s | مزرعتي",
  },
  description:
    "منصة عربية متكاملة لإدارة المزارع: تتبع المصاريف، المحاصيل، المواشي، الآبار، الطاقة، والتقارير المالية. مجانية وسهلة الاستخدام.",
  keywords: [
    "إدارة المزرعة",
    "مصاريف المزرعة",
    "زراعة",
    "مواشي",
    "آبار",
    "محاصيل",
    "تطبيق مزرعة",
    "farm management",
    "Arabic farm app",
    "agriculture",
    "مزرعتي",
    "mazraati",
  ],
  manifest: "/manifest.json",
  icons: {
    icon: "/icons/icon.svg",
    apple: "/icons/icon.svg",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "مزرعتي",
  },
  openGraph: {
    type: "website",
    locale: "ar_SA",
    url: "https://mazraati-three.vercel.app",
    siteName: "مزرعتي",
    title: "مزرعتي — إدارة المزرعة الذكية",
    description:
      "منصة عربية متكاملة لإدارة المزارع — المصاريف، المحاصيل، المواشي، الآبار، الطاقة، والتقارير. مجانية.",
  },
  twitter: {
    card: "summary_large_image",
    title: "مزرعتي — إدارة المزرعة الذكية",
    description:
      "أول منصة عربية لإدارة المزارع — تتبع المصاريف والمحاصيل والمواشي مجاناً",
  },
  robots: {
    index: true,
    follow: true,
  },
  other: {
    "mobile-web-app-capable": "yes",
  },
};

import { ToastProvider } from "@/components/Toast";
import QueryProvider from "@/components/QueryProvider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" className="dark">
      <head>
        <link rel="apple-touch-icon" href="/icons/icon.svg" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
      </head>
      <body className={`${ibmPlexArabic.variable} font-arabic antialiased`}>
        <QueryProvider>
          <ThemeProvider>
            <ToastProvider>{children}</ToastProvider>
          </ThemeProvider>
        </QueryProvider>
        <Analytics />
        <SpeedInsights />
        <Script id="sw-register" strategy="afterInteractive">
          {`
            if ('serviceWorker' in navigator) {
              window.addEventListener('load', function() {
                navigator.serviceWorker.register('/sw.js').catch(function() {});
              });
            }
          `}
        </Script>
      </body>
    </html>
  );
}
