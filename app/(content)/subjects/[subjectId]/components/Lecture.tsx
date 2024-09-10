import Link from "next/link";

import { Lecture as LectureType } from "@/types";

export default function Lecture({
  lecture: { id, title, date },
}: {
  lecture: LectureType;
}) {
  return (
    <Link
      href={`/lectures/${id}`}
      className="card min-h-36 max-[512px]:min-h-max group"
    >
      <h2 className="line-clamp-2 group-hover:line-clamp-none max-[512px]:line-clamp-none">
        {title}
      </h2>
      <time dateTime={new Date(date).toISOString()}>
        {new Date(date).toDateString()}
      </time>
    </Link>
  );
}
