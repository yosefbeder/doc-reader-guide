"use client";

import Link from "next/link";
import NavUser from "./NavUser";
import Logo from "./Logo";
import { logEvent } from "@/lib/event-logger";
import { Action } from "@/types";
import { usePathname } from "next/navigation";

export default function Nav({
  title,
  updateable,
  border = false,
}: {
  title: string;
  updateable?: boolean;
  border?: boolean;
}) {
  const pathname = usePathname();

  return (
    <div
      className={
        border ? "border-b-2 border-slate-200 dark:border-slate-700" : ""
      }
    >
      <nav className="main flex items-center justify-between max-sm:flex-col max-sm:gap-4 text-slate-900 dark:text-slate-100">
        <Link
          href="/"
          className="no-underline text-inherit hover:text-inherit"
          onClick={() =>
            pathname !== "/" &&
            logEvent(null, null, Action.NAVIGATE_TO_HOME, {})
          }
        >
          <Logo />
        </Link>
        <h2 className="max-md:hidden">{title}</h2>
        <NavUser updateable={updateable} />
      </nav>
      <h2 className="hidden bg-cyan-50 dark:bg-cyan-900 py-4 text-center max-md:block">
        {title}
      </h2>
    </div>
  );
}
