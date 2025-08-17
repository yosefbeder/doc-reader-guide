import React from "react";
import Image from "next/image";

import Hero from "@/public/hero.jpg";
import Button from "@/components/Button";

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
