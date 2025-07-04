import Path from "../components/Path";
import getLecture, { getLectureLinksAndQuizzes } from "@/utils/getLecture";
import AddLinkForm from "./components/AddLinkForm";
import AddQuizForm from "./components/AddQuizForm";
import LinksList from "./components/LinksList";
import Templates from "@/components/Templates";

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
      <main className="main flex flex-col gap-4">
        <h2>New link</h2>
        <AddLinkForm lectureId={+lectureId} />
        <h2>Quick Add</h2>
        <h3>Templates</h3>
        <Templates />
        <h3>Form</h3>
        <AddQuizForm lectureId={+lectureId} />
        <LinksList lectureId={+lectureId} links={links} quizzes={quizzes} />
      </main>
    </>
  );
}
