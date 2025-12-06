import { Metadata } from "next";

const title = "DocReader Guide | Your Medical Study Companion";
const description =
  "The all-in-one platform for Egyptian medical students. Organized lectures, Practice Questions, and AI assistance.";

export const metadata: Metadata = {
  title,
  description,
  openGraph: {
    title,
    description,
    url: "https://doc-reader-guide.com",
    siteName: "DocReader Guide",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
  alternates: {
    canonical: "https://doc-reader-guide.com",
  },
};

export default function LandingPageLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
