"use client";

import Link from "next/link";
import Script from "next/script";

import BasePath from "./Path";
import { WrittenQuiz, McqQuiz, Resource, Action } from "@/types";
import getPrefix from "@/utils/getPrefix";
import { logEvent } from "@/lib/event-logger";
import formatLectureTitle from "@/utils/formatLectureTitle";

export default function Path({
  quiz: {
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
        <Link
          href={`/app`}
          className="underline"
          onClick={() => logEvent(null, null, Action.NAVIGATE_TO_HOME, {})}
        >
          {semesterName}
          <sup>{getPrefix(semesterName)}</sup> Semester
        </Link>
        {" > "}
        <Link
          href={`/modules/${moduleId}`}
          className="underline"
          onClick={() =>
            logEvent(Resource.MODULE, moduleId, Action.NAVIGATE, {})
          }
        >
          {moduleName}
        </Link>{" "}
        {"> "}
        <Link
          href={`/subjects/${subjectId}`}
          className="underline"
          onClick={() =>
            logEvent(Resource.SUBJECT, subjectId, Action.NAVIGATE, {})
          }
        >
          {subjectName}
        </Link>{" "}
        {"> "}
        <Link
          href={`/lectures/${lectureId}`}
          className="underline"
          onClick={() =>
            logEvent(Resource.LECTURE, lectureId, Action.NAVIGATE, {})
          }
        >
          {formatLectureTitle(lectureTitle)}
        </Link>
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
            ],
          }),
        }}
      />
    </>
  );
}
