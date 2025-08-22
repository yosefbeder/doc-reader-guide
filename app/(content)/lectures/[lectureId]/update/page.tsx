import Path from "../components/Path";
import getLecture from "@/utils/getLecture";
import LinksList from "./components/LinksList";
import AddSection from "./components/AddSection";
import Note from "./components/Note";
import getUser from "@/utils/getUserServer";

export default async function UpdateLinksPage({
  params: { lectureId },
}: {
  params: { lectureId: string };
}) {
  const user = await getUser();
  const lecture = await getLecture(+lectureId);
  return (
    <>
      <Path lecture={lecture} />
      <main className="main flex flex-col gap-4">
        <Note lecture={lecture} />
        <hr />
        <AddSection lectureId={+lectureId} />
        <hr />
        <LinksList
          user={user}
          lectureId={+lectureId}
          links={lecture.links}
          mcqQuizzes={lecture.mcqQuizzes}
          writtenQuizzes={lecture.writtenQuizzes}
        />
      </main>
    </>
  );
}
