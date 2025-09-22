import React from "react";
import Image from "next/image";

import LogoImage from "@/public/logo.png";

export default function Logo() {
  return (
    <div className="flex items-center gap-2">
      <Image src={LogoImage} className="w-8" alt="Logo" />
      <span className="text-xl font-extrabold text-cyan-700 dark:text-cyan-500">
        DocReader Guide
      </span>
    </div>
  );
}
