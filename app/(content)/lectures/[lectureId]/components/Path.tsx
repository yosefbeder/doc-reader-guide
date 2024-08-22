import Link from "next/link";

import BasePath from "@/components/Path";
import getLecture from "@/utils/getLecture";
import getModule from "@/utils/getModule";
import getPrefix from "@/utils/getPrefix";
import getSubject from "@/utils/getSubject";
import getUser from "@/utils/getUser";

export default async function BPath({ lectureId }: { lectureId: number }) {
  const { yearId } = await getUser();
  const lecture = await getLecture(+lectureId);
  const subject = await getSubject(+lecture.subjectId);
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
      →{" "}
      <Link
        href={`/subjects/${subject.id}`}
        className="text-inherit hover:text-white"
      >
        {subject.name}
      </Link>{" "}
      → {lecture.title}
    </BasePath>
  );
}
