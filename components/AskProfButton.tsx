"use client";

import Link from "next/link";
import Image from "next/image";
import { Action } from "@/types";
import { logEvent } from "@/lib/event-logger";

interface AskProfButtonProps {
  className?: string;
}

export default function AskProfButton({ className = "" }: AskProfButtonProps) {
  return (
    <Link
      href="https://askprof.app"
      onClick={() => logEvent(null, null, Action.OPEN_ASKPROF, {})}
      target="_blank"
      rel="noopener noreferrer"
      className={`fixed bottom-4 right-4 z-10 font-manrope text-neutral-900 bg-white dark:bg-neutral-900 dark:text-white rounded-full border border-neutral-900 dark:border-neutral-200 flex items-center gap-2 px-4 py-1.5 font-bold shadow-md transition-colors ${className}`}
      aria-label="AskProf"
    >
      <Image
        src="/askprof-light.svg"
        alt=""
        width={32}
        height={32}
        unoptimized
        className="size-8 object-contain shrink-0 dark:hidden"
      />
      <Image
        src="/askprof-dark.svg"
        alt=""
        width={32}
        height={32}
        unoptimized
        className="size-8 object-contain shrink-0 hidden dark:block"
      />
      <span>
        Ask<span className="text-red-600 dark:text-red-500">Prof</span>
      </span>
    </Link>
  );
}
