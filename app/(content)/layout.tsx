import type { Metadata } from "next";
import { Cairo, Inter } from "next/font/google";

import "../globals.css";
import NotificationListener from "@/components/NotificationListener";
import SWRWrapper from "@/components/SWRWrapper";
import themeScript from "@/utils/themeScript";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const cairo = Cairo({
  subsets: ["arabic"],
  variable: "--font-cairo",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html>
      <body className={`${inter.variable} ${cairo.variable} font-sans`}>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <SWRWrapper>{children}</SWRWrapper>
        <NotificationListener />
      </body>
    </html>
  );
}
