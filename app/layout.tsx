import type { Metadata } from "next";
import { Cairo } from "next/font/google";

import "./globals.css";

const inter = Cairo({ subsets: ["arabic", "latin"], variable: "--font-cairo" });

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
      <body className={`${inter.variable} font-sans`}>{children}</body>
    </html>
  );
}
