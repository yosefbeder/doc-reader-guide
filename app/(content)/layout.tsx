import "@/lib/polyfills";
import { Cairo, Inter, Manrope } from "next/font/google";
import ThemeToaster from "@/components/ThemeToaster";

import "../globals.css";
import NotificationListener from "@/components/NotificationListener";
import SWRWrapper from "@/components/SWRWrapper";
import themeScript from "@/utils/themeScript";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const cairo = Cairo({
  subsets: ["arabic"],
  variable: "--font-cairo",
});
const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html>
      <body
        className={`${inter.variable} ${cairo.variable} ${manrope.variable} font-sans`}
      >
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <SWRWrapper>{children}</SWRWrapper>
        <NotificationListener />
        <ThemeToaster />
      </body>
    </html>
  );
}
