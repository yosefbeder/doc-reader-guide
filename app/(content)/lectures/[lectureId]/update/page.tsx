import Path from "../components/Path";
import getLecture, { getLectureLinksAndQuizzes } from "@/utils/getLecture";
import LinksList from "./components/LinksList";
import AddSection from "./components/AddSection";

export default async function UpdateLinksPage({
  params: { lectureId },
}: {
  params: { lectureId: string };
}) {
  const [lecture, { links, mcqQuizzes, writtenQuizzes }] = await Promise.all([
    getLecture(+lectureId),
    getLectureLinksAndQuizzes(+lectureId),
  ]);

  return (
    <>
      <Path lecture={lecture} />
      <main className="main flex flex-col gap-4">
        <AddSection lectureId={+lectureId} />
        <hr />
        <LinksList
          lectureId={+lectureId}
          links={links}
          mcqQuizzes={mcqQuizzes}
          writtenQuizzes={writtenQuizzes}
        />
      </main>
    </>
  );
}
