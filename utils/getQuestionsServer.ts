import { McqQuestion, WrittenQuestion } from "@/types";
import { cookies } from "next/headers";

export async function getMcqQuestions(quizId: number): Promise<McqQuestion[]> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/mcq-quizzes/${quizId}/questions?sort=id`,
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
  return json.data.questions;
}

export async function getWrittenQuestions(
  quizId: number
): Promise<WrittenQuestion[]> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/written-quizzes/${quizId}/questions?sort=id`,
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
  return json.data.questions;
}
