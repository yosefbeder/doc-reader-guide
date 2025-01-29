import Link from "next/link";

import BasePath from "@/components/Path";
import getPrefix from "@/utils/getPrefix";
import { Subject } from "@/types";

export default function Path({
  subject: {
    name,
    module: { semesterName, id: moduleId, name: moduleName },
  },
}: {
  subject: Subject;
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
      → {name}
    </BasePath>
  );
}
