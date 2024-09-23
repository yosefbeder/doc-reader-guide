import Link from "next/link";
import Image from "next/image";

import getSubjects from "@/utils/getSubjects";
import Path from "@/components/Path";
import getModule from "@/utils/getModule";
import getPrefix from "@/utils/getPrefix";
import { API_URL } from "@/constants";

export async function generateStaticParams() {
  const res = await fetch(`${API_URL}/modules`);
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
  const myModule = await getModule(+moduleId);
  const subjects = await getSubjects(+moduleId);

  return (
    <>
      <Path>
        {myModule.semesterName}
        <sup>{getPrefix(myModule.semesterName)}</sup> Semester → {myModule.name}
      </Path>
      <main className="main">
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
      </main>
    </>
  );
}
