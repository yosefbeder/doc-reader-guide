import getUser from "@/utils/getUser";
import getSubject from "@/utils/getSubject";
import getModules from "@/utils/getModules";

import UpdateSubjectForm from "../components/UpdateSubjectForm";

export default async function UpdateSubjectPage({
  params: { subjectId },
}: {
  params: { subjectId: string };
}) {
  const { yearId } = await getUser();
  const modules = await getModules(yearId);
  const subject = await getSubject(+subjectId);

  return (
    <main className="main">
      <h2 className="mb-4">تعديل المادة {subject.id}</h2>
      <UpdateSubjectForm modules={modules} subject={subject} />
    </main>
  );
}
