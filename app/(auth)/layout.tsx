import type { Metadata } from "next";

import "../globals.css";
import { Inter } from "next/font/google";
import themeScript from "@/utils/themeScript";

export const metadata: Metadata = {
  title: "DocReader Guide",
  description: "Organizes studying material for medical students",
};

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html>
      <body className={`${inter.variable} font-sans`}>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        {children}
      </body>
    </html>
  );
}
