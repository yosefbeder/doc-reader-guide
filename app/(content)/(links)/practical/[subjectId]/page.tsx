import getModule from "@/utils/getModule";
import getSubject from "@/utils/getSubject";
import getUser from "@/utils/getUser";
import getPractical, { getPracticalLinks } from "@/utils/getPractical";

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
  const lecture = await getPractical(+subjectId);
  const links = await getPracticalLinks(+subjectId);

  return (
    <>
      <Path subject={subject} myModule={myModule} lecture={lecture} />
      <main className="main">
        <Links links={links} />
      </main>
    </>
  );
}
