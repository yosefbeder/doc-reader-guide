import { Lecture, Subject } from "@/types";
import toIsoDuration from "@/utils/toIsoDuration";
import Script from "next/script";
import React from "react";

export default function StructuredData({
  subject,
  lectures,
}: {
  subject: Subject;
  lectures: Lecture[];
}) {
  const faculty = `${subject.module.year.faculty.name} ${subject.module.year.faculty.city}`;
  const moduleName = subject.module.name;

  const data = {
    "@context": "https://schema.org",
    "@type": "Course",
    name: `${moduleName} ${subject.name}`,
    url: `${process.env.NEXT_PUBLIC_FRONTEND_URL}/subjects/${subject.id}`,
    description: `This subject is part of the ${moduleName} in the ${faculty} curriculum, offering detailed lectures, reference notes, and practice quizzes. Students can access normal lectures, practical sessions, and final revisions tailored to their subject area, ensuring both theoretical understanding and exam readiness.`,
    provider: {
      "@type": "CollegeOrUniversity",
      name: faculty,
    },
    hasCourseInstance: {
      "@type": "CourseInstance",
      courseWorkload: toIsoDuration(
        lectures.filter((lecture) => lecture.type === "Normal").length * 3
      ),
      url: `${process.env.NEXT_PUBLIC_FRONTEND_URL}/subjects/${subject.id}`,
      courseMode: "online",
    },
    offers: {
      "@type": "Offer",
      category: "Education",
      url: `${process.env.NEXT_PUBLIC_FRONTEND_URL}/subjects/${subject.id}`,
      price: "0",
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
    },
    hasPart: lectures.map((lecture) => ({
      "@type": "LearningResource",
      learningResourceType: "Lecture",
      name: lecture.title,
      url: `${process.env.NEXT_PUBLIC_FRONTEND_URL}/lectures/${lecture.id}`,
    })),
  };

  return (
    <Script
      id={`ld-subject-${subject.id}`}
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
