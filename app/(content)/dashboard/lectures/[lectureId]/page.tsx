import getUser from "@/utils/getUser";
import UpdateLectureForm from "../components/UpdateLectureForm";
import getAllLectures from "@/utils/getAllLectures";

export default async function UpdateLecturePage({
  params: { lectureId },
}: {
  params: { lectureId: string };
}) {
  const { yearId } = await getUser();
  const lectures = await getAllLectures(yearId);

  return (
    <main className="main">
      <h2 className="mb-4">تعديل المحاضرة {lectureId}</h2>
      <UpdateLectureForm lectureId={+lectureId} lectures={lectures} />
    </main>
  );
}
