import React from "react";
import Path from "@/components/QuizPath";
import { getWrittenQuiz } from "@/utils/getQuizServer";
import QuestionsList from "./components/QuestionsList";
import AddSection from "./components/AddSection";
import { getWrittenQuestions } from "@/utils/getQuestionsServer";

export default async function UpdateQuizPage({
  params: { quizId },
}: {
  params: { quizId: string };
}) {
  const [quiz, questions] = await Promise.all([
    getWrittenQuiz(+quizId),
    getWrittenQuestions(+quizId),
  ]);

  return (
    <>
      <Path quiz={quiz} />
      <main className="main flex flex-col gap-4">
        <AddSection quiz={quiz} />
        <hr />
        <QuestionsList quizId={quiz.id} questions={questions} />
      </main>
    </>
  );
}
