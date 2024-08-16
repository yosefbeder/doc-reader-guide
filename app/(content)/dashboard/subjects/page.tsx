import Image from "next/image";
import Link from "next/link";

import Button from "@/components/Button";
import getModules from "@/utils/getModules";
import getSubjects from "@/utils/getSubjects";
import getUser from "@/utils/getUser";
import ButtonDeleteSubject from "./components/ButtonDeleteSubject";
import AddSubjectForm from "./components/AddSubjectForm";

export default async function SubjectsPage() {
  const { yearId } = await getUser();
  const modules = await getModules(yearId);
  const subjects = (
    await Promise.all(
      modules.map(async (module) => await getSubjects(yearId, module.id))
    )
  ).flat();

  return (
    <main className="main">
      <h2 className="mb-4">إضافة مادة</h2>
      <AddSubjectForm yearId={yearId} />
      <h2 className="mb-4">عرض المواد</h2>
      <table>
        <thead>
          <tr>
            <th>الرقم التعريفي</th>
            <th>الأيقونة</th>
            <th>الاسم</th>
            <th>الرقم التعريفي للموديول</th>
            <th>الإجراءات</th>
          </tr>
        </thead>
        <tbody>
          {subjects.map(({ id, icon, name, moduleId }) => (
            <tr key={id}>
              <td>{id}</td>
              <td>
                <Image src={icon} alt={name} width={48} height={48} />
              </td>
              <td>{name}</td>
              <td>{moduleId}</td>
              <td>
                <Link
                  href={`/dashboard/subjects/${id}`}
                  passHref
                  className="text-inherit hover:text-inherit"
                >
                  <Button color="yellow" className="ml-2">
                    تعديل
                  </Button>
                </Link>
                <ButtonDeleteSubject yearId={yearId} subjectId={id} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}
