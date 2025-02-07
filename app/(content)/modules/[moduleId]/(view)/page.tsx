import Link from "next/link";
import Image from "next/image";

import getSubjects from "@/utils/getSubjects";
import Path from "../components/Path";
import getModule from "@/utils/getModule";
import Message from "@/components/Message";

export async function generateStaticParams() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/modules`);
  const json = await res.json();
  return json.data.map(({ id }: { id: number }) => ({
    moduleId: id.toString(),
  }));
}

export default async function SubjectsPage({
  params: { moduleId },
}: {
  params: { moduleId: string };
}) {
  const [myModule, subjects] = await Promise.all([
    getModule(+moduleId),
    getSubjects(+moduleId),
  ]);

  return (
    <>
      <Path myModule={myModule} />
      <main className="main">
        {subjects.length === 0 ? (
          <Message type="warning">لم يتم إضافة مواد بعد</Message>
        ) : (
          <ul className="card-container">
            {subjects.map(({ id, name, icon }, index) => (
              <li key={index}>
                <Link href={`/subjects/${id}`} className="card">
                  <span>
                    <Image src={icon} alt={name} width={48} height={48} />
                  </span>
                  <h2>{name}</h2>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </main>
    </>
  );
}
