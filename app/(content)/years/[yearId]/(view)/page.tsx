import Image from "next/image";
import Link from "next/link";

import getPrefix from "@/utils/getPrefix";
import getModules from "@/utils/getModules";
import getFaculties from "@/utils/getFaculties";

export async function generateStaticParams() {
  const faculties = await getFaculties();
  const years = faculties.flatMap((faculty) => faculty.years);
  return years.map(({ id }: { id: number }) => ({
    yearId: id.toString(),
  }));
}

export default async function ModulesPage({
  params: { yearId },
}: {
  params: { yearId: string };
}) {
  const modules = await getModules(+yearId);

  return (
    <main className="main">
      <ul className="card-container">
        {modules.map(({ id, name, icon, semesterName }, index) => (
          <li key={index}>
            <Link href={`/modules/${id}`} className="card">
              <span>
                <Image src={icon} alt={name} width={48} height={48} />
              </span>
              <h2>{name}</h2>
              <span>
                {semesterName}
                <sup>{getPrefix(semesterName)}</sup> Semester
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
