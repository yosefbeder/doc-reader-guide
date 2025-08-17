import Path from "@/components/QuizPath";
import { getMcqQuiz } from "@/utils/getQuizServer";
import QuestionsList from "./components/QuestionsList";
import Message from "@/components/Message";
import { getMcqQuestions } from "@/utils/getQuestionsServer";

export default async function QuizPage({
  params: { quizId },
}: {
  params: { quizId: string };
}) {
  const [quiz, questions] = await Promise.all([
    getMcqQuiz(+quizId),
    getMcqQuestions(+quizId),
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
          <QuestionsList quiz={quiz} title={quiz.title} questions={questions} />
        </main>
      )}
    </>
  );
}
