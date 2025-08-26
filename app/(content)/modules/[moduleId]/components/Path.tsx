import Script from "next/script";

import BasePath from "@/components/Path";
import { Module } from "@/types";
import getPrefix from "@/utils/getPrefix";

export default function Path({ myModule }: { myModule: Module }) {
  return (
    <>
      <BasePath>
        <h1>
          {myModule.semesterName}
          <sup>{getPrefix(myModule.semesterName)}</sup> Semester →{" "}
          {myModule.name}
        </h1>
      </BasePath>
      <Script
        id="breadcrumb-jsonld-module"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              {
                "@type": "ListItem",
                position: 1,
                name: myModule.name,
              },
            ],
          }),
        }}
      />
    </>
  );
}
