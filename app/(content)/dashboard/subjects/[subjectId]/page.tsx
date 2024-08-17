import UpdateSubjectForm from "../components/UpdateSubjectForm";
import getUser from "@/utils/getUser";
import getSubject from "@/utils/getSubject";

export default async function UpdateSubjectPage({
  params: { subjectId },
}: {
  params: { subjectId: string };
}) {
  const { yearId } = await getUser();
  const subject = await getSubject(+subjectId);

  return (
    <main className="main">
      <h2 className="mb-4">تعديل المادة {subject.id}</h2>
      <UpdateSubjectForm yearId={yearId} subject={subject} />
    </main>
  );
}
