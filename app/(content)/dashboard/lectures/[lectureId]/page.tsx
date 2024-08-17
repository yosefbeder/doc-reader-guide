import UpdateLectureForm from "../components/UpdateLectureForm";
import getLecture from "@/utils/getLecture";

export default async function UpdateLecturePage({
  params: { lectureId },
}: {
  params: { lectureId: string };
}) {
  const lecture = await getLecture(+lectureId);

  return (
    <main className="main">
      <h2 className="mb-4">تعديل المحاضرة {lecture.id}</h2>
      <UpdateLectureForm lecture={lecture} />
    </main>
  );
}
