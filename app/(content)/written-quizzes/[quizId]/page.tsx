import Path from "@/components/QuizPath";
import { getWrittenQuiz } from "@/utils/getQuizServer";
import QuestionsList from "./components/QuestionsList";
import Message from "@/components/Message";

export default async function WrittenQuizPage({
  params: { quizId },
}: {
  params: { quizId: string };
}) {
  const quiz = await getWrittenQuiz(+quizId);
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
            quiz={quiz}
            title={quiz.title}
            questions={quiz.questions}
          />
        </main>
      )}
    </>
  );
}
