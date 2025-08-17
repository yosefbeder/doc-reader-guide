import React from "react";
import Path from "@/components/QuizPath";
import { getWrittenQuiz } from "@/utils/getQuizServer";
import QuestionsList from "./components/QuestionsList";
import AddSection from "./components/AddSection";

export default async function UpdateQuizPage({
  params: { quizId },
}: {
  params: { quizId: string };
}) {
  const quiz = await getWrittenQuiz(+quizId);

  return (
    <>
      <Path quiz={quiz} />
      <main className="main flex flex-col gap-4">
        <AddSection quiz={quiz} />
        <hr />
        <QuestionsList quizId={quiz.id} questions={quiz.questions} />
      </main>
    </>
  );
}
