import { Metadata } from "next";

import buildCanonical from "@/utils/buildCanonical";

export async function generateMetadata(): Promise<Metadata> {
  const title = "Log in | DocReader Guide";
  const description =
    "Access your personalized home page on Doc Reader Guide. Log in to explore lectures, notes, and quizzes tailored to your curriculum.";

  return {
    title,
    description,
    robots: {
      index: true,
      follow: true,
    },
    ...buildCanonical("/login"),
  };
}

export default function LoginLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
