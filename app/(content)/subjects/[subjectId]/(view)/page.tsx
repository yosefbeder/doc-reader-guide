import Path from "../components/Path";
import getSubject from "@/utils/getSubject";
import MasonryCardContainer from "@/components/MasonryCardContainer";
import getLectures from "@/utils/getLectures";
import Lecture from "./components/Lecture";
import { API_URL } from "@/constants";

export async function generateStaticParams() {
  const res = await fetch(`${API_URL}/subjects`);
  const json = await res.json();
  return json.data.map(({ id }: { id: number }) => ({
    subjectId: id.toString(),
  }));
}

export default async function LecturesPage({
  params: { subjectId },
}: {
  params: { subjectId: string };
}) {
  const [subject, lectures] = await Promise.all([
    getSubject(+subjectId),
    getLectures(+subjectId),
  ]);

  return (
    <>
      <Path subject={subject} />
      <main className="main">
        <MasonryCardContainer>
          {lectures.map((lecture, index) => (
            <Lecture key={index} lecture={lecture} />
          ))}
        </MasonryCardContainer>
      </main>
    </>
  );
}
