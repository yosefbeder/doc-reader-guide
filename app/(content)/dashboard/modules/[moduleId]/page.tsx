import getModule from "@/utils/getModule";
import UpdateModuleForm from "../components/UpdateModuleForm";

export default async function UpdateModulePage({
  params: { moduleId },
}: {
  params: { moduleId: number };
}) {
  const myModule = await getModule(moduleId);

  return (
    <main className="main">
      <h2 className="mb-4">تعديل الموديول {myModule.id}</h2>
      <UpdateModuleForm myModule={myModule} />
    </main>
  );
}
