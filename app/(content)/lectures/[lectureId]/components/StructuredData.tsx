import Script from "next/script";

import { Lecture } from "@/types";
import toIsoDuration from "@/utils/toIsoDuration";

export default function StructuredData({ lecture }: { lecture: Lecture }) {
  const faculty = `${lecture.subject.module.year.faculty.name} ${lecture.subject.module.year.faculty.city}`;
  const data = {
    "@context": "https://schema.org",
    "@type": "LearningResource",
    learningResourceType: "Lecture",
    name: lecture.title,
    description: `This lecture in ${lecture.subject.name} covers core topics required for medical students at the ${faculty}. Students can access comprehensive lecture notes, supporting links, and related quizzes (MCQ and written). The lecture may include practical demonstrations, normal teaching sessions, or final revision classes to reinforce learning outcomes.`,
    provider: {
      "@type": "CollegeOrUniversity",
      name: faculty,
    },
    isPartOf: {
      "@type": "Course",
      name: lecture.subject.name,
      description: `This subject is part of the ${lecture.subject.module} in the ${faculty} curriculum, offering detailed lectures, reference notes, and practice quizzes. Students can access normal lectures, practical sessions, and final revisions tailored to their subject area, ensuring both theoretical understanding and exam readiness.`,
      provider: {
        "@type": "CollegeOrUniversity",
        name: faculty,
      },
      hasCourseInstance: {
        "@type": "CourseInstance",
        courseWorkload: toIsoDuration(12), // 😭😭😭
        url: `${process.env.NEXT_PUBLIC_FRONTEND_URL}/subjects/${lecture.subject.id}`,
        courseMode: "online",
      },
      offers: {
        "@type": "Offer",
        category: "Education",
        url: `${process.env.NEXT_PUBLIC_FRONTEND_URL}/subjects/${lecture.subject.id}`,
        price: "0",
        priceCurrency: "USD",
        availability: "https://schema.org/InStock",
      },
      url: `${process.env.NEXT_PUBLIC_FRONTEND_URL}/subjects/${lecture.subject.id}`,
    },
    hasPart: [
      ...lecture.mcqQuizzes.map((quiz) => ({
        "@type": "Quiz",
        name: quiz.title,
        educationalUse: "assessment",
        url: `${process.env.NEXT_PUBLIC_FRONTEND_URL}/mcq-quizzes/${quiz.id}`,
      })),
      ...lecture.writtenQuizzes.map((quiz) => ({
        "@type": "Quiz",
        name: quiz.title,
        educationalUse: "assessment",
        url: `${process.env.NEXT_PUBLIC_FRONTEND_URL}/written-quizzes/${quiz.id}`,
      })),
    ],
    url: `${process.env.NEXT_PUBLIC_FRONTEND_URL}/lectures/${lecture.id}`,
  };
  return (
    <Script
      id={`ld-lecture-${lecture.id}`}
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
