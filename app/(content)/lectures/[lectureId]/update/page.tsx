import Path from "../components/Path";
import getLecture, { getLectureLinks } from "@/utils/getLecture";
import UpdateLinkForm from "./components/UpdateLinkForm";
import AddLinkForm from "./components/AddLinkForm";

export default async function UpdateLinksPage({
  params: { lectureId },
}: {
  params: { lectureId: string };
}) {
  const lecture = await getLecture(+lectureId);
  const links = await getLectureLinks(+lectureId);

  return (
    <>
      <Path lecture={lecture} />
      <main className="main">
        <div className="max-w-lg mb-4">
          <AddLinkForm lectureId={+lectureId} />
        </div>
        {[
          links.filter(({ category }) => category === "Data"),
          links.filter(({ category }) => category === "College"),
          links.filter(({ category }) => category === "Summary"),
        ].map((links, index) => (
          <details key={index} className="[&:not(:last-child)]:mb-4" open>
            <summary>
              <h2>{["مصادر خارجية", "الكلية", "الملخصات"][index]}</h2>
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
      </main>
    </>
  );
}
