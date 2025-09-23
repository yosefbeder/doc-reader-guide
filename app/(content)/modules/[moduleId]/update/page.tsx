import getSubjects from "@/utils/getSubjects";
import Path from "../components/Path";
import getModule from "@/utils/getModule";
import UpdateSubjectForm from "./components/UpdateSubjectForm";
import AddSubjectForm from "./components/AddSubjectForm";
import getUser from "@/utils/getUserServer";
import QuickAddForm from "./components/QuickAddForm";

export default async function UpdateSubjectsPage({
  params: { moduleId },
}: {
  params: { moduleId: string };
}) {
  const user = await getUser();
  const [myModule, subjects] = await Promise.all([
    getModule(+moduleId),
    getSubjects(+moduleId),
  ]);

  return (
    <>
      <Path myModule={myModule} />
      <main className="main">
        <ul className="card-container">
          <li>
            <AddSubjectForm moduleId={+moduleId} />
          </li>
          <li>
            <QuickAddForm
              moduleId={+moduleId}
              subjects={subjects}
              disabled={user.roleId > 1}
            />
          </li>
          {subjects.map((subject) => (
            <li key={subject.id}>
              <UpdateSubjectForm user={user} subject={subject} />
            </li>
          ))}
        </ul>
      </main>
    </>
  );
}
