import { Metadata } from "next";

import getSubjects from "@/utils/getSubjects";
import Path from "../components/Path";
import getModule from "@/utils/getModule";
import Message from "@/components/Message";
import StructuredData from "../components/StructuredData";
import buildCanonical from "@/utils/buildCanonical";
import { listModules } from "@/utils/allData";
import SubjectCard from "../components/SubjectCard";
import ChatGPTButton from "@/components/ChatGPTButton";
import Layout from "@/components/Layout";

type Props = { params: Promise<{ moduleId: string }> };

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params;

  const {
    moduleId
  } = params;

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

export default async function SubjectsPage(props: Props) {
  const params = await props.params;

  const {
    moduleId
  } = params;

  const [myModule, subjects] = await Promise.all([
    getModule(+moduleId),
    getSubjects(+moduleId),
  ]);

  return (
    <Layout title={myModule.name} updateable>
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
      <ChatGPTButton customGPT={myModule.customGPT} />
      <StructuredData myModule={myModule} subjects={subjects} />
    </Layout>
  );
}
