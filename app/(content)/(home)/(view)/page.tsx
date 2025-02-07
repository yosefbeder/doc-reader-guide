import Image from "next/image";
import Link from "next/link";

import getPrefix from "@/utils/getPrefix";
import getModules from "@/utils/getModules";
import getUser from "@/utils/getUser";
import { cookies } from "next/headers";
import Message from "@/components/Message";

export default async function ModulesPage() {
  const { yearId } = await getUser(cookies().get("jwt")!.value!);
  const modules = await getModules(yearId);

  return (
    <main className="main">
      {modules.length === 0 ? (
        <Message type="warning">لم يتم إضافة موديولات بعد</Message>
      ) : (
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
      )}
    </main>
  );
}
