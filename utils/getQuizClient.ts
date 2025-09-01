import Cookies from "js-cookie";
import { McqQuiz, WrittenQuiz } from "@/types";

export async function getMcqQuiz(quizId: number): Promise<McqQuiz> {
  let res;
  if (!Cookies.get("guest")) {
    res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/mcq-quizzes/${quizId}`,
      {
        credentials: "include",
      }
    );
  } else {
    res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/mcq-quizzes/${quizId}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_JWT}`,
        },
      }
    );
  }
  const json = await res.json();
  if (!res.ok) throw new Error(json.message);
  return json.data.mcqQuiz;
}

export async function getWrittenQuiz(quizId: number): Promise<WrittenQuiz> {
  let res;
  if (!Cookies.get("guest")) {
    res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/written-quizzes/${quizId}`,
      {
        credentials: "include",
      }
    );
  } else {
    res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/written-quizzes/${quizId}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_JWT}`,
        },
      }
    );
  }
  const json = await res.json();
  if (!res.ok) throw new Error(json.message);
  return json.data.writtenQuiz;
}
