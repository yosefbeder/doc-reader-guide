import Path from "@/components/Path";
import getLecture, { getLectureLinks } from "@/utils/getLecture";
import getModule from "@/utils/getModule";
import getPrefix from "@/utils/getPrefix";
import getSubject from "@/utils/getSubject";
import getUser from "@/utils/getUser";
import Links from "@/components/Links";

export default async function LinksPage({
  params: { lectureId },
}: {
  params: { lectureId: string };
}) {
  const { yearId } = await getUser();
  const lecture = await getLecture(+lectureId);
  const subject = await getSubject(+lecture.subjectId);
  const module = await getModule(yearId, +subject.moduleId);
  const links = await getLectureLinks(+lectureId);

  return (
    <>
      <Path>
        {module.semesterName}
        <sup>{getPrefix(module.semesterName)}</sup> Semester → {module.name} →{" "}
        {subject.name} → {lecture.title}
      </Path>
      <main className="main">
        <Links links={links} />
      </main>
    </>
  );
}
