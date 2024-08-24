import Link from "next/link";

import BasePath from "@/components/Path";
import getLecture from "@/utils/getLecture";
import getPrefix from "@/utils/getPrefix";

export default async function Path({ lectureId }: { lectureId: number }) {
  const { semesterName, moduleId, moduleName, subjectId, subjectName, title } =
    await getLecture(+lectureId);
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
