import type { Metadata } from "next";
import { IBM_Plex_Sans_Arabic } from "next/font/google";
import "./globals.css";
import ThemeProvider from "@/components/ThemeProvider";

const ibmPlexArabic = IBM_Plex_Sans_Arabic({
  variable: "--font-arabic",
  subsets: ["arabic", "latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "مزرعتي — إدارة المزرعة الذكية",
  description:
    "منصة عربية متكاملة لإدارة المزارع: المصاريف، المحاصيل، المواشي، الآبار، والتقارير المالية",
  keywords: [
    "إدارة المزرعة",
    "مصاريف المزرعة",
    "زراعة",
    "مواشي",
    "آبار",
    "محاصيل",
    "farm management",
    "Arabic",
  ],
  manifest: "/manifest.json",
  themeColor: "#0a0f1a",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" className="dark">
      <body className={`${ibmPlexArabic.variable} font-arabic antialiased`}>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
