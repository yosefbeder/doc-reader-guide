import Path from "@/app/(content)/(deep)/components/Path";
import getLecture, { getLectureLinks } from "@/utils/getLecture";
import getModule from "@/utils/getModule";
import getPrefix from "@/utils/getPrefix";
import getSubject from "@/utils/getSubject";
import getUser from "@/utils/getUser";
import Links from "../../components/Links";

export default async function LecturePage({
  params: { moduleId, subjectId, lectureId },
}: {
  params: { moduleId: string; subjectId: string; lectureId: string };
}) {
  const { yearId } = await getUser();
  const module = await getModule(yearId, +moduleId);
  const subject = await getSubject(+subjectId);
  const lecture = await getLecture(+lectureId);
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
