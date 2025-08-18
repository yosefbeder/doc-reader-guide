import Link from "next/link";
import Script from "next/script";

import BasePath from "@/components/Path";
import { Lecture } from "@/types";
import getPrefix from "@/utils/getPrefix";

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
        → {title}
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
                name: `Semester ${semesterName}`,
              },
              {
                "@type": "ListItem",
                position: 2,
                name: moduleName,
                item: `${process.env.NEXT_PUBLIC_FRONTEND_URL}/modules/${moduleId}`,
              },
              {
                "@type": "ListItem",
                position: 3,
                name: subjectName,
                item: `${process.env.NEXT_PUBLIC_FRONTEND_URL}/subjects/${subjectId}`,
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
