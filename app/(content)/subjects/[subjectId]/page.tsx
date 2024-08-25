import { Suspense } from "react";

import Path from "./components/Path";
import Lectures from "./components/Lectures";
import EmptyPath from "@/components/EmptyPath";
import LecturesPlaceholder from "./components/LecturesPlaceholder";

export default function LecturesPage({
  params: { subjectId },
}: {
  params: { subjectId: string };
}) {
  return (
    <>
      <Suspense fallback={<EmptyPath />}>
        <Path subjectId={+subjectId} />
      </Suspense>
      <main className="main">
        <Suspense fallback={<LecturesPlaceholder />}>
          <Lectures subjectId={+subjectId} />
        </Suspense>
      </main>
    </>
  );
}
