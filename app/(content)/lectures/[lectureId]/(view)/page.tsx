import { Metadata } from "next";

import getLecture from "@/utils/getLecture";
import LinksList from "../components/LinksList";
import Path from "../components/Path";
import HtmlContentServer from "@/components/HtmlContentServer";
import StructuredData from "../components/StructuredData";
import buildCanonical from "@/utils/buildCanonical";

interface Props {
  params: { lectureId: string };
}

export async function generateMetadata({
  params: { lectureId },
}: Props): Promise<Metadata> {
  const lecture = await getLecture(+lectureId);
  if (!lecture) return { robots: { index: false, follow: false } };

  const faculty = `${lecture.subject.module.year.faculty.name} ${lecture.subject.module.year.faculty.city}`;
  const start =
    lecture.type === "Normal"
      ? lecture.title
      : `${lecture.subject.module.name} ${lecture.subject.name} ${
          lecture.type === "FinalRevision" ? "Final Revision" : "Practical"
        }`;
  let title;
  if (start.length > 35) title = start;
  else title = `${start} | ${faculty}`;
  const description = `Access lecture notes, resources, and quizzes (MCQ and written) for ${start}, part of ${faculty} curriculum.`;

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
    ...buildCanonical(`/lectures/${lectureId}`),
  };
}

export default async function LinksPage({ params: { lectureId } }: Props) {
  const lecture = await getLecture(+lectureId);

  return (
    <>
      <Path lecture={lecture} />
      <main className="main flex max-md:flex-col-reverse gap-4">
        <LinksList
          links={lecture.links.toSorted((a, b) => a.id - b.id)}
          mcqQuizzes={lecture.mcqQuizzes.toSorted((a, b) => a.id - b.id)}
          writtenQuizzes={lecture.writtenQuizzes.toSorted(
            (a, b) => a.id - b.id
          )}
        />
        {lecture.note && lecture.note !== "<p><br></p>" && (
          <HtmlContentServer
            className="flex-1 rounded-xl p-2 bg-slate-50"
            html={lecture.note}
          />
        )}
      </main>
      <StructuredData lecture={lecture} />
    </>
  );
}
