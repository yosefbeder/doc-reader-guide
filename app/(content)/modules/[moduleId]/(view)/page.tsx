import Link from "next/link";
import Image from "next/image";

import getSubjects from "@/utils/getSubjects";
import Path from "../components/Path";
import getModule from "@/utils/getModule";
import Message from "@/components/Message";

export async function generateStaticParams() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/modules?size=100`,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_JWT}`,
      },
    }
  );
  const json = await res.json();
  return json.data.modules.map(({ id }: { id: number }) => ({
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
          <Message type="warning">Not subjects have been added yet</Message>
        ) : (
          <ul className="card-container">
            {subjects.map(({ id, name, icon, _count: { lectures } }, index) => (
              <li key={index}>
                <Link href={`/subjects/${id}`} className="card relative group">
                  <span>
                    <Image src={icon} alt={name} width={48} height={48} />
                  </span>
                  <h2>{name}</h2>
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
    </>
  );
}
