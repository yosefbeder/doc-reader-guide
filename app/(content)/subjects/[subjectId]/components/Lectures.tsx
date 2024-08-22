import Link from "next/link";

import getLectures from "@/utils/getLectures";

export default async function Lectures({ subjectId }: { subjectId: number }) {
  const lectures = await getLectures(+subjectId);
  return (
    <>
      {lectures.map(({ id, title, date, createdAt }, index) => (
        <li key={index}>
          <Link href={`/lectures/${id}`} className="card">
            <h2>{title}</h2>
            <time dateTime={new Date(date || createdAt).toISOString()}>
              {new Date(date || createdAt).toDateString()}
            </time>
          </Link>
        </li>
      ))}
    </>
  );
}
