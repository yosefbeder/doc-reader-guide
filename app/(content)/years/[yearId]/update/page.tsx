import getModules from "@/utils/getModules";
import UpdateModuleForm from "./components/UpdateModuleForm";
import AddModuleForm from "./components/AddModuleForm";

export default async function UpdateModulesPage({
  params: { yearId },
}: {
  params: { yearId: string };
}) {
  const modules = await getModules(+yearId);
  return (
    <main className="main">
      <ul className="card-container">
        <li>
          <AddModuleForm yearId={+yearId} />
        </li>
        {modules.map((myModule) => (
          <li key={myModule.id}>
            <UpdateModuleForm myModule={myModule} />
          </li>
        ))}
      </ul>
    </main>
  );
}
