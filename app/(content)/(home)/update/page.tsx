import getModules from "@/utils/getModules";
import UpdateModuleForm from "./components/UpdateModuleForm";
import AddModuleForm from "./components/AddModuleForm";
import { cookies } from "next/headers";
import getUser from "@/utils/getUser";

export default async function UpdateModulesPage() {
  const { yearId } = await getUser(cookies().get("jwt")!.value!);
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
