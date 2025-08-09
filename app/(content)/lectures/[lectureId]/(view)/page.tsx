import getLecture, { getLectureLinksAndQuizzes } from "@/utils/getLecture";
import LinksList from "../components/LinksList";
import Path from "../components/Path";

export default async function LinksPage({
  params: { lectureId },
}: {
  params: { lectureId: string };
}) {
  const [lecture, { links, quizzes }] = await Promise.all([
    getLecture(+lectureId),
    getLectureLinksAndQuizzes(+lectureId),
  ]);

  return (
    <>
      <Path lecture={lecture} />
      <main className="main">
        <LinksList links={links} quizzes={quizzes} practicalQuizzes={[]} />
      </main>
    </>
  );
}
