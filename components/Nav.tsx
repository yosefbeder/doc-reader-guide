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
  title?: string;
  updateable?: boolean;
  border?: boolean;
}) {
  const pathname = usePathname();

  return (
    <div
      className={
        border ? "border-b border-slate-200 dark:border-slate-700" : ""
      }
    >
      <nav className="main flex items-center justify-between max-sm:flex-col max-sm:gap-4 text-slate-900 dark:text-slate-100">
        <Link
          href="/app"
          className="no-underline text-inherit hover:text-inherit shrink-0"
          onClick={() =>
            pathname !== "/app" &&
            logEvent(null, null, Action.NAVIGATE_TO_HOME, {})
          }
        >
          <Logo />
        </Link>
        {title && title.length < 30 && (
          <h1 className="max-md:hidden">{title}</h1>
        )}
        <NavUser updateable={updateable} />
      </nav>
      {title && (
        <h1
          className={`${
            title.length < 30 ? "hidden max-md:block" : ""
          } bg-cyan-50 dark:bg-cyan-900`}
        >
          <div className="max-w-screen-lg px-2 py-4 mx-auto max-sm:text-center">
            {title}
          </div>
        </h1>
      )}
    </div>
  );
}
