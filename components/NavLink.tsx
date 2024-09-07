"use client";

import React from "react";
import Link, { LinkProps } from "next/link";
import { usePathname } from "next/navigation";

export default function NavLink({
  href,
  children,
  className,
  ...props
}: LinkProps & React.ComponentProps<"a">) {
  const pathname = usePathname();

  return (
    <Link
      href={href}
      className={`p-2 rounded-md border-slate-700 flex items-center gap-2 no-underline text-inherit hover:text-inherit active:text-inherit transition-colors ${
        pathname.startsWith(href)
          ? "bg-slate-100"
          : "hover:bg-slate-50 active:bg-slate-100"
      } ${className}`}
      {...props}
    >
      {children}
    </Link>
  );
}
