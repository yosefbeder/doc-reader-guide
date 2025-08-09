import Path from "@/components/QuizPath";
import getQuiz from "@/utils/getQuizServer";
import QuestionsList from "./components/QuestionsList";
import Message from "@/components/Message";

export default async function QuizPage({
  params: { quizId },
}: {
  params: { quizId: string };
}) {
  const quiz = await getQuiz(+quizId);

  return (
    <>
      <Path quiz={quiz} />
      {quiz.questions.length === 0 ? (
        <main className="main">
          <Message type="warning">No questions have been added yet</Message>
        </main>
      ) : (
        <main className="main">
          <QuestionsList
            quizId={+quizId}
            title={quiz.title}
            questions={quiz.questions}
          />
        </main>
      )}
    </>
  );
}
