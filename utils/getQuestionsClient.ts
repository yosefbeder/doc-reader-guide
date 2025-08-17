import { McqQuestion, WrittenQuestion } from "@/types";
import Cookies from "js-cookie";

export async function getMcqQuestions(quizId: number): Promise<McqQuestion[]> {
  let res;
  if (!Cookies.get("guest")) {
    res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/mcq-quizzes/${quizId}/questions`,
      {
        credentials: "include",
      }
    );
  } else {
    res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/mcq-quizzes/${quizId}/questions`,
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
  return json.data.questions;
}

export async function getWrittenQuestions(
  quizId: number
): Promise<WrittenQuestion[]> {
  let res;
  if (!Cookies.get("guest")) {
    res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/written-quizzes/${quizId}/questions`,
      {
        credentials: "include",
      }
    );
  } else {
    res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/written-quizzes/${quizId}/questions`,
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
  return json.data.questions;
}
