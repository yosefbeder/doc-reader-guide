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
import { SummaryDetail } from "@/components/SummaryDetail";
import SelectClass from "./components/SelectClass";
import QuizCard from "../../lectures/[lectureId]/components/QuizCard";
import { logEvent } from "@/lib/event-logger";
import { Action, Resource } from "@/types";

function getLocalStorageItemsByPrefix(prefix: string) {
  if (typeof window === "undefined") return [];
  const items: Record<string, string> = {};

  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith(prefix)) {
      const value = localStorage.getItem(key);
      if (value !== null) {
        items[key] = value;
      }
    }
  }

  return items;
}

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
  const { data, isLoading } = useSWR("home", async () => {
    const {
      year: { id: yearId, currentSemester },
    } = (await getUser())!;
    const modules = await getModules(yearId);
    return { modules, currentSemester };
  });
  const semesters = useMemo(
    () =>
      Array.from(
        new Set(data?.modules.map((module) => module.semesterName))
      ).toSorted(),
    [data]
  );
  const [selectedSection, setSelectedSection] = useState<string>();
  useEffect(
    () => setSelectedSection(data?.currentSemester.toString() || undefined),
    [data]
  );

  const [hasClass, setHasClass] = useState(false);

  useEffect(() => {
    const checkStorage = () => {
      setHasClass(!!localStorage.getItem("select-class"));
    };

    checkStorage();

    window.addEventListener("storage", checkStorage);

    return () => {
      window.removeEventListener("storage", checkStorage);
    };
  }, []);

  const mcqQuizzes = Object.entries(
    getLocalStorageItemsByPrefix("mcq-quiz-")
  ).filter(([_, value]) => {
    const { showingResults, quiz } = JSON.parse(value);
    return !showingResults && quiz;
  });
  const writtenQuizzes = Object.entries(
    getLocalStorageItemsByPrefix("written-quiz-")
  ).filter(([_, value]) => {
    const { showingResults, quiz } = JSON.parse(value);
    return !showingResults && quiz;
  });

  if (hasClass) {
    return <SelectClass />;
  }

  if (isLoading || !data) {
    return (
      <main className="main col">
        {/* Collapsed loading skeleton */}
        <SummaryDetail open={false} toggle={() => {}}>
          <SummaryDetail.Summary>
            <div className="w-28 h-7 rounded bg-slate-700 animate-pulse" />
          </SummaryDetail.Summary>
        </SummaryDetail>

        {/* Expanded loading skeleton */}
        <SummaryDetail open={true} toggle={() => {}}>
          <SummaryDetail.Summary>
            <div className="w-28 h-7 rounded bg-white animate-pulse" />
            <CurrentTag semesterOpen={true} />
          </SummaryDetail.Summary>
          <SummaryDetail.Detail>
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
          </SummaryDetail.Detail>
        </SummaryDetail>
      </main>
    );
  }

  if (semesters.length === 0)
    return (
      <main className="main">
        <Message type="warning">No modules have been added yet</Message>
      </main>
    );

  return (
    <main className="main col">
      {writtenQuizzes.length + mcqQuizzes.length > 0 && (
        <SummaryDetail
          open={selectedSection === "quizzes"}
          toggle={() =>
            setSelectedSection((prev) =>
              prev === "quizzes" ? undefined : "quizzes"
            )
          }
        >
          <SummaryDetail.Summary>In-Progress Quizzes</SummaryDetail.Summary>
          <SummaryDetail.Detail>
            <ul className="flex flex-col gap-2 p-2">
              {mcqQuizzes.map(([_, value]) => {
                const { quiz } = JSON.parse(value);
                return (
                  <li key={`mcq-quiz-${quiz.id}`}>
                    <QuizCard type="mcq" quiz={quiz} printable />
                  </li>
                );
              })}
              {writtenQuizzes.map(([_, value]) => {
                const { quiz } = JSON.parse(value);
                return (
                  <li key={`written-quiz-${quiz.id}`}>
                    <QuizCard type="written" quiz={quiz} />
                  </li>
                );
              })}
            </ul>
          </SummaryDetail.Detail>
        </SummaryDetail>
      )}
      {semesters.map((semesterName, index) => {
        const semesterOpen = selectedSection === semesterName.toString();
        return (
          <SummaryDetail
            key={index}
            open={semesterOpen}
            toggle={() =>
              setSelectedSection((prev) =>
                semesterName.toString() === prev
                  ? undefined
                  : semesterName.toString()
              )
            }
          >
            <SummaryDetail.Summary>
              <span>
                {semesterName}
                <sup>{getPrefix(semesterName)}</sup> Semester
              </span>
              {semesterName === data?.currentSemester && (
                <CurrentTag semesterOpen={semesterOpen} />
              )}
            </SummaryDetail.Summary>
            <SummaryDetail.Detail>
              <ul className="card-container p-4">
                {data.modules
                  .filter((m) => m.semesterName === semesterName)
                  .map(({ id, name, icon }, index) => (
                    <li key={index}>
                      <Link
                        href={`/modules/${id}`}
                        className="card bg-white"
                        onClick={() =>
                          logEvent(Resource.MODULE, id, Action.NAVIGATE, {})
                        }
                      >
                        <span>
                          <Image src={icon} alt={name} width={48} height={48} />
                        </span>
                        <h3>{name}</h3>
                      </Link>
                    </li>
                  ))}
              </ul>
            </SummaryDetail.Detail>
          </SummaryDetail>
        );
      })}
    </main>
  );
}
