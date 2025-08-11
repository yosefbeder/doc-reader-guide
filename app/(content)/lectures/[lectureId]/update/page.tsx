import Path from "../components/Path";
import getLecture, { getLectureLinksAndQuizzes } from "@/utils/getLecture";
import AddLinkForm from "./components/AddLinkForm";
import AddMcqQuizForm from "./components/AddMcqQuizForm";
import LinksList from "./components/LinksList";
import Templates from "@/components/Templates";
import AddWrittenQuizForm from "./components/AddWrittenQuizForm";

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
        <h2>New link</h2>
        <AddLinkForm lectureId={+lectureId} />
        <hr />
        <h2>Quick Add</h2>
        <h3>Templates</h3>
        <Templates />
        <h3>Form</h3>
        <AddMcqQuizForm lectureId={+lectureId} />
        <hr />
        <h2>New Practical Quiz</h2>
        <AddWrittenQuizForm lectureId={+lectureId} />
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
