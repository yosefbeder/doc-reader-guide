import type { Metadata } from "next";
import { Inter } from "next/font/google";

import "./globals.css";
import themeScript from "@/utils/themeScript";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "DocReader Guide",
  description: "The Ultimate Study Companion for Medical Students",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html suppressHydrationWarning>
      <head>
        {/* The theme script is included in the head to prevent FOUC (Flash of Unstyled Content) */}
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className={`${inter.variable} font-sans`}>
        {children}
      </body>
    </html>
  );
}