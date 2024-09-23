import getModule from "@/utils/getModule";
import UpdateModuleForm from "../components/UpdateModuleForm";
import { API_URL } from "@/constants";

export async function generateStaticParams() {
  const res = await fetch(`${API_URL}/modules`);
  const json = await res.json();
  return json.data.map(({ id }: { id: number }) => ({
    moduleId: id.toString(),
  }));
}

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
