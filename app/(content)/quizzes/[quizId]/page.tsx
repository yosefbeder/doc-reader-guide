import Path from "./components/Path";
import getQuiz from "@/utils/getQuiz";
import QuestionsList from "./components/QuestionsList";

export default async function QuizPage({
  params: { quizId },
}: {
  params: { quizId: string };
}) {
  const quiz = await getQuiz(+quizId);

  return (
    <>
      <Path quiz={quiz} />
      <main lang="en" dir="ltr" className="main">
        <QuestionsList questions={quiz.questions} />
      </main>
    </>
  );
}
