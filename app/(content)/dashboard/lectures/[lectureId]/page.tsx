import getUser from "@/utils/getUser";
import getLecture from "@/utils/getLecture";
import getAllSubjects from "@/utils/getAllSubjects";

import UpdateLectureForm from "../components/UpdateLectureForm";

export default async function UpdateLecturePage({
  params: { lectureId },
}: {
  params: { lectureId: string };
}) {
  return <main className="main">🧑‍💻: تحت الصيانة...</main>;
  const { yearId } = await getUser();
  const subjects = await getAllSubjects(yearId);
  const lecture = await getLecture(+lectureId);

  return (
    <main className="main">
      <h2 className="mb-4">تعديل المحاضرة {lecture.id}</h2>
      <UpdateLectureForm subjects={subjects} lecture={lecture} />
    </main>
  );
}
