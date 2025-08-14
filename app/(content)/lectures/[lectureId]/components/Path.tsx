import Link from "next/link";

import BasePath from "@/components/Path";
import { Lecture } from "@/types";
import getPrefix from "@/utils/getPrefix";

export default function Path({
  lecture: {
    title,
    subject: {
      id: subjectId,
      name: subjectName,
      module: { id: moduleId, name: moduleName, semesterName },
    },
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
        className="link text-inherit hover:text-white"
      >
        {moduleName}
      </Link>{" "}
      →{" "}
      <Link
        href={`/subjects/${subjectId}`}
        className="link text-inherit hover:text-white"
      >
        {subjectName}
      </Link>{" "}
      → {title}
    </BasePath>
  );
}
