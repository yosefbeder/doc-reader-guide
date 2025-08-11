"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import useSWR from "swr";

import getPrefix from "@/utils/getPrefix";
import getModules from "@/utils/getModulesClient";
import getUser from "@/utils/getUserClient";
import Message from "@/components/Message";
import CardPlaceholder from "@/components/CardPlaceholder";
import { icons } from "@/components/icons";
import { useLogout } from "@/lib/hooks";
import SelectClass from "./components/SelectClass";

function CurrentTag({ semesterOpen }: { semesterOpen: boolean }) {
  return (
    <span
      className={` inline-block px-2 rounded-md ${
        semesterOpen ? "bg-slate-50 text-slate-700" : "bg-cyan-600 text-white"
      }`}
    >
      #current
    </span>
  );
}

export default function ModulesPage() {
  const currentSemesters = JSON.parse(
    process.env.NEXT_PUBLIC_CURRENT_SEMESTERS!
  );
  const logout = useLogout();
  const {
    data: modules,
    error,
    isLoading,
  } = useSWR("home", async () => await getModules((await getUser()).yearId));
  const semesters = useMemo(
    () =>
      Array.from(new Set(modules?.map((module) => module.semesterName))).sort(),
    [modules]
  );
  const [selectedSemester, setSelectedSemester] = useState(-1);
  useEffect(
    () =>
      setSelectedSemester(
        semesters.find((semester) => currentSemesters.includes(semester)) ||
          semesters[0]
      ),
    [semesters]
  );

  if (error && error.status === 401) logout();

  if (
    typeof window !== "undefined" &&
    localStorage.getItem("select-class") === "true"
  ) {
    return <SelectClass />;
  }

  if (isLoading || !modules)
    return (
      <main className="main flex flex-col gap-4">
        <button className="w-full text-left flex items-center gap-2 p-2 bg-slate-50 hover:bg-slate-100 rounded-xl">
          {icons["chevron-right"]}
          <div className="w-28 h-7 rounded bg-slate-700 animate-pulse" />
        </button>
        <div className="overflow-hidden rounded-xl bg-slate-50 text-white">
          <button className="w-full text-left flex items-center gap-2 p-2 rounded-b-xl bg-cyan-600 hover:bg-cyan-700">
            {icons["chevron-down"]}
            <div className="w-28 h-7 rounded bg-white animate-pulse" />
            <CurrentTag semesterOpen={true} />
          </button>
          <ul className="card-container p-4">
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
        </div>
      </main>
    );

  if (semesters.length === 0)
    return (
      <main className="main">
        <Message type="warning">No modules have been added yet</Message>
      </main>
    );

  return (
    <main className="main flex flex-col gap-4">
      {semesters.map((semesterName, index) => {
        const semesterOpen = selectedSemester === semesterName;
        return (
          <div key={index} className="overflow-hidden rounded-xl bg-slate-50">
            <button
              onClick={() =>
                setSelectedSemester((prev) =>
                  semesterName === prev ? -1 : semesterName
                )
              }
              className={`w-full text-left flex items-center gap-2 p-2 rounded-b-xl ${
                semesterOpen
                  ? "bg-cyan-600 hover:bg-cyan-700 text-white"
                  : "hover:bg-slate-100"
              } transition-colors`}
            >
              {semesterOpen ? icons["chevron-down"] : icons["chevron-right"]}
              <span>
                {semesterName}
                <sup>{getPrefix(semesterName)}</sup> Semester{" "}
              </span>
              {currentSemesters.includes(semesterName) && (
                <CurrentTag semesterOpen={semesterOpen} />
              )}
            </button>
            {semesterOpen && (
              <ul className="card-container p-4">
                {modules
                  .filter((myModule) => myModule.semesterName === semesterName)
                  .map(({ id, name, icon }, index) => (
                    <li key={index}>
                      <Link href={`/modules/${id}`} className="card bg-white">
                        <span>
                          <Image src={icon} alt={name} width={48} height={48} />
                        </span>
                        <h2>{name}</h2>
                      </Link>
                    </li>
                  ))}
              </ul>
            )}
          </div>
        );
      })}
    </main>
  );
}
