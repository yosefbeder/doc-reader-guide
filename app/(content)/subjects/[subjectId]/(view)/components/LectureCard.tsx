"use client";

import Link from "next/link";

import { Action, Lecture, Resource } from "@/types";
import { icons } from "@/components/icons";
import { logEvent } from "@/lib/event-logger";
import HtmlContentClient from "@/components/HtmlContentClient";
import { useState } from "react";
import Dialogue from "@/components/Dialogue";

export default function LectureCard({
  lecture: { id, title, date, type, note },
}: {
  lecture: Lecture;
}) {
  const [noteOpen, setNoteOpen] = useState(false);

  return (
    <>
      {noteOpen && note && note !== "<p><br></p>" && (
        <Dialogue
          header={`Notes of ${title}`}
          className="rounded-xl"
          onClose={() => setNoteOpen(false)}
        >
          <HtmlContentClient html={note} className="p-2" />
        </Dialogue>
      )}
      <Link
        href={`/lectures/${id}`}
        className={`relative card layer-1 min-h-36 max-[512px]:min-h-max group ${
          type !== "Normal"
            ? "!bg-cyan-600 hover:!bg-cyan-700 text-white transition-colors"
            : ""
        }`}
        onClick={() => logEvent(Resource.LECTURE, id, Action.NAVIGATE, {})}
      >
        {note && note !== "<p><br></p>" && (
          <div
            className="absolute top-0.5 left-0.5"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setNoteOpen(true);
            }}
          >
            {icons["information-circle"]}
          </div>
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
    </>
  );
}
