import React from "react";

import getModule from "@/utils/getModule";
import getUser from "@/utils/getUser";

import UpdateModuleForm from "../components/UpdateModuleForm";

export default async function UpdateModulePage({
  params: { moduleId },
}: {
  params: { moduleId: string };
}) {
  return <main className="main">🧑‍💻: تحت الصيانة...</main>;
  const { yearId } = await getUser();
  const myModule = await getModule(yearId, +moduleId);

  return (
    <main className="main">
      <h2 className="mb-4">تعديل الموديول {myModule.id}</h2>
      <UpdateModuleForm myModule={myModule} />
    </main>
  );
}
