import { API_URL } from "@/constants";
import Path from "../components/Path";
import getLecture, { getLectureLinks } from "@/utils/getLecture";

const icons = {
  Video: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="size-6"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m15.75 10.5 4.72-4.72a.75.75 0 0 1 1.28.53v11.38a.75.75 0 0 1-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25h-9A2.25 2.25 0 0 0 2.25 7.5v9a2.25 2.25 0 0 0 2.25 2.25Z"
      />
    </svg>
  ),
  PDF: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="size-6"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
      />
    </svg>
  ),
  Record: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="size-6"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 18.75a6 6 0 0 0 6-6v-1.5m-6 7.5a6 6 0 0 1-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 0 1-3-3V4.5a3 3 0 1 1 6 0v8.25a3 3 0 0 1-3 3Z"
      />
    </svg>
  ),
  Data: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="size-6"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
      />
    </svg>
  ),
};

export async function generateStaticParams() {
  const res = await fetch(`${API_URL}/lectures`);
  const json = await res.json();
  return json.data.map(({ id }: { id: number }) => ({
    lectureId: id.toString(),
  }));
}

export default async function LinksPage({
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
        {[
          links.filter(({ category }) => category === "Data"),
          links.filter(({ category }) => category === "College"),
          links.filter(({ category }) => category === "Summary"),
        ].map((links, index) => (
          <details key={index} className="mb-4" open>
            <summary>
              <h2>{["مصادر خارجية", "الكلية", "الملخصات"][index]}</h2>
            </summary>
            <ul>
              {links.map(({ title, subTitle, url, type }, index) => (
                <li key={index}>
                  <a
                    className="flex items-center gap-2 my-2 no-underline text-inherit hover:text-inherit"
                    target="_blank"
                    href={url}
                  >
                    <span>{icons[type]}</span>
                    {subTitle.trim() ? (
                      <div>
                        <div>{title}</div>
                        <div className="text-sm text-slate-500">{subTitle}</div>
                      </div>
                    ) : (
                      title
                    )}
                  </a>
                </li>
              ))}
            </ul>
          </details>
        ))}
      </main>
    </>
  );
}
