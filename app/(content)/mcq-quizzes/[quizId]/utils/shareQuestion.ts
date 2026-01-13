import { McqQuestion, McqQuiz } from "@/types";
import toUppercaseLetter from "./toUppercaseLetter";

export const shareQuestion = async (quiz: McqQuiz, question: McqQuestion) => {
  const url = new URL(`${window.location.origin}/mcq-quizzes/${quiz.id}`);
  url.searchParams.set("questionId", question.id.toString());
  const text = `${question.text}\n${question.options
    .map((opt, i) => `${toUppercaseLetter(i)}. ${opt}`)
    .join("\n")}\nSolve at: ${url.toString()}`;
  if (navigator.share) {
    await navigator.share({
      title: quiz.title,
      text,
    });
  }
};
