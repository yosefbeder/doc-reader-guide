"use client";

import Link from "next/link";
import Script from "next/script";

import BasePath from "@/components/Path";
import { Action, Lecture, Resource } from "@/types";
import getPrefix from "@/utils/getPrefix";
import { logEvent } from "@/lib/event-logger";

export default function Path({
  lecture: {
    title,
    subject: {
      id: subjectId,
      name: subjectName,
      module: { id: moduleId, name: moduleName, semesterName },
    },
  },
}: {
  lecture: Lecture;
}) {
  return (
    <>
      <BasePath>
        {semesterName}
        <sup>{getPrefix(semesterName)}</sup> Semester →{" "}
        <Link
          href={`/modules/${moduleId}`}
          className="link text-inherit hover:text-white"
          onClick={() =>
            logEvent(Resource.MODULE, moduleId, Action.NAVIGATE, {})
          }
        >
          {moduleName}
        </Link>{" "}
        →{" "}
        <Link
          href={`/subjects/${subjectId}`}
          className="link text-inherit hover:text-white"
          onClick={() =>
            logEvent(Resource.SUBJECT, subjectId, Action.NAVIGATE, {})
          }
        >
          {subjectName}
        </Link>{" "}
        → <h1 className="inline-block">{title}</h1>
      </BasePath>

      <Script
        id="breadcrumb-jsonld-lecture"
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
                name: title,
              },
            ],
          }),
        }}
      />
    </>
  );
}
