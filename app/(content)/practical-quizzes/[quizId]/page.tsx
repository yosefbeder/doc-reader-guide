import Path from "@/components/QuizPath";
import getPracticalQuiz from "@/utils/getPracticalQuiz";
import QuestionsList from "./components/QuestionsList";
import Message from "@/components/Message";

export default async function PracticalQuizPage({
  params: { quizId },
}: {
  params: { quizId: string };
}) {
  const practicalQuiz = await getPracticalQuiz(+quizId);
  return (
    <>
      <Path quiz={practicalQuiz} />
      {practicalQuiz.questions.length === 0 ? (
        <main className="main">
          <Message type="warning">No questions have been added yet</Message>
        </main>
      ) : (
        <main className="main">
          <QuestionsList
            quizId={+quizId}
            title={practicalQuiz.title}
            questions={practicalQuiz.questions}
          />
        </main>
      )}
    </>
  );
}
