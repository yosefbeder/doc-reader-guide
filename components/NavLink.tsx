import React from "react";
import Link from "next/link";

interface NavLinkProps extends React.ComponentProps<"a"> {
  href: string;
  selected: boolean;
}

export default function NavLink({
  href,
  children,
  className,
  selected,
  ...props
}: NavLinkProps) {
  return (
    <Link
      href={href}
      className={`p-2 rounded-md border-slate-700 flex items-center gap-2 no-underline text-inherit hover:text-inherit active:text-inherit transition-colors ${
        selected ? "bg-slate-100" : "hover:bg-slate-50 active:bg-slate-100"
      } ${className}`}
      {...props}
    >
      {children}
    </Link>
  );
}
