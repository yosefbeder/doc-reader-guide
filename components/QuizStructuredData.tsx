import Script from "next/script";

import { Quiz } from "@/types";

export default function QuizStructuredData({
  type,
  quiz,
}: {
  type: "mcq" | "written";
  quiz: Quiz;
}) {
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
    description: `This quiz is designed to test medical students’ knowledge in ${
      quiz.lectureData.subject.name
    }, focusing on concepts taught in ${lectureTitle}. The quiz includes ${
      type === "mcq" ? "multiple choice questions (MCQ)" : "written assessments"
    }, tailored for students of the ${faculty}. It helps learners evaluate their progress, prepare for examinations, and reinforce key principles covered in lectures.`,
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
    url: `${process.env.NEXT_PUBLIC_FRONTEND_URL}/${type}-quizzes/${quiz.id}`,
  };
  return (
    <Script
      id={`ld-${type}-quiz-${quiz.id}`}
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
