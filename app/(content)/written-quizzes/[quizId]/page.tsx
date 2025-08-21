import { Metadata } from "next";
import Script from "next/script";

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
  };
}

export default async function WrittenQuizPage({ params: { quizId } }: Props) {
  const quiz = await getWrittenQuiz(+quizId);

  const faculty = `${quiz.lectureData.subject.module.year.faculty.name} ${quiz.lectureData.subject.module.year.faculty.city}`;
  const lectureTitle =
    quiz.lectureData.type === "Normal"
      ? quiz.lectureData.title
      : `${quiz.lectureData.subject.module.name} ${
          quiz.lectureData.subject.name
        }  ${
          quiz.lectureData.type === "FinalRevision"
            ? "Final Revision"
            : "Practical"
        }`;

  const data = {
    "@context": "https://schema.org",
    "@type": "Quiz",
    name: quiz.title,
    description: `This quiz is designed to test medical students’ knowledge in ${quiz.lectureData.subject.name}, focusing on concepts taught in ${lectureTitle}. The quiz includes written assessments, tailored for students of the ${faculty}. It helps learners evaluate their progress, prepare for examinations, and reinforce key principles covered in lectures.`,
    educationalUse: "assessment",
    isPartOf: {
      "@type": "LearningResource",
      learningResourceType: "Lecture",
      name: lectureTitle,
      url: `${process.env.NEXT_PUBLIC_FRONTEND_URL}/lectures/${quiz.lectureData.id}`,
    },
    provider: {
      "@type": "CollegeOrUniversity",
      name: faculty,
    },
    url: `${process.env.NEXT_PUBLIC_FRONTEND_URL}/mcq-quizzes/${quiz.id}`,
  };

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
      <Script
        id={`ld-quiz-${quiz.id}`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
      />
    </>
  );
}
