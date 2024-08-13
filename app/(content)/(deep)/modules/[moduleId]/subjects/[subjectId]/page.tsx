import Link from "next/link";

import Path from "@/app/(content)/(deep)/components/Path";
import { getLectures } from "@/utils/getLectures";
import getModule from "@/utils/getModule";
import getPrefix from "@/utils/getPrefix";
import getSubject from "@/utils/getSubject";
import getUser from "@/utils/getUser";

export default async function SubjectPage({
  params: { moduleId, subjectId },
}: {
  params: { moduleId: string; subjectId: string };
}) {
  const { yearId } = await getUser();
  const module = await getModule(yearId, +moduleId);
  const subject = await getSubject(+subjectId);
  const lectures = await getLectures(+subjectId);

  return (
    <>
      <Path>
        {module.semesterName}
        <sup>{getPrefix(module.semesterName)}</sup> Semester → {module.name} →{" "}
        {subject.name}
      </Path>
      <main className="main">
        <ul className="flex flex-wrap gap-4">
          {lectures.map(({ id, title, date }, index) => (
            <li key={index}>
              <Link
                href={`/modules/${moduleId}/subjects/${subjectId}/${
                  ["practical", "final-revision"][index] || `lectures/${id}`
                }`}
                className="card"
              >
                <h2>{title}</h2>
                <time dateTime={new Date(date).toISOString()}>
                  {new Date(date).toDateString()}
                </time>
              </Link>
            </li>
          ))}
        </ul>
      </main>
    </>
  );
}
