import { McqQuiz, WrittenQuiz } from "@/types";

export async function getMcqQuiz(quizId: number): Promise<McqQuiz> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/mcq-quizzes/${quizId}`,
    {
      credentials: "include",
    }
  );
  const json = await res.json();
  if (!res.ok) throw new Error(json.message);
  return json.data;
}

export async function getWrittenQuiz(quizId: number): Promise<WrittenQuiz> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/written-quizzes/${quizId}`,
    {
      credentials: "include",
    }
  );
  const json = await res.json();
  if (!res.ok) throw new Error(json.message);
  return json.data;
}
