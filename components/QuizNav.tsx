"use client";

import Link from "next/link";
import React from "react";
import ButtonIcon from "./ButtonIcon";
import { usePathname, useRouter } from "next/navigation";
import { icons } from "./icons";
import useSWR from "swr";
import getUser from "@/utils/getUserClient";
import { logEvent } from "@/lib/event-logger";
import { Action, Resource } from "@/types";

export default function QuizNav({
  title,
  progress,
  lectureId,
}: {
  title: string;
  progress: number;
  lectureId: number;
}) {
  const { data: user } = useSWR("user", async () => await getUser());
  const pathname = usePathname();
  const router = useRouter();

  return (
    <nav className="max-w-2xl mx-auto w-full">
      <div className="flex items-center px-2 py-4">
        <h1 className="mr-auto line-clamp-2">{title}</h1>
        {user?.roleId !== 3 && (
          <button
            className={`mr-2 radio p-2 ${
              pathname.endsWith("/update") ? "selected" : "normal"
            }`}
            onClick={() => {
              if (pathname.endsWith("/update")) {
                router.push(pathname.slice(0, pathname.indexOf("/update") + 1));
              } else {
                router.push(`${pathname === "/" ? "" : pathname}/update`);
              }
            }}
          >
            {icons["pencil-square"]}
          </button>
        )}
        <Link
          href="/profile"
          className="mr-2"
          onClick={() => logEvent(null, null, Action.NAVIGATE_TO_PROFILE, {})}
        >
          <ButtonIcon icon="cog-6-tooth" />
        </Link>
        <Link
          href={`/lectures/${lectureId}`}
          onClick={() =>
            logEvent(Resource.LECTURE, lectureId, Action.NAVIGATE, {})
          }
        >
          <ButtonIcon icon="x-mark" />
        </Link>
      </div>
      <div className="w-full bg-slate-100 dark:bg-slate-800 h-1">
        <div
          className="bg-cyan-600 dark:bg-cyan-500 h-full transition-all duration-150 ease-out"
          style={{
            width: `${progress * 100}%`,
          }}
        />
      </div>
    </nav>
  );
}
