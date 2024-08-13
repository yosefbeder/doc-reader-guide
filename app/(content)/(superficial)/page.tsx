import { cookies } from "next/headers";
import Image from "next/image";
import Link from "next/link";

import { Module } from "@/types";
import getUser from "@/utils/getUser";
import getPrefix from "@/utils/getPrefix";
import { API_URL } from "@/constants";

async function getModules(yearId: number): Promise<Module[]> {
  const jwt = cookies().get("jwt")!.value;
  const res = await fetch(`${API_URL}/modules/${yearId}`, {
    headers: {
      authorization: `Bearer ${jwt}`,
    },
  });
  const json = await res.json();
  return json.data;
}

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
