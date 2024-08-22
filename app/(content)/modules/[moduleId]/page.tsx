import { Suspense } from "react";

import getUser from "@/utils/getUser";
import Path from "./components/Path";
import EmptyPath from "@/components/EmptyPath";
import Subjects from "./components/Subjects";
import SubjectsPlaceholder from "./components/SubjectsPlaceholder";

export default async function SubjectsPage({
  params: { moduleId },
}: {
  params: { moduleId: number };
}) {
  const { yearId } = await getUser();

  return (
    <>
      <Suspense fallback={<EmptyPath />}>
        <Path yearId={yearId} moduleId={+moduleId} />
      </Suspense>
      <main className="main">
        <ul className="card-container">
          <Suspense fallback={<SubjectsPlaceholder />}>
            <Subjects yearId={yearId} moduleId={+moduleId} />
          </Suspense>
        </ul>
      </main>
    </>
  );
}
