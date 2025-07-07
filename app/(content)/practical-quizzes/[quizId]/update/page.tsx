import React from "react";
import AddQuestionForm from "./components/AddQuestionForm";
import Path from "@/components/QuizPath";
import getPracticalQuiz from "@/utils/getPracticalQuiz";
import QuestionsList from "./components/QuestionsList";

export default async function UpdateQuizPage({
  params: { quizId },
}: {
  params: { quizId: string };
}) {
  const quiz = await getPracticalQuiz(+quizId);

  return (
    <>
      <Path quiz={quiz} />
      <main className="main flex flex-col gap-4">
        <h2>New Question</h2>
        <AddQuestionForm quizId={+quizId} />
        <hr />
        <QuestionsList quizId={quiz.id} questions={quiz.questions} />
      </main>
    </>
  );
}
