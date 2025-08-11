import { McqQuiz, WrittenQuiz } from "@/types";
import { cookies } from "next/headers";

export async function getMcqQuiz(quizId: number): Promise<McqQuiz> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/mcq-quizzes/${quizId}`,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${cookies().get("jwt")!.value}`,
      },
    }
  );
  const json = await res.json();
  if (!res.ok) throw new Error(json.message);
  return json.data.mcqQuiz;
}

export async function getWrittenQuiz(quizId: number): Promise<WrittenQuiz> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/written-quizzes/${quizId}`,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${cookies().get("jwt")!.value}`,
      },
    }
  );
  const json = await res.json();
  if (!res.ok) throw new Error(json.message);
  return json.data.writtenQuiz;
}
