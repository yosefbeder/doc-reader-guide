import { Lecture } from "@/types";
import { cookies } from "next/headers";

export default async function getLecture(
  lectureId: number,
  withQuestions?: boolean
): Promise<Lecture> {
  const res = await fetch(
    `${
      process.env.NEXT_PUBLIC_API_URL
    }/lectures/${lectureId}?include=links,mcqQuizzes${
      withQuestions
        ? ",mcqQuizzes.id,mcqQuizzes.title,mcqQuizzes.questions"
        : ""
    },writtenQuizzes`,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${
          cookies().get("jwt")?.value || process.env.NEXT_PUBLIC_JWT
        }`,
      },
    }
  );
  const json = await res.json();
  if (!res.ok) throw new Error(json.message);
  return json.data.lecture;
}
