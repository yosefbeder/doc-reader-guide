import Link from "next/link";

import getUser from "@/utils/getUser";
import getAllSubjects from "@/utils/getAllSubjects";
import getAllLectures from "@/utils/getAllLectures";

import ButtonDeleteLecture from "./components/ButtonDeleteLecture";
import AddLectureForm from "./components/AddLectureForm";
import Button from "@/components/Button";

export default async function LecturesPage() {
  const { yearId } = await getUser();
  const subjects = await getAllSubjects(yearId);
  const lectures = await getAllLectures(yearId);

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
              .map(
                ({ id, title, subjectId, date, moduleName, subjectName }) => (
                  <tr key={id}>
                    <td>{id}</td>
                    <td>{title}</td>
                    <td>
                      {moduleName} → {subjectName}
                    </td>
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
                      <ButtonDeleteLecture
                        lectureId={id}
                        subjectId={subjectId}
                      />
                    </td>
                  </tr>
                )
              )}
          </tbody>
        </table>
      </div>
    </main>
  );
}
