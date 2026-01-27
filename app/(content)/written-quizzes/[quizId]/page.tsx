import { Metadata } from "next";
import Script from "next/script";

import Path from "@/components/QuizPath";
import { getWrittenQuiz } from "@/utils/getQuizServer";
import QuestionsList from "./components/QuestionsList";
import Message from "@/components/Message";
import QuizStructuredData from "@/components/QuizStructuredData";
import buildCanonical from "@/utils/buildCanonical";
import QuizNav from "@/components/QuizNav";
import Layout from "@/components/Layout";

type Props = { params: Promise<{ quizId: string }> };

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params;

  const {
    quizId
  } = params;

  const quiz = await getWrittenQuiz(+quizId);
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
  const description = `Test your knowledge with “${quiz.title}” written quiz on ${end}. Perfect for ${faculty} exam prep.`;

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
    ...buildCanonical(`/written-quizzes/${quizId}`),
  };
}

export default async function WrittenQuizPage(props: Props) {
  const params = await props.params;

  const {
    quizId
  } = params;

  const quiz = await getWrittenQuiz(+quizId);

  return (
    <>
      {quiz.questions.length === 0 ? (
        <Layout title={quiz.title} updateable>
          <Path quiz={quiz} />
          <main className="main">
            <Message type="warning">No questions have been added yet</Message>
          </main>
        </Layout>
      ) : (
        <QuestionsList
          quiz={quiz}
          title={quiz.title}
          questions={quiz.questions}
        />
      )}
      <QuizStructuredData type="written" quiz={quiz} />
    </>
  );
}
