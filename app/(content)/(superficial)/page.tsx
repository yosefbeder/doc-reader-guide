import Image from "next/image";
import Link from "next/link";

import getUser from "@/utils/getUser";
import getPrefix from "@/utils/getPrefix";
import getModules from "@/utils/getModules";

export default async function HomePage() {
  const { yearId } = await getUser();
  const modules = await getModules(yearId);

  return (
    <ul className="flex flex-wrap gap-4">
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
  );
}
