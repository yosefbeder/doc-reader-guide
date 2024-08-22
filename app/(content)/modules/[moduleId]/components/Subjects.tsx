import Image from "next/image";
import Link from "next/link";

import getSubjects from "@/utils/getSubjects";

export default async function Subjects({
  yearId,
  moduleId,
}: {
  yearId: number;
  moduleId: number;
}) {
  const subjects = await getSubjects(yearId, moduleId);

  return (
    <>
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
    </>
  );
}
