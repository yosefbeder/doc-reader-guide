import UpdateModuleForm from "./components/UpdateModuleForm";
import AddModuleForm from "./components/AddModuleForm";
import getUser from "@/utils/getUserServer";
import getModules from "@/utils/getModulesServer";
import UpdateYear from "./components/UpdateYear";

export default async function UpdateModulesPage() {
  const user = await getUser();
  const modules = await getModules(user.yearId!);

  return (
    <main className="main">
      <ul className="card-container">
        <li>
          <AddModuleForm yearId={user.yearId!} />
        </li>
        <li>
          <UpdateYear user={user} modules={modules} />
        </li>
        {modules.map((myModule) => (
          <li key={myModule.id}>
            <UpdateModuleForm user={user} myModule={myModule} />
          </li>
        ))}
      </ul>
    </main>
  );
}
