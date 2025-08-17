import React from "react";
import Path from "@/components/QuizPath";
import { getMcqQuiz } from "@/utils/getQuizServer";
import QuestionsList from "./components/QuestionsList";
import AddSection from "./components/AddSection";
import { getMcqQuestions } from "@/utils/getQuestionsServer";

export default async function UpdateQuizPage({
  params: { quizId },
}: {
  params: { quizId: string };
}) {
  const [quiz, questions] = await Promise.all([
    getMcqQuiz(+quizId),
    getMcqQuestions(+quizId),
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
