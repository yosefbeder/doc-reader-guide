import Path from "@/components/QuizPath";
import { getWrittenQuiz } from "@/utils/getQuizServer";
import QuestionsList from "./components/QuestionsList";
import Message from "@/components/Message";
import { getWrittenQuestions } from "@/utils/getQuestionsServer";

export default async function WrittenQuizPage({
  params: { quizId },
}: {
  params: { quizId: string };
}) {
  const [quiz, questions] = await Promise.all([
    getWrittenQuiz(+quizId),
    getWrittenQuestions(+quizId),
  ]);
  return (
    <>
      <Path quiz={quiz} />
      {questions.length === 0 ? (
        <main className="main">
          <Message type="warning">No questions have been added yet</Message>
        </main>
      ) : (
        <main className="main">
          <QuestionsList
            quizId={+quizId}
            title={quiz.title}
            questions={questions}
          />
        </main>
      )}
    </>
  );
}
