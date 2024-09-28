import Path from "../components/Path";
import getSubject from "@/utils/getSubject";
import getLectures from "@/utils/getLectures";
import UpdateLectureForm from "./components/UpdateLectureForm";
import AddLectureForm from "./components/AddLectureForm";

export default async function LecturesPage({
  params: { subjectId },
}: {
  params: { subjectId: string };
}) {
  const subject = await getSubject(+subjectId);
  const lectures = await getLectures(+subjectId);

  return (
    <>
      <Path subject={subject} />
      <main className="main">
        <ul className="card-container">
          <li>
            <AddLectureForm subjectId={+subjectId} />
          </li>
          {lectures
            .filter((lecture) => lecture.type === "Normal")
            .map((lecture) => (
              <li key={lecture.id}>
                <UpdateLectureForm subjectId={+subjectId} lecture={lecture} />
              </li>
            ))}
        </ul>
      </main>
    </>
  );
}
