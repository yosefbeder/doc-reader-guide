import type { Metadata } from "next";
import { Inter } from "next/font/google";

import "../globals.css";
import NotificationListener from "@/components/NotificationListener";
import SWRWrapper from "@/components/SWRWrapper";
import themeScript from "@/utils/themeScript";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "DocReader Guide",
  description: "Organizes studying material for medical students",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html suppressHydrationWarning>
      <body className={`${inter.variable} font-sans`}>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <SWRWrapper>{children}</SWRWrapper>
        <NotificationListener />
      </body>
    </html>
  );
}
