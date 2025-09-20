"use client";

import Link from "next/link";

import { Action, Lecture, Resource } from "@/types";
import { icons } from "@/components/icons";
import { logEvent } from "@/lib/event-logger";
import HtmlContentClient from "@/components/HtmlContentClient";

export default function LectureCard({
  lecture: { id, title, date, type, note },
}: {
  lecture: Lecture;
}) {
  return (
    <Link
      href={`/lectures/${id}`}
      className={`relative card min-h-36 max-[512px]:min-h-max group ${
        type !== "Normal"
          ? "bg-cyan-600 hover:bg-cyan-700 text-white dark:bg-cyan-600 dark:hover:bg-cyan-700"
          : ""
      }`}
      onClick={() => logEvent(Resource.LECTURE, id, Action.NAVIGATE, {})}
    >
      {note && note !== "<p><br></p>" && (
        <>
          <div
            className="peer absolute top-0.5 left-0.5"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
          >
            {icons["information-circle"]}
          </div>
          <HtmlContentClient
            html={note}
            className="absolute top-3 left-3 hidden hover:block rounded-xl shadow-xl peer-hover:block w-full h-full p-2 bg-white dark:bg-slate-600 overflow-y-scroll"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
          />
        </>
      )}
      {type === "Practical" && (
        <span className="text-white">{icons["breaker-large"]}</span>
      )}
      {type === "FinalRevision" && (
        <span className="text-white">{icons["book-open-large"]}</span>
      )}
      <h3
        className={`line-clamp-2 group-hover:line-clamp-none max-[512px]:line-clamp-none ${
          type !== "Normal" ? "text-white" : ""
        }`}
      >
        {type === "Normal"
          ? title
          : type === "FinalRevision"
          ? "Final Revision"
          : "Practical"}
      </h3>
      {type === "Normal" && (
        <time dateTime={new Date(date).toISOString()}>
          {new Date(date).toDateString()}
        </time>
      )}
    </Link>
  );
}
