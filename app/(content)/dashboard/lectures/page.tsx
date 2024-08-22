import Link from "next/link";

import getLectures from "@/utils/getLectures";
import getModules from "@/utils/getModules";
import getSubjects from "@/utils/getSubjects";
import getUser from "@/utils/getUser";
import AddLectureForm from "./components/AddLectureForm";
import Button from "@/components/Button";
import ButtonDeleteLecture from "./components/ButtonDeleteLecture";

export default async function LecturesPage() {
  const { yearId } = await getUser();
  const modules = await getModules(yearId);
  const subjects = (
    await Promise.all(
      modules.map(async (myModule) => await getSubjects(yearId, myModule.id))
    )
  ).flat();
  const lectures = (
    await Promise.all(
      subjects.map(async (subject) => await getLectures(subject.id))
    )
  ).flat();

  return (
    <main className="main">
      <h2 className="mb-4">إضافة محاضرة</h2>
      <AddLectureForm subjects={subjects} />
      <h2 className="mb-4">عرض المحاضرات</h2>
      <div className="overflow-y-scroll">
        <table className="w-max">
          <thead>
            <tr>
              <th>الرقم التعريفي</th>
              <th>العنوان</th>
              <th>المادة</th>
              <th>التاريخ</th>
              <th>الإجراءات</th>
            </tr>
          </thead>
          <tbody>
            {lectures
              .filter((lecture) => lecture.type === "Normal")
              .map(({ id, title, subjectId, date }) => (
                <tr key={id}>
                  <td>{id}</td>
                  <td>{title}</td>
                  <td>{subjects.find(({ id }) => id === subjectId)!.name}</td>
                  <td>{new Date(date).toDateString()}</td>
                  <td>
                    <Link
                      href={`/dashboard/lectures/${id}`}
                      passHref
                      className="text-inherit hover:text-inherit"
                    >
                      <Button color="yellow" className="ml-2">
                        تعديل
                      </Button>
                    </Link>
                    <ButtonDeleteLecture lectureId={id} subjectId={subjectId} />
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
