"use client";

import Image from "next/image";
import Link from "next/link";

import Logo from "@/public/logo.png";
import NavUser from "./NavUser";

export default function Nav({
  title,
  updateable,
}: {
  title: string;
  updateable?: boolean;
}) {
  return (
    <>
      <nav className="main flex items-center justify-between max-sm:flex-col max-sm:gap-4 text-slate-900">
        <Link
          href="/"
          className="flex items-center gap-2 no-underline text-inherit hover:text-inherit"
        >
          <Image src={Logo} className="w-8" alt="Logo" />
          <span className="text-xl font-extrabold text-cyan-700">
            DocReader Guide
          </span>
        </Link>
        <h1 className="max-md:hidden">{title}</h1>
        <NavUser updateable={updateable} />
      </nav>
      <h1 className="hidden bg-cyan-50 py-4 text-center max-md:block">
        {title}
      </h1>
    </>
  );
}
