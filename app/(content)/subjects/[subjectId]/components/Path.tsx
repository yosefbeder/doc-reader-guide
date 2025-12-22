"use client";

import Link from "next/link";
import Script from "next/script";

import BasePath from "@/components/Path";
import getPrefix from "@/utils/getPrefix";
import { Action, Resource, Subject } from "@/types";
import { logEvent } from "@/lib/event-logger";

export default function Path({
  subject: {
    name,
    module: { semesterName, id: moduleId, name: moduleName },
  },
}: {
  subject: Subject;
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
        </Link>
      </BasePath>
      <Script
        id="breadcrumb-jsonld-subject"
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
                name: name,
              },
            ],
          }),
        }}
      />
    </>
  );
}
