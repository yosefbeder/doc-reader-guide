import { Action, McqQuestion, McqQuiz, Resource } from "@/types";
import toUppercaseLetter from "./toUppercaseLetter";
import { logEvent } from "@/lib/event-logger";

export const shareQuestion = async (
  quiz: McqQuiz,
  question: McqQuestion,
  page: "question" | "summary"
) => {
  logEvent(Resource.MCQ_QUESTION, question.id, Action.SHARE_QUESTION, {
    page,
  });
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
