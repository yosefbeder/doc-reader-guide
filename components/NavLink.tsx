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
      className={`radio ${
        pathname.startsWith(href) ? "selected" : "normal"
      } ${className}`}
      {...props}
    >
      {children}
    </Link>
  );
}
