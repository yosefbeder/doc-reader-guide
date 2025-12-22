"use client";

import Script from "next/script";
import Link from "next/link";

import BasePath from "@/components/Path";
import { Action, Module } from "@/types";
import getPrefix from "@/utils/getPrefix";
import { logEvent } from "@/lib/event-logger";

export default function Path({ myModule }: { myModule: Module }) {
  return (
    <>
      <BasePath>
        <Link
          href={`/app`}
          className="underline"
          onClick={() => logEvent(null, null, Action.NAVIGATE_TO_HOME, {})}
        >
          {myModule.semesterName}
          <sup>{getPrefix(myModule.semesterName)}</sup> Semester
        </Link>
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
