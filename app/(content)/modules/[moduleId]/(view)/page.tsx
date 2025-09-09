import Link from "next/link";
import Image from "next/image";
import { Metadata } from "next";

import getSubjects from "@/utils/getSubjects";
import Path from "../components/Path";
import getModule from "@/utils/getModule";
import Message from "@/components/Message";
import StructuredData from "../components/StructuredData";
import buildCanonical from "@/utils/buildCanonical";
import { listModules } from "@/utils/allData";
import SubjectCard from "../components/SubjectCard";

type Props = { params: { moduleId: string } };

export async function generateMetadata({
  params: { moduleId },
}: Props): Promise<Metadata> {
  const myModule = await getModule(+moduleId);
  if (!myModule) return { robots: { index: false, follow: false } };

  const faculty = `${myModule.year.faculty.name} ${myModule.year.faculty.city}`;
  const title = `${myModule.name} | ${faculty}`;
  const description = `Explore all subjects for ${myModule.name} with lectures, resources, quizzes (MCQ and written), and notes. Designed for students of ${faculty}.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
    },
    twitter: {
      card: "summary",
      title,
      description,
    },
    ...buildCanonical(`/modules/${moduleId}`),
  };
}

export async function generateStaticParams() {
  const modules = await listModules();
  return modules.map(({ id }: { id: number }) => ({
    moduleId: id.toString(),
  }));
}

export default async function SubjectsPage({ params: { moduleId } }: Props) {
  const [myModule, subjects] = await Promise.all([
    getModule(+moduleId),
    getSubjects(+moduleId),
  ]);

  return (
    <>
      <Path myModule={myModule} />
      <main className="main">
        {subjects.length === 0 ? (
          <Message type="warning">No subjects have been added yet</Message>
        ) : (
          <ul className="card-container">
            {subjects.map((subject) => (
              <li key={subject.id}>
                <SubjectCard subject={subject} />
              </li>
            ))}
          </ul>
        )}
      </main>
      <StructuredData myModule={myModule} subjects={subjects} />
    </>
  );
}
