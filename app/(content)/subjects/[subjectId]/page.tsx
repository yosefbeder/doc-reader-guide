import Link from "next/link";

import Path from "@/components/Path";
import getLectures from "@/utils/getLectures";
import getModule from "@/utils/getModule";
import getPrefix from "@/utils/getPrefix";
import getSubject from "@/utils/getSubject";
import getUser from "@/utils/getUser";
import getPractical from "@/utils/getPractical";
import getFinalRevision from "@/utils/getFinalRevision";

export default async function LecturesPage({
  params: { subjectId },
}: {
  params: { subjectId: string };
}) {
  const { yearId } = await getUser();
  const subject = await getSubject(+subjectId);
  const module = await getModule(yearId, +subject.moduleId);
  const lectures = [
    await getPractical(+subjectId),
    await getFinalRevision(+subjectId),
    ...(await getLectures(+subjectId)),
  ];

  return (
    <>
      <Path>
        {module.semesterName}
        <sup>{getPrefix(module.semesterName)}</sup> Semester → {module.name} →{" "}
        {subject.name}
      </Path>
      <main className="main">
        <ul className="card-container">
          {lectures.map(({ id, title, date, createdAt }, index) => (
            <li key={index}>
              <Link
                href={
                  [`/practical/${subjectId}`, `/final-revision/${subjectId}`][
                    index
                  ] || `/lectures/${id}`
                }
                className="card"
              >
                <h2>{title}</h2>
                <time dateTime={new Date(date || createdAt).toISOString()}>
                  {new Date(date || createdAt).toDateString()}
                </time>
              </Link>
            </li>
          ))}
        </ul>
      </main>
    </>
  );
}
