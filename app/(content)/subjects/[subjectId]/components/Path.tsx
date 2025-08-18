import Link from "next/link";
import Script from "next/script";

import BasePath from "@/components/Path";
import getPrefix from "@/utils/getPrefix";
import { Subject } from "@/types";

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
        {semesterName}
        <sup>{getPrefix(semesterName)}</sup> Semester →{" "}
        <Link
          href={`/modules/${moduleId}`}
          className="link text-inherit hover:text-white"
        >
          {moduleName}
        </Link>{" "}
        → {name}
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
                name: name,
              },
            ],
          }),
        }}
      />
    </>
  );
}
