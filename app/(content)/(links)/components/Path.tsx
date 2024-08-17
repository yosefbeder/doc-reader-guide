import Link from "next/link";

import BasicPath from "@/components/Path";
import { Module, Lecture, Subject } from "@/types";
import getPrefix from "@/utils/getPrefix";

export default function Path({
  module,
  subject,
  lecture,
}: {
  module: Module;
  subject: Subject;
  lecture: Lecture;
}) {
  return (
    <BasicPath>
      {module.semesterName}
      <sup>{getPrefix(module.semesterName)}</sup> Semester →{" "}
      <Link
        href={`/modules/${module.id}`}
        className="text-inherit hover:text-white"
      >
        {module.name}
      </Link>{" "}
      →{" "}
      <Link
        href={`/subjects/${subject.id}`}
        className="text-inherit hover:text-white"
      >
        {subject.name}
      </Link>{" "}
      → {lecture.title}
    </BasicPath>
  );
}
