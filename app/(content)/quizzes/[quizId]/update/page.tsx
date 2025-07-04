import React from "react";
import AddQuestionForm from "./components/AddQuestionForm";
import Path from "../components/Path";
import getQuiz from "@/utils/getQuiz";
import QuickAddForm from "./components/QuickAddForm";
import ButtonCopy from "./components/ButtonCopy";
import QuestionsList from "./components/QuestionsList";
import Templates from "@/components/Templates";

export default async function UpdateQuizPage({
  params: { quizId },
}: {
  params: { quizId: string };
}) {
  const quiz = await getQuiz(+quizId);

  return (
    <>
      <Path quiz={quiz} />
      <main className="main flex flex-col gap-4">
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
        <h2>New Question</h2>
        <AddQuestionForm quizId={+quizId} />
        <h2>Quick Add</h2>
        <h3>Templates</h3>
        <Templates />
        <h3>Form</h3>
        <QuickAddForm quizId={+quizId} />
        <hr />
        <QuestionsList quizId={quiz.id} questions={quiz.questions} />
      </main>
    </>
  );
}
