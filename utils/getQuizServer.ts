import { Quiz } from "@/types";
import { cookies } from "next/headers";

export default async function getQuiz(quizId: number): Promise<Quiz> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/quizzes/${quizId}`,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${cookies().get("jwt")!.value}`,
      },
    }
  );
  const json = await res.json();
  if (!res.ok) throw new Error(json.message);
  return json.data.quiz;
}
