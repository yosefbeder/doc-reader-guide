import { Metadata } from "next";

import getLecture from "@/utils/getLecture";
import LinksList from "../components/LinksList";
import Path from "../components/Path";
import HtmlContentServer from "@/components/HtmlContentServer";

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>?/gm, ""); // removes all tags
}

interface Props {
  params: { lectureId: string };
}

export async function generateMetadata({
  params: { lectureId },
}: Props): Promise<Metadata> {
  const lecture = await getLecture(+lectureId);
  if (!lecture) return { robots: { index: false, follow: false } };

  const faculty = `${lecture.subject.module.year.faculty.city} ${lecture.subject.module.year.faculty.name}`;
  const title = `${
    lecture.type === "Normal"
      ? lecture.title
      : `${lecture.subject.module.name} ${lecture.subject.name} ${
          lecture.type === "FinalRevision" ? "Final Revision" : "Practical"
        }`
  } | ${faculty}`;
  const rawNote = lecture.note || "";
  const plainText = stripHtml(rawNote).trim();
  const description =
    plainText.length > 0
      ? plainText.slice(0, 160)
      : "Medical lecture notes, links, and quizzes.";

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "article",
    },
    twitter: {
      card: "summary",
      title,
      description,
    },
  };
}

export default async function LinksPage({ params: { lectureId } }: Props) {
  const lecture = await getLecture(+lectureId);

  return (
    <>
      <Path lecture={lecture} />
      <main className="main flex max-md:flex-col-reverse gap-4">
        <LinksList
          links={lecture.links}
          mcqQuizzes={lecture.mcqQuizzes}
          writtenQuizzes={lecture.writtenQuizzes}
        />
        {lecture.note && lecture.note !== "<p><br></p>" && (
          <HtmlContentServer
            className="rounded-xl p-2 bg-slate-50"
            html={lecture.note}
          />
        )}
      </main>
    </>
  );
}
