import { Suspense } from "react";

import Path from "./components/Path";
import EmptyPath from "@/components/EmptyPath";
import Links from "./components/Links";
import LinksPlaceholder from "./components/LinksPlaceholder";

export default async function LinksPage({
  params: { lectureId },
}: {
  params: { lectureId: string };
}) {
  return (
    <>
      <Suspense fallback={<EmptyPath />}>
        <Path lectureId={+lectureId} />
      </Suspense>
      <main className="main">
        <Suspense fallback={<LinksPlaceholder />}>
          <Links lectureId={+lectureId} />
        </Suspense>
      </main>
    </>
  );
}
