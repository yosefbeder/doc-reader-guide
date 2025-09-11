import React from "react";
import Path from "@/components/QuizPath";
import { getMcqQuiz } from "@/utils/getQuizServer";
import QuestionsList from "./components/QuestionsList";
import getUser from "@/utils/getUserServer";

export default async function UpdateQuizPage({
  params: { quizId },
}: {
  params: { quizId: string };
}) {
  const user = await getUser();
  const quiz = await getMcqQuiz(+quizId);

  return (
    <>
      <Path quiz={quiz} />
      <QuestionsList user={user} quizId={quiz.id} questions={quiz.questions} />
    </>
  );
}
