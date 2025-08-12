import { Lecture, Link, WrittenQuiz, McqQuiz } from "@/types";
import { cookies } from "next/headers";

export default async function getLecture(lectureId: number): Promise<Lecture> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/lectures/${lectureId}`,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${
          cookies().get("jwt")?.value || process.env.JWT
        }`,
      },
    }
  );
  const json = await res.json();
  if (!res.ok) throw new Error(json.message);
  return json.data.lecture;
}

export async function getLectureLinksAndQuizzes(lectureId: number): Promise<{
  links: Link[];
  mcqQuizzes: McqQuiz[];
  writtenQuizzes: WrittenQuiz[];
}> {
  const res = await Promise.all([
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/lectures/${lectureId}/links`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${
          cookies().get("jwt")?.value || process.env.JWT
        }`,
      },
    }),
    fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/lectures/${lectureId}/mcq-quizzes`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${
            cookies().get("jwt")?.value || process.env.JWT
          }`,
        },
      }
    ),
    fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/lectures/${lectureId}/written-quizzes`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${
            cookies().get("jwt")?.value || process.env.JWT
          }`,
        },
      }
    ),
  ]);
  const json = await Promise.all(res.map((r) => r.json()));
  if (res.find(({ ok }) => !ok))
    throw new Error(
      json.find(({ ok }) => !ok)?.message || "Error fetching data"
    );

  return {
    links: json[0].data.links,
    mcqQuizzes: json[1].data.mcqQuizzes,
    writtenQuizzes: json[2].data.writtenQuizzes,
  };
}
