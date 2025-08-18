import { Metadata } from "next";

import Path from "../components/Path";
import getSubject from "@/utils/getSubject";
import MasonryCardContainer from "@/components/MasonryCardContainer";
import getLectures from "@/utils/getLectures";
import Lecture from "./components/Lecture";

interface Props {
  params: { subjectId: string };
}

export async function generateMetadata({
  params: { subjectId },
}: Props): Promise<Metadata> {
  const subject = await getSubject(+subjectId);
  if (!subject) return { robots: { index: false, follow: false } };

  const faculty = `${subject.module.year.faculty.city} ${subject.module.year.faculty.name}`;
  const title = `${subject.module.name} ${subject.name} | ${faculty}`;
  const description = "Medical lecture notes, links, and quizzes.";

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

  return (
    <>
      <Path subject={subject} />
      <main className="main">
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
      </main>
    </>
  );
}
