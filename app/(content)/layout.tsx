import { Cairo, Inter } from "next/font/google";
import ThemeToaster from "@/components/ThemeToaster";

import "../globals.css";
import NotificationListener from "@/components/NotificationListener";
import SWRWrapper from "@/components/SWRWrapper";
import themeScript from "@/utils/themeScript";
import { SerwistProvider } from "../serwist";

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
        <SerwistProvider swUrl="/serwist/sw.js">
          <SWRWrapper>{children}</SWRWrapper>
        </SerwistProvider>
        <NotificationListener />
        <ThemeToaster />
      </body>
    </html>
  );
}
