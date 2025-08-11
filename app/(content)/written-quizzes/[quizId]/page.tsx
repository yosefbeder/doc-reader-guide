import Path from "@/components/QuizPath";
import { getWrittenQuiz } from "@/utils/getQuizServer";
import QuestionsList from "./components/QuestionsList";
import Message from "@/components/Message";

export default async function WrittenQuizPage({
  params: { quizId },
}: {
  params: { quizId: string };
}) {
  const writtenQuiz = await getWrittenQuiz(+quizId);
  return (
    <>
      <Path quiz={writtenQuiz} />
      {writtenQuiz.questions.length === 0 ? (
        <main className="main">
          <Message type="warning">No questions have been added yet</Message>
        </main>
      ) : (
        <main className="main">
          <QuestionsList
            quizId={+quizId}
            title={writtenQuiz.title}
            questions={writtenQuiz.questions}
          />
        </main>
      )}
    </>
  );
}
