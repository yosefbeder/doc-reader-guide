import React from "react";

import getModule from "@/utils/getModule";
import getUser from "@/utils/getUser";
import UpdateModuleForm from "../components/UpdateModuleForm";

export default async function UpdateModulePage({
  params: { moduleId },
}: {
  params: { moduleId: string };
}) {
  const { yearId } = await getUser();
  const module = await getModule(yearId, +moduleId);

  return (
    <main className="main">
      <h2 className="mb-4">تعديل الموديول {module.id}</h2>
      <UpdateModuleForm module={module} />
    </main>
  );
}
