import Link from "next/link";

import BasePath from "@/components/Path";
import getModule from "@/utils/getModule";
import getPrefix from "@/utils/getPrefix";
import getSubject from "@/utils/getSubject";
import getUser from "@/utils/getUser";

export default async function Path({ subjectId }: { subjectId: number }) {
  const { yearId } = await getUser();
  const subject = await getSubject(+subjectId);
  const myModule = await getModule(yearId, +subject.moduleId);

  return (
    <BasePath>
      {myModule.semesterName}
      <sup>{getPrefix(myModule.semesterName)}</sup> Semester →{" "}
      <Link
        href={`/modules/${myModule.id}`}
        className="text-inherit hover:text-white"
      >
        {myModule.name}
      </Link>{" "}
      → {subject.name}
    </BasePath>
  );
}
