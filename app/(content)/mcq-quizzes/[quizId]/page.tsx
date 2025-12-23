import { Metadata } from "next";

import Path from "@/components/QuizPath";
import { getMcqQuiz } from "@/utils/getQuizServer";
import QuestionsList from "./components/QuestionsList";
import Message from "@/components/Message";
import QuizStructuredData from "@/components/QuizStructuredData";
import buildCanonical from "@/utils/buildCanonical";
import Layout from "@/components/Layout";

type Props = { params: { quizId: string } };

export async function generateMetadata({
  params: { quizId },
}: Props): Promise<Metadata> {
  const quiz = await getMcqQuiz(+quizId);
  if (!quiz) return { robots: { index: false, follow: false } };

  const faculty = `${quiz.lectureData.subject.module.year.faculty.name} ${quiz.lectureData.subject.module.year.faculty.city}`;
  const end =
    quiz.lectureData.type === "Normal"
      ? quiz.lectureData.title
      : `${quiz.lectureData.subject.module.name} ${
          quiz.lectureData.subject.name
        }  ${
          quiz.lectureData.type === "FinalRevision"
            ? "Final Revision"
            : "Practical"
        }`;
  const title = `${quiz.title} | ${end}`;
  const description = `Test your knowledge with “${quiz.title}” MCQ quiz on ${end}. Perfect for ${faculty} exam prep.`;

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
    ...buildCanonical(`/mcq-quizzes/${quizId}`),
  };
}

export default async function QuizPage({ params: { quizId } }: Props) {
  const quiz = await getMcqQuiz(+quizId);

  return (
    <>
      {quiz.questions.length === 0 ? (
        <Layout title={quiz.title} updateable>
          <main className="main">
            <Path quiz={quiz} />
            <Message type="warning">No questions have been added yet</Message>
          </main>
        </Layout>
      ) : (
        <QuestionsList quiz={quiz} />
      )}
      <QuizStructuredData type="mcq" quiz={quiz} />
    </>
  );
}
