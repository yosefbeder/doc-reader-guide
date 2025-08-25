import Script from "next/script";
import { Module, Subject } from "@/types";
import toIsoDuration from "@/utils/toIsoDuration";

export default function ModuleStructuredData({
  myModule,
  subjects,
}: {
  myModule: Module;
  subjects: Subject[];
}) {
  const faculty = `${myModule.year.faculty.name} ${myModule.year.faculty.city}`;

  const data = {
    "@context": "https://schema.org",
    "@type": "Course",
    name: myModule.name,
    description: `This module provides a complete learning pathway for students in ${faculty} covering essential subjects with lectures, quizzes (MCQ and written), revision materials, and notes. Designed to guide students through foundational and advanced concepts in the curriculum, the module helps in structured preparation for exams and clinical practice.`,
    provider: {
      "@type": "CollegeOrUniversity",
      name: faculty,
      url: process.env.NEXT_PUBLIC_FRONTEND_URL,
    },
    url: `${process.env.NEXT_PUBLIC_FRONTEND_URL}/modules/${myModule.id}`,
    offers: {
      "@type": "Offer",
      category: "Education",
      url: `${process.env.NEXT_PUBLIC_FRONTEND_URL}/modules/${myModule.id}`,
      price: "0",
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
    },
    hasCourseInstance: subjects.map((subject) => ({
      "@type": "CourseInstance",
      name: subject.name,
      description: `This subject is part of the ${myModule.name} in the ${faculty} curriculum, offering detailed lectures, reference notes, and practice quizzes. Students can access normal lectures, practical sessions, and final revisions tailored to their subject area, ensuring both theoretical understanding and exam readiness.`,
      url: `${process.env.NEXT_PUBLIC_FRONTEND_URL}/subjects/${subject.id}`,
      courseMode: "online",
      courseWorkload: toIsoDuration(subject._count.lectures * 3),
    })),
  };

  return (
    <Script
      id={`ld-module-${myModule.id}`}
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
