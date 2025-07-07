import Path from "../components/Path";
import getLecture, { getLectureLinksAndQuizzes } from "@/utils/getLecture";
import AddLinkForm from "./components/AddLinkForm";
import AddQuizForm from "./components/AddQuizForm";
import LinksList from "./components/LinksList";
import Templates from "@/components/Templates";
import AddPracticalQuizForm from "./components/AddPracticalQuizForm";

export default async function UpdateLinksPage({
  params: { lectureId },
}: {
  params: { lectureId: string };
}) {
  const [lecture, { links, quizzes, practicalQuizzes }] = await Promise.all([
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
        <AddQuizForm lectureId={+lectureId} />
        <hr />
        <h2>New Practical Quiz</h2>
        <AddPracticalQuizForm lectureId={+lectureId} />
        <hr />
        <LinksList
          lectureId={+lectureId}
          links={links}
          quizzes={quizzes}
          practicalQuizzes={practicalQuizzes}
        />
      </main>
    </>
  );
}
