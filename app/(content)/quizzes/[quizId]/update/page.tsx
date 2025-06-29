import React from "react";
import AddQuestionForm from "./components/AddQuestionForm";
import Path from "../components/Path";
import getQuiz from "@/utils/getQuiz";
import QuickAddForm from "./components/QuickAddForm";
import ButtonCopy from "./components/ButtonCopy";
import QuestionsList from "./components/QuestionsList";

export default async function UpdateQuizPage({
  params: { quizId },
}: {
  params: { quizId: string };
}) {
  const quiz = await getQuiz(+quizId);

  return (
    <>
      <Path quiz={quiz} />
      <main className="main">
        <ButtonCopy
          text={JSON.stringify(
            quiz.questions.map(
              ({
                id,
                createdAt,
                updatedAt,
                quizId,
                image,
                explanation,
                ...rest
              }: any) => ({
                image: image || undefined,
                explanation: explanation || undefined,
                ...rest,
              })
            )
          )}
        />
        <h2 className="mb-4">New Question(s)</h2>
        <div className="max-w-lg flex flex-col gap-4">
          <AddQuestionForm quizId={+quizId} />
          <QuickAddForm quizId={+quizId} />
        </div>
        <hr className="my-4" />
        <QuestionsList quizId={quiz.id} questions={quiz.questions} />
      </main>
    </>
  );
}
