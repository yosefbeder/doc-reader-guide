import Path from "../components/Path";
import getLecture from "@/utils/getLectureServer";
import LinksList from "./components/LinksList";
import AddSection from "./components/AddSection";
import Note from "./components/Note";
import getUser from "@/utils/getUserServer";

export default async function UpdateLinksPage(props: {
  params: Promise<{ lectureId: string }>;
}) {
  const params = await props.params;

  const { lectureId } = params;

  const user = await getUser();
  const lecture = await getLecture(+lectureId, true);
  return (
    <>
      <Path lecture={lecture} />
      <main className="main col">
        <Note user={user} lecture={lecture} />
        <hr />
        <AddSection
          lectureId={+lectureId}
          yearId={lecture.subject.module.year.id}
        />
        <hr />
        <LinksList
          user={user}
          lectureId={+lectureId}
          yearId={lecture.subject.module.year.id}
          links={lecture.links.toSorted((a, b) => a.id - b.id)}
          mcqQuizzes={lecture.mcqQuizzes.toSorted((a, b) => a.id - b.id)}
          writtenQuizzes={lecture.writtenQuizzes.toSorted(
            (a, b) => a.id - b.id
          )}
        />
      </main>
    </>
  );
}
