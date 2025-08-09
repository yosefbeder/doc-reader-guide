import UpdateModuleForm from "./components/UpdateModuleForm";
import AddModuleForm from "./components/AddModuleForm";
import getUser from "@/utils/getUserServer";
import getModules from "@/utils/getModulesServer";

export default async function UpdateModulesPage() {
  const { yearId } = await getUser();
  const modules = await getModules(yearId);

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
