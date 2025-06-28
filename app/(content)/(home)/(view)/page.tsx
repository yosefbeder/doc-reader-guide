"use client";

import Image from "next/image";
import Link from "next/link";
import Cookies from "js-cookie";
import useSWR, { useSWRConfig } from "swr";
import { useRouter } from "next/navigation";

import getPrefix from "@/utils/getPrefix";
import getModules from "@/utils/getModules";
import getUser from "@/utils/getUser";
import Message from "@/components/Message";
import disableNotifications from "@/utils/disableNotifications";
import CardPlaceholder from "@/components/CardPlaceholder";

async function loadModules() {
  const yearId = (await getUser(Cookies.get("jwt")!)).yearId;
  return await getModules(yearId);
}

export default function ModulesPage() {
  const router = useRouter();
  const { mutate } = useSWRConfig();
  const { data: modules, error, isLoading } = useSWR("home", loadModules);
  if (error.status === 401) {
    (async () => {
      if (localStorage.getItem("notifications-status") === "allowed") {
        await disableNotifications();
      }
      Cookies.remove("jwt");
      await mutate(() => true, undefined, { revalidate: false });
      router.replace("/login");
    })();
  }
  if (isLoading || !modules)
    return (
      <main className="main">
        <ul className="card-container">
          <li>
            <CardPlaceholder type="module" />
          </li>
          <li>
            <CardPlaceholder type="module" />
          </li>
          <li>
            <CardPlaceholder type="module" />
          </li>
          <li>
            <CardPlaceholder type="module" />
          </li>
          <li>
            <CardPlaceholder type="module" />
          </li>
          <li>
            <CardPlaceholder type="module" />
          </li>
          <li>
            <CardPlaceholder type="module" />
          </li>
          <li>
            <CardPlaceholder type="module" />
          </li>
        </ul>
      </main>
    );

  return modules.length === 0 ? (
    <Message type="warning">لم يتم إضافة موديولات بعد</Message>
  ) : (
    <main className="main">
      <ul className="card-container">
        {modules.map(({ id, name, icon, semesterName }, index) => (
          <li key={index}>
            <Link href={`/modules/${id}`} className="card">
              <span>
                <Image src={icon} alt={name} width={48} height={48} />
              </span>
              <h2>{name}</h2>
              <span>
                {semesterName}
                <sup>{getPrefix(semesterName)}</sup> Semester
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
