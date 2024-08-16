import Path from "@/components/Path";
import getModule from "@/utils/getModule";
import getPrefix from "@/utils/getPrefix";
import getSubject from "@/utils/getSubject";
import getUser from "@/utils/getUser";
import Links from "@/components/Links";
import getFinalRevision, {
  getFinalRevisionLinks,
} from "@/utils/getFinalRevision";

export default async function PracticalPage({
  params: { subjectId },
}: {
  params: { subjectId: string };
}) {
  const { yearId } = await getUser();
  const subject = await getSubject(+subjectId);
  const module = await getModule(yearId, subject.moduleId);
  const lecture = await getFinalRevision(+subjectId);
  const links = await getFinalRevisionLinks(+subjectId);

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
