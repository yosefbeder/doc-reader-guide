import Link from "next/link";
import Script from "next/script";

import BasePath from "./Path";
import { WrittenQuiz, McqQuiz } from "@/types";
import getPrefix from "@/utils/getPrefix";

export default function Path({
  quiz: {
    title,
    lectureData: {
      id: lectureId,
      title: lectureTitle,
      subject: {
        id: subjectId,
        name: subjectName,
        module: { id: moduleId, name: moduleName, semesterName },
      },
    },
  },
}: {
  quiz: McqQuiz | WrittenQuiz;
}) {
  return (
    <>
      <BasePath>
        {semesterName}
        <sup>{getPrefix(semesterName)}</sup> Semester →{" "}
        <Link
          href={`/modules/${moduleId}`}
          className="link text-inherit hover:text-white"
        >
          {moduleName}
        </Link>{" "}
        →{" "}
        <Link
          href={`/subjects/${subjectId}`}
          className="link text-inherit hover:text-white"
        >
          {subjectName}
        </Link>{" "}
        →{" "}
        <Link
          href={`/lectures/${lectureId}`}
          className="link text-inherit hover:text-white"
        >
          {lectureTitle}
        </Link>{" "}
        → <h1 className="inline-block">{title}</h1>
      </BasePath>
      <Script
        id="breadcrumb-jsonld-quiz"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              {
                "@type": "ListItem",
                position: 1,
                name: moduleName,
                item: `${process.env.NEXT_PUBLIC_FRONTEND_URL}/modules/${moduleId}`,
              },
              {
                "@type": "ListItem",
                position: 2,
                name: subjectName,
                item: `${process.env.NEXT_PUBLIC_FRONTEND_URL}/subjects/${subjectId}`,
              },
              {
                "@type": "ListItem",
                position: 3,
                name:
                  lectureTitle.length > 35
                    ? lectureTitle.slice(0, 35) + "…"
                    : lectureTitle,
                item: `${process.env.NEXT_PUBLIC_FRONTEND_URL}/lectures/${lectureId}`,
              },
              {
                "@type": "ListItem",
                position: 4,
                name: title,
              },
            ],
          }),
        }}
      />
    </>
  );
}
