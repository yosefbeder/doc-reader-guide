import React from "react";
import Image from "next/image";

import Hero from "@/public/hero.jpg";
import Button from "@/components/Button";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Download Android App | DocReader Guide",
  description:
    "Install our Android app to access modules, subjects, lectures, and quizzes offline.",
  openGraph: {
    title: "Download Android App | DocReader Guide",
    description:
      "Install our Android app to access modules, subjects, lectures, and quizzes offline.",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Download Android App | DocReader Guide",
    description:
      "Install our Android app to access modules, subjects, lectures, and quizzes offline.",
  },
};

export default function AndroidPage() {
  return (
    <main className="mx-auto max-w-xl flex flex-col items-center">
      <Image src={Hero} alt="Hero" />
      <Button color="violet">
        <a href={process.env.NEXT_PUBLIC_DOWNLOAD_LATEST} target="_blank">
          Download
        </a>
      </Button>
    </main>
  );
}
