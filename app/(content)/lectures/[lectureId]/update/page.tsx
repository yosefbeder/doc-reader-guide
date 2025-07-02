import Path from "../components/Path";
import getLecture, { getLectureLinksAndQuizzes } from "@/utils/getLecture";
import AddLinkForm from "./components/AddLinkForm";
import AddQuizForm from "./components/AddQuizForm";
import LinksList from "./components/LinksList";

export default async function UpdateLinksPage({
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
        <div className="max-w-lg mb-4">
          <h2 className="mb-4">New link</h2>
          <AddLinkForm lectureId={+lectureId} />
        </div>
        <div className="max-w-lg mb-4">
          <h2 className="mb-4">New quiz</h2>
          <AddQuizForm lectureId={+lectureId} />
        </div>
        <LinksList lectureId={+lectureId} links={links} quizzes={quizzes} />
      </main>
    </>
  );
}
