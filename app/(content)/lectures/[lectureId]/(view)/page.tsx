import { Metadata } from "next";
import Script from "next/script";

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
  };
}

export default async function LinksPage({ params: { lectureId } }: Props) {
  const lecture = await getLecture(+lectureId);

  const faculty = `${lecture.subject.module.year.faculty.name} ${lecture.subject.module.year.faculty.city}`;

  const data = {
    "@context": "https://schema.org",
    "@type": "LearningResource",
    learningResourceType: "Lecture",
    name: lecture.title,
    description: `This lecture in ${lecture.subject.name} covers core topics required for medical students at the ${faculty}. Students can access comprehensive lecture notes, supporting links, and related quizzes (MCQ and written). The lecture may include practical demonstrations, normal teaching sessions, or final revision classes to reinforce learning outcomes.`,
    educationalLevel: lecture.subject.module.year,
    provider: {
      "@type": "CollegeOrUniversity",
      name: faculty,
    },
    isPartOf: {
      "@type": "Course",
      name: lecture.subject.name,
      url: `${process.env.NEXT_PUBLIC_FRONTEND_URL}/subjects/${lecture.subject.id}`,
    },
    hasPart: [
      ...lecture.mcqQuizzes.map((quiz) => ({
        "@type": "Quiz",
        name: quiz.title,
        educationalUse: "assessment",
        url: `${process.env.NEXT_PUBLIC_FRONTEND_URL}/mcq-quizzes/${quiz.id}`,
      })),
      ...lecture.writtenQuizzes.map((quiz) => ({
        "@type": "Quiz",
        name: quiz.title,
        educationalUse: "assessment",
        url: `${process.env.NEXT_PUBLIC_FRONTEND_URL}/written-quizzes/${quiz.id}`,
      })),
    ],
    url: `${process.env.NEXT_PUBLIC_FRONTEND_URL}/lectures/${lecture.id}`,
  };

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
      <Script
        id={`ld-lecture-${lecture.id}`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
      />
    </>
  );
}
