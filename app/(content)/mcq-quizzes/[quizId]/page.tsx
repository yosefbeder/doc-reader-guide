import { Metadata } from "next";

import Path from "@/components/QuizPath";
import { getMcqQuiz } from "@/utils/getQuizServer";
import QuestionsList from "./components/QuestionsList";
import Message from "@/components/Message";

type Props = { params: { quizId: string } };

export async function generateMetadata({
  params: { quizId },
}: Props): Promise<Metadata> {
  const quiz = await getMcqQuiz(+quizId);
  if (!quiz) return { robots: { index: false, follow: false } };

  const faculty = `${quiz.lectureData.subject.module.year.faculty.city} ${quiz.lectureData.subject.module.year.faculty.name}`;
  const start =
    quiz.lectureData.type === "Normal"
      ? quiz.lectureData.title
      : `${quiz.lectureData.subject.module.name} ${quiz.lectureData.subject.name}`;
  const title = `${start.length > 20 ? `${start.slice(0, 20)}...` : start} ${
    quiz.title
  } | ${faculty}`;
  const description = `MCQ questions with diagrams and explanations support.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
    },
    twitter: {
      card: "summary",
      title,
      description,
    },
  };
}

export default async function QuizPage({ params: { quizId } }: Props) {
  const quiz = await getMcqQuiz(+quizId);

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
