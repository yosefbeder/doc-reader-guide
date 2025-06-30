"use client";

import Link from "next/link";

import NavUser from "./NavUser";
import Logo from "./Logo";

export default function Nav({
  title,
  updateable,
  border = false,
}: {
  title: string;
  updateable?: boolean;
  border?: boolean;
}) {
  return (
    <div className={border ? "border-b-2 border-slate-200" : ""}>
      <nav className="main flex items-center justify-between max-sm:flex-col max-sm:gap-4 text-slate-900">
        <Link href="/" className="no-underline text-inherit hover:text-inherit">
          <Logo />
        </Link>
        <h1 className="max-md:hidden">{title}</h1>
        <NavUser updateable={updateable} />
      </nav>
      <h1 className="hidden bg-cyan-50 py-4 text-center max-md:block">
        {title}
      </h1>
    </div>
  );
}
