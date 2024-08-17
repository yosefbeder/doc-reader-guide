import getModule from "@/utils/getModule";
import getSubject from "@/utils/getSubject";
import getUser from "@/utils/getUser";
import getLecture, { getLectureLinks } from "@/utils/getLecture";

import Links from "../../components/Links";
import Path from "../../components/Path";

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
      <Path subject={subject} module={module} lecture={lecture} />
      <main className="main">
        <Links links={links} />
      </main>
    </>
  );
}
