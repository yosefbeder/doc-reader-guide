import Link from "next/link";

import BasicPath from "@/components/Path";
import { Module, Lecture, Subject } from "@/types";
import getPrefix from "@/utils/getPrefix";

export default function Path({
  myModule,
  subject,
  lecture,
}: {
  myModule: Module;
  subject: Subject;
  lecture: Lecture;
}) {
  return (
    <BasicPath>
      {myModule.semesterName}
      <sup>{getPrefix(myModule.semesterName)}</sup> Semester →{" "}
      <Link
        href={`/modules/${myModule.id}`}
        className="text-inherit hover:text-white"
      >
        {myModule.name}
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
