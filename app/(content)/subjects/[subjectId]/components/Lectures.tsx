import MasonryCardContainer from "@/components/MasonryCardContainer";
import getLectures from "@/utils/getLectures";
import Lecture from "./Lecture";

export default async function Lectures({ subjectId }: { subjectId: number }) {
  const lectures = await getLectures(+subjectId);
  return (
    <MasonryCardContainer>
      {lectures.map((lecture, index) => (
        <Lecture key={index} lecture={lecture} />
      ))}
    </MasonryCardContainer>
  );
}
