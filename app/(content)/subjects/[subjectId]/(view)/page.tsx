import Path from "../components/Path";
import getSubject from "@/utils/getSubject";
import MasonryCardContainer from "@/components/MasonryCardContainer";
import getLectures from "@/utils/getLectures";
import Lecture from "./components/Lecture";

export async function generateStaticParams() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/subjects?size=100`,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.JWT}`,
      },
    }
  );
  const json = await res.json();
  return json.data.subjects.map(({ id }: { id: number }) => ({
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
          {[
            ...lectures
              .filter((lecture) => lecture.type !== "Normal")
              .map((lecture, index) => (
                <Lecture key={index} lecture={lecture} />
              )),
            ...lectures
              .filter((lecture) => lecture.type === "Normal")
              .map((lecture, index) => (
                <Lecture key={index} lecture={lecture} />
              )),
          ]}
        </MasonryCardContainer>
      </main>
    </>
  );
}
