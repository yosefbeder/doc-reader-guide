import { Metadata } from "next";

import getLecture from "@/utils/getLecture";
import LinksList from "../components/LinksList";
import Path from "../components/Path";
import HtmlContentServer from "@/components/HtmlContentServer";
import StructuredData from "../components/StructuredData";
import buildCanonical from "@/utils/buildCanonical";
import ChatGPTButton from "@/components/ChatGPTButton";
import Layout from "@/components/Layout";
import formatLectureTitle from "@/utils/formatLectureTitle";
import LectureNote from "@/components/LectureNote";

interface Props {
  params: Promise<{ lectureId: string }>;
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params;

  const {
    lectureId
  } = params;

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

export default async function LinksPage(props: Props) {
  const params = await props.params;

  const {
    lectureId
  } = params;

  const lecture = await getLecture(+lectureId);

  return (
    <Layout title={formatLectureTitle(lecture.title)} updateable>
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
          <LectureNote>
            <HtmlContentServer className="p-2" html={lecture.note} />
          </LectureNote>
        )}
      </main>
      <ChatGPTButton customGPT={lecture.subject.module.customGPT} />
      <StructuredData lecture={lecture} />
    </Layout>
  );
}
