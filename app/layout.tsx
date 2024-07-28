import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/node_modules/modern-normalize/modern-normalize.css";

import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "دوكريدر جايد",
  description: "منظم لمصادر المذاكرة لطلبة الطب",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
