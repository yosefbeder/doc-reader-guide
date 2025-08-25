import { Metadata } from "next";

import buildCanonical from "@/utils/buildCanonical";

export async function generateMetadata({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}): Promise<Metadata> {
  const title = "Log in | DocReader Guide";
  const description =
    "Access your personalized home page on Doc Reader Guide. Log in to explore lectures, notes, and quizzes tailored to your curriculum.";

  const hasRedirect = !!searchParams?.redirect;

  if (hasRedirect) {
    return {
      title,
      description,
      robots: {
        index: false,
        follow: true,
      },
      ...buildCanonical("/login"),
    };
  }

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
