import Link from "next/link";
import Image from "next/image";
import { Metadata } from "next";

import getSubjects from "@/utils/getSubjects";
import Path from "../components/Path";
import getModule from "@/utils/getModule";
import Message from "@/components/Message";
import StructuredData from "../components/StructuredData";
import buildCanonical from "@/utils/buildCanonical";

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
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/modules`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_JWT}`,
    },
  });
  const json = await res.json();
  return json.data.modules.map(({ id }: { id: number }) => ({
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
            {subjects.map(({ id, name, icon, _count: { lectures } }, index) => (
              <li key={index}>
                <Link href={`/subjects/${id}`} className="card relative group">
                  <span>
                    <Image src={icon} alt={name} width={48} height={48} />
                  </span>
                  <h3>{name}</h3>
                  <div className="flex gap-2 items-center absolute left-0 top-0 p-2 rounded-tl-xl rounded-br-xl bg-cyan-600 text-white font-bold text-sm">
                    {lectures}{" "}
                    <span className="hidden group-hover:inline">
                      LECTURE{lectures > 1 && "S"}
                    </span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </main>
      <StructuredData myModule={myModule} subjects={subjects} />
    </>
  );
}
