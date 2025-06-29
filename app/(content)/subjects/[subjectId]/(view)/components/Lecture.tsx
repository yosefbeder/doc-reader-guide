import Link from "next/link";

import { Lecture as LectureType } from "@/types";
import { icons } from "@/components/icons";

export default function Lecture({
  lecture: { id, title, date, type },
}: {
  lecture: LectureType;
}) {
  return (
    <Link
      href={`/lectures/${id}`}
      className={`card min-h-36 max-[512px]:min-h-max group ${
        type !== "Normal"
          ? "bg-cyan-600 hover:bg-cyan-700 text-white transition-colors"
          : ""
      }`}
    >
      {type === "Practical" && (
        <span className="text-white">{icons["breaker-large"]}</span>
      )}
      {type === "FinalRevision" && (
        <span className="text-white">{icons["book-open-large"]}</span>
      )}
      <h2
        className={`line-clamp-2 group-hover:line-clamp-none max-[512px]:line-clamp-none ${
          type !== "Normal" ? "text-white" : ""
        }`}
      >
        {type === "Normal"
          ? title
          : type === "FinalRevision"
          ? "Final Revision"
          : "Practical"}
      </h2>
      {type === "Normal" && (
        <time dateTime={new Date(date).toISOString()}>
          {new Date(date).toDateString()}
        </time>
      )}
    </Link>
  );
}
