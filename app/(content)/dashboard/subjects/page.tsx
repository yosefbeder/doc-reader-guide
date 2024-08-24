import Image from "next/image";
import Link from "next/link";

import getUser from "@/utils/getUser";
import getModules from "@/utils/getModules";
import getAllSubjects from "@/utils/getAllSubjects";

import AddSubjectForm from "./components/AddSubjectForm";
import Button from "@/components/Button";
import ButtonDeleteSubject from "./components/ButtonDeleteSubject";

export default async function SubjectsPage() {
  const { yearId } = await getUser();
  const modules = await getModules(yearId);
  const subjects = await getAllSubjects(yearId);

  return (
    <main className="main">
      <h2 className="mb-4">إضافة مادة</h2>
      <AddSubjectForm yearId={yearId} modules={modules} />
      <h2 className="mb-4">عرض المواد</h2>
      <div className="overflow-y-scroll">
        <table className="w-max">
          <thead>
            <tr>
              <th>الرقم التعريفي</th>
              <th>الأيقونة</th>
              <th>الاسم</th>
              <th>الموديول</th>
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
                <td>{modules.find(({ id }) => id === moduleId)!.name}</td>
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
      </div>
    </main>
  );
}
