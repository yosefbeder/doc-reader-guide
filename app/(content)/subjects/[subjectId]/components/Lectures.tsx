import Link from "next/link";

import MasonryCardContainer from "@/components/MasonryCardContainer";
import getLectures from "@/utils/getLectures";

export default async function Lectures({ subjectId }: { subjectId: number }) {
  const lectures = await getLectures(+subjectId);
  return (
    <MasonryCardContainer>
      {lectures.map(({ id, title, date, createdAt }, index) => (
        <Link key={index} href={`/lectures/${id}`} className="card">
          <h2>{title}</h2>
          <time dateTime={new Date(date || createdAt).toISOString()}>
            {new Date(date || createdAt).toDateString()}
          </time>
        </Link>
      ))}
    </MasonryCardContainer>
  );
}
