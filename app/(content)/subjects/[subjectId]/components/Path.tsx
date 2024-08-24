import Link from "next/link";

import BasePath from "@/components/Path";
import getPrefix from "@/utils/getPrefix";
import getSubject from "@/utils/getSubject";

export default async function Path({ subjectId }: { subjectId: number }) {
  const { semesterName, moduleId, moduleName, name } = await getSubject(
    +subjectId
  );

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
      → {name}
    </BasePath>
  );
}
