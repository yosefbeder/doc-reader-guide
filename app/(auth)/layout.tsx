import type { Metadata } from "next";

import "../globals.css";
import { Cairo, Inter } from "next/font/google";

export const metadata: Metadata = {
  title: "دوكريدر جايد",
  description: "منظم لمصادر المذاكرة لطلبة الطب",
};

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const cairo = Cairo({
  subsets: ["arabic", "latin"],
  variable: "--font-cairo",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl">
      <body className={`${inter.variable} ${cairo.variable} font-sans`}>
        {children}
      </body>
    </html>
  );
}
