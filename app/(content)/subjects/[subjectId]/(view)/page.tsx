import { Metadata } from "next";

import Path from "../components/Path";
import getSubject from "@/utils/getSubject";
import MasonryCardContainer from "@/components/MasonryCardContainer";
import getLectures from "@/utils/getLectures";
import Lecture from "./components/Lecture";
import Message from "@/components/Message";
import Script from "next/script";

interface Props {
  params: { subjectId: string };
}

export async function generateMetadata({
  params: { subjectId },
}: Props): Promise<Metadata> {
  const subject = await getSubject(+subjectId);
  if (!subject) return { robots: { index: false, follow: false } };

  const faculty = `${subject.module.year.faculty.name} ${subject.module.year.faculty.city}`;
  const title = `${subject.module.name} ${subject.name} | ${faculty}`;
  const description = `Find all lectures for ${subject.module.name} ${subject.name} with resources, quizzes (MCQ and written), and notes. Tailored for students of ${faculty}.`;

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

export async function generateStaticParams() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/subjects`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_JWT}`,
    },
  });
  const json = await res.json();
  return json.data.subjects.map(({ id }: { id: number }) => ({
    subjectId: id.toString(),
  }));
}

export default async function LecturesPage({
  params: { subjectId },
}: {
  params: { subjectId: string };
}) {
  const [subject, lectures] = await Promise.all([
    getSubject(+subjectId),
    getLectures(+subjectId),
  ]);

  const faculty = `${subject.module.year.faculty.name} ${subject.module.year.faculty.city}`;
  const moduleName = subject.module.name;

  const data = {
    "@context": "https://schema.org",
    "@type": "Course",
    name: `${moduleName} ${subject.name}`,
    description: `This subject is part of the ${moduleName} in the ${faculty} curriculum, offering detailed lectures, reference notes, and practice quizzes. Students can access normal lectures, practical sessions, and final revisions tailored to their subject area, ensuring both theoretical understanding and exam readiness.`,
    provider: {
      "@type": "CollegeOrUniversity",
      name: faculty,
    },
    hasCourseInstance: lectures.map((lecture) => ({
      "@type": "LearningResource",
      learningResourceType: "Lecture",
      name: lecture.title,
      url: `${process.env.NEXT_PUBLIC_FRONTEND_URL}/lectures/${lecture.id}`,
    })),
    url: `${process.env.NEXT_PUBLIC_FRONTEND_URL}/subjects/${subject.id}`,
  };

  return (
    <>
      <Path subject={subject} />
      <main className="main">
        {lectures.length === 0 ? (
          <Message type="warning">No lectures have been added yet</Message>
        ) : (
          <MasonryCardContainer>
            {[
              ...lectures
                .filter((lecture) => lecture.type !== "Normal")
                .map((lecture, index) => (
                  <Lecture key={index} lecture={lecture} />
                )),
              ...lectures
                .filter((lecture) => lecture.type === "Normal")
                .map((lecture, index) => (
                  <Lecture key={index} lecture={lecture} />
                )),
            ]}
          </MasonryCardContainer>
        )}
      </main>
      <Script
        id={`ld-subject-${subject.id}`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
      />
    </>
  );
}
