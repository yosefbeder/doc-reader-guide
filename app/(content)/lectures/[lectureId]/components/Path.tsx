import Link from "next/link";

import BasePath from "@/components/Path";
import { Lecture } from "@/types";
import getPrefix from "@/utils/getPrefix";

export default function Path({
  lecture: {
    semesterName,
    moduleId,
    moduleName,
    subjectId,
    subjectName,
    title,
  },
}: {
  lecture: Lecture;
}) {
  return (
    <BasePath>
      {semesterName}
      <sup>{getPrefix(semesterName)}</sup> Semester →{" "}
      <Link
        href={`/modules/${moduleId}`}
        className="text-inherit hover:text-white"
      >
        {moduleName}
      </Link>{" "}
      →{" "}
      <Link
        href={`/subjects/${subjectId}`}
        className="text-inherit hover:text-white"
      >
        {subjectName}
      </Link>{" "}
      → {title}
    </BasePath>
  );
}
