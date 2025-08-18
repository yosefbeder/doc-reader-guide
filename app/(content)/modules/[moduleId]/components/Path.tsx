import Script from "next/script";

import BasePath from "@/components/Path";
import { Module } from "@/types";
import getPrefix from "@/utils/getPrefix";

export default function Path({ myModule }: { myModule: Module }) {
  return (
    <>
      <BasePath>
        {myModule.semesterName}
        <sup>{getPrefix(myModule.semesterName)}</sup> Semester → {myModule.name}
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
                name: `Semester ${myModule.semesterName}`,
              },
              {
                "@type": "ListItem",
                position: 2,
                name: myModule.name,
                // current page → no "item"
              },
            ],
          }),
        }}
      />
    </>
  );
}
