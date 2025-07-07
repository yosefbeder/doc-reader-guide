import { PracticalQuiz } from "@/types";

export default async function getPracticalQuiz(
  quizId: number
): Promise<PracticalQuiz> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/practical-quizzes/${quizId}`
  );
  const json = await res.json();
  if (!res.ok) throw new Error(json.message);
  return json.data;
}
