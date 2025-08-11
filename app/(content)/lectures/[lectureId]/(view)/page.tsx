import getLecture, { getLectureLinksAndQuizzes } from "@/utils/getLecture";
import LinksList from "../components/LinksList";
import Path from "../components/Path";

export default async function LinksPage({
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
      <main className="main">
        <LinksList
          links={links}
          mcqQuizzes={mcqQuizzes}
          writtenQuizzes={writtenQuizzes}
        />
      </main>
    </>
  );
}
