import { Quiz } from "@/types";

export default async function getQuiz(quizId: number): Promise<Quiz> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/quizzes/${quizId}`,
    {
      credentials: "include",
    }
  );
  const json = await res.json();
  if (!res.ok) throw new Error(json.message);
  return json.data;
}
