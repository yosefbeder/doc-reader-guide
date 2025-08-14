import Link from "next/link";

import BasePath from "./Path";
import { WrittenQuiz, McqQuiz } from "@/types";
import getPrefix from "@/utils/getPrefix";

export default function Path({
  quiz: {
    title,
    lectureData: {
      id: lectureId,
      title: lectureTitle,
      subject: {
        id: subjectId,
        name: subjectName,
        module: { id: moduleId, name: moduleName, semesterName },
      },
    },
  },
}: {
  quiz: McqQuiz | WrittenQuiz;
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
      →{" "}
      <Link
        href={`/lectures/${lectureId}`}
        className="link text-inherit hover:text-white"
      >
        {lectureTitle}
      </Link>{" "}
      → {title}
    </BasePath>
  );
}
