import Link from "next/link";

import { Lecture } from "@/types";
import getPrefix from "@/utils/getPrefix";

function getHighlightedText(text: string, highlight: string): React.ReactNode {
  const parts = text.split(new RegExp(`(${highlight})`, "gi"));
  return (
    <span>
      {parts.map((part, index) =>
        part.toLowerCase() === highlight.toLowerCase() ? (
          <mark key={index}>{part}</mark>
        ) : (
          part
        )
      )}
    </span>
  );
}

function LecturePlaceholder() {
  return (
    <div className="animate-pulse py-2">
      <div className="w-2/3 h-6 mb-1.5 rounded bg-slate-200"></div>
      <div className="w-2/5 h-5 mb-1 rounded bg-slate-200"></div>
      <div className="w-1/5 h-5 rounded bg-slate-200"></div>
    </div>
  );
}

export default function LecturesList({
  lectures,
  search,
  onClose,
}: {
  lectures?: Lecture[];
  search: string;
  onClose: React.MouseEventHandler<HTMLAnchorElement>;
}) {
  if (lectures && lectures.length === 0) return <p>No lecture was found</p>;

  return (
    <ul className="[&>li:not(:last-child)]:border-b h-max max-h-80 max-[512px]:max-h-none overflow-y-scroll max-[512px]:overflow-y-visible">
      {lectures ? (
        lectures.map(
          ({
            id,
            title,
            date,
            subject: {
              name: subjectName,
              module: { name: moduleName, semesterName },
            },
          }) => (
            <li key={id}>
              <Link
                href={`/lectures/${id}`}
                className="block no-underline text-inherit hover:text-inherit py-2"
                onClick={onClose}
              >
                <p>{getHighlightedText(title, search)}</p>
                <p className="text-sm text-slate-500">
                  {semesterName}
                  <sup>{getPrefix(semesterName)}</sup> Semester → {moduleName} →{" "}
                  {subjectName}
                  <br />
                  {new Date(date).toDateString()}
                </p>
              </Link>
            </li>
          )
        )
      ) : (
        <>
          <li>
            <LecturePlaceholder />
          </li>
          <li>
            <LecturePlaceholder />
          </li>
          <li>
            <LecturePlaceholder />
          </li>
          <li>
            <LecturePlaceholder />
          </li>
          <li>
            <LecturePlaceholder />
          </li>
          <li>
            <LecturePlaceholder />
          </li>
          <li>
            <LecturePlaceholder />
          </li>
          <li>
            <LecturePlaceholder />
          </li>
        </>
      )}
    </ul>
  );
}
