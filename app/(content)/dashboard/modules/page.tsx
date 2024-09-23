import React from "react";
import Image from "next/image";
import Link from "next/link";

import getModules from "@/utils/getModules";
import getUser from "@/utils/getUser";
import Button from "@/components/Button";
import AddModuleForm from "./components/AddModuleForm";
import ButtonDeleteModule from "./components/ButtonDeleteModule";

export default async function ModulesPage() {
  const { yearId } = await getUser();
  const modules = await getModules(yearId);

  return (
    <main className="main">
      <h2 className="mb-4">إضافة موديول</h2>
      <AddModuleForm yearId={yearId} />
      <h2 className="mb-4">عرض الموديولات</h2>
      <div className="overflow-y-scroll">
        <table className="w-max">
          <thead>
            <tr>
              <th>الرقم التعريفي</th>
              <th>الأيقونة</th>
              <th>الاسم</th>
              <th>الفصل الدراسي</th>
              <th>الإجراءات</th>
            </tr>
          </thead>
          <tbody>
            {modules.map(({ id, icon, name, semesterName }) => (
              <tr key={id}>
                <td>{id}</td>
                <td>
                  <Image src={icon} alt={name} width={48} height={48} />
                </td>
                <td>{name}</td>
                <td>{semesterName}</td>
                <td>
                  <Link
                    href={`/dashboard/modules/${id}`}
                    passHref
                    className="text-inherit hover:text-inherit"
                  >
                    <Button color="yellow" className="ml-2">
                      تعديل
                    </Button>
                  </Link>
                  <ButtonDeleteModule moduleId={id} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
