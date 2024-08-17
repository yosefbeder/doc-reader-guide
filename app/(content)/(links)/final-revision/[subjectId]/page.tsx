import getModule from "@/utils/getModule";
import getSubject from "@/utils/getSubject";
import getUser from "@/utils/getUser";
import getFinalRevision, {
  getFinalRevisionLinks,
} from "@/utils/getFinalRevision";

import Path from "../../components/Path";
import Links from "../../components/Links";

export default async function PracticalPage({
  params: { subjectId },
}: {
  params: { subjectId: string };
}) {
  const { yearId } = await getUser();
  const subject = await getSubject(+subjectId);
  const myModule = await getModule(yearId, subject.moduleId);
  const lecture = await getFinalRevision(+subjectId);
  const links = await getFinalRevisionLinks(+subjectId);

  return (
    <>
      <Path subject={subject} myModule={myModule} lecture={lecture} />
      <main className="main">
        <Links links={links} />
      </main>
    </>
  );
}
