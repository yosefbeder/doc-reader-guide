import getUser from "@/utils/getUser";
import UpdateLectureForm from "../components/UpdateLectureForm";
import getLecture from "@/utils/getLecture";
import getModules from "@/utils/getModules";
import getSubjects from "@/utils/getSubjects";

export default async function UpdateLecturePage({
  params: { lectureId },
}: {
  params: { lectureId: string };
}) {
  const { yearId } = await getUser();
  const modules = await getModules(yearId);
  const subjects = (
    await Promise.all(
      modules.map(async (myModule) => await getSubjects(yearId, myModule.id))
    )
  ).flat();
  const lecture = await getLecture(+lectureId);

  return (
    <main className="main">
      <h2 className="mb-4">تعديل المحاضرة {lecture.id}</h2>
      <UpdateLectureForm subjects={subjects} lecture={lecture} />
    </main>
  );
}
