import Path from "../components/Path";
import getSubject from "@/utils/getSubject";
import getLectures from "@/utils/getLectures";
import UpdateLectureForm from "./components/UpdateLectureForm";
import AddLectureForm from "./components/AddLectureForm";
import DeleteSpecial from "./components/DeleteSpecial";

export default async function LecturesPage({
  params: { subjectId },
}: {
  params: { subjectId: string };
}) {
  const [subject, lectures] = await Promise.all([
    getSubject(+subjectId),
    getLectures(+subjectId),
  ]);

  return (
    <>
      <Path subject={subject} />
      <main className="main">
        <ul className="card-container">
          <li>
            <AddLectureForm subjectId={+subjectId} />
          </li>
          {lectures.filter(({ type }) => type !== "Normal").length > 0 && (
            <li>
              <DeleteSpecial
                lectures={lectures.filter(({ type }) => type !== "Normal")}
              />
            </li>
          )}
          {lectures
            .filter(({ type }) => type === "Normal")
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
