import React from "react";
import AddQuestionForm from "./components/AddQuestionForm";
import Path from "../components/Path";
import getQuiz from "@/utils/getQuiz";
import UpdateQuestionForm from "./components/UpdateQuestionForm";

export default async function UpdateQuizPage({
  params: { quizId },
}: {
  params: { quizId: string };
}) {
  const quiz = await getQuiz(+quizId);

  return (
    <>
      <Path quiz={quiz} />
      <main className="main" lang="en" dir="ltr">
        <div className="max-w-lg mb-4">
          <AddQuestionForm quizId={+quizId} />
        </div>
        {quiz.questions.map((question, index) => (
          <div key={question.id} className="max-w-lg mb-4">
            <UpdateQuestionForm
              index={index}
              quizId={+quizId}
              question={question}
            />
          </div>
        ))}
      </main>
    </>
  );
}
