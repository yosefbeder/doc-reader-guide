import Path from "../components/Path";
import getLecture, { getLectureLinksAndQuizzes } from "@/utils/getLecture";
import UpdateLinkForm from "./components/UpdateLinkForm";
import AddLinkForm from "./components/AddLinkForm";
import UpdateQuizForm from "./components/UpdateQuizForm";
import AddQuizForm from "./components/AddQuizForm";

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
        {[
          links.filter(({ category }) => category === "Data"),
          links.filter(({ category }) => category === "College"),
          links.filter(({ category }) => category === "Summary"),
        ].map((links, index) => (
          <details key={index} className="[&:not(:last-child)]:mb-4">
            <summary>
              <h2>{["External", "College", "Summaries"][index]}</h2>
            </summary>
            <ul>
              {links.map((link) => (
                <li
                  key={link.id}
                  className="max-w-lg [&:first-child]:mt-4 [&:not(:last-child)]:mb-4"
                >
                  <UpdateLinkForm lectureId={+lectureId} link={link} />
                </li>
              ))}
            </ul>
          </details>
        ))}
        <details className="mb-4">
          <summary>
            <h2>Questions</h2>
          </summary>
          <ul>
            {quizzes.map((quiz) => (
              <li
                key={quiz.id}
                className="max-w-lg [&:first-child]:mt-4 [&:not(:last-child)]:mb-4"
              >
                <UpdateQuizForm lectureId={+lectureId} quiz={quiz} />
              </li>
            ))}
            {links
              .filter((link) => link.category === "Questions")
              .map((link) => (
                <li
                  key={link.id}
                  className="max-w-lg [&:first-child]:mt-4 [&:not(:last-child)]:mb-4"
                >
                  <UpdateLinkForm lectureId={+lectureId} link={link} />
                </li>
              ))}
          </ul>
        </details>
      </main>
    </>
  );
}
