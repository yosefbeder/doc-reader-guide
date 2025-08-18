import { Metadata } from "next";

import Path from "@/components/QuizPath";
import { getWrittenQuiz } from "@/utils/getQuizServer";
import QuestionsList from "./components/QuestionsList";
import Message from "@/components/Message";

type Props = { params: { quizId: string } };

export async function generateMetadata({
  params: { quizId },
}: Props): Promise<Metadata> {
  const quiz = await getWrittenQuiz(+quizId);
  if (!quiz) return { robots: { index: false, follow: false } };

  const faculty = `${quiz.lectureData.subject.module.year.faculty.city} ${quiz.lectureData.subject.module.year.faculty.name}`;
  const lecture =
    quiz.lectureData.type === "Normal"
      ? quiz.lectureData.title
      : `${quiz.lectureData.subject.module.name} ${quiz.lectureData.subject.name}`;
  const title = `${lecture} ${quiz.title} | ${faculty}`;
  const description = `Written and practical questions with multi-media and image occlusion support.`;

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

export default async function WrittenQuizPage({ params: { quizId } }: Props) {
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
