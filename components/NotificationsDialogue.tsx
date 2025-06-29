"use client";

import React, { useCallback, useMemo, useState } from "react";
import Cookies from "js-cookie";
import useSWR from "swr";
import CheckboxTree from "react-checkbox-tree";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSquare,
  faSquareCheck,
  faSquareMinus,
} from "@fortawesome/free-regular-svg-icons";
import {
  faChevronDown,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";

import { Link, Quiz } from "@/types";
import getUniqueObjectsById from "@/utils/getUniqueObjectsById";
import Button from "./Button";
import Dialogue from "./Dialogue";

export default function NotificationsDialogue({
  yearId,
  onClose,
}: {
  yearId: number;
  onClose: React.MouseEventHandler<HTMLDivElement | HTMLButtonElement>;
}) {
  const jwt = useMemo(() => Cookies.get("jwt")!, []);
  const fetcher = useCallback(
    async (key: string) => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/years/${yearId}/${key}`,
        {
          headers: { authorization: `Bearer ${jwt}` },
        }
      );
      const json = await res.json();
      return json.data as { links: Link[]; quizzes: Quiz[] };
    },
    [yearId]
  );
  const { data, isLoading, error, mutate } = useSWR(
    "notifiable-links",
    fetcher,
    { revalidateOnMount: true }
  );
  const lectures = useMemo(() => {
    if (!data) return [];
    const { links, quizzes } = data;
    return getUniqueObjectsById(
      [...links, ...quizzes].map(
        ({
          lectureData: {
            id: lectureId,
            title: lectureTitle,
            subject: { id: subjectId },
          },
        }) => ({
          id: lectureId,
          title: lectureTitle,
          subjectId,
        })
      )
    ).map((lecture) => ({
      ...lecture,
      links: links.filter((link) => link.lectureData.id === lecture.id),
      quizzes: quizzes.filter((quiz) => quiz.lectureData.id === lecture.id),
    }));
  }, [data]);
  const subjects = useMemo(() => {
    if (!data) return [];
    const { links, quizzes } = data;
    return getUniqueObjectsById(
      [...links, ...quizzes].map(
        ({
          lectureData: {
            subject: {
              id: subjectId,
              name: subjectName,
              module: { id: moduleId },
            },
          },
        }) => ({
          id: subjectId,
          name: subjectName,
          moduleId,
        })
      )
    ).map((subject) => ({
      ...subject,
      lectures: lectures.filter((lecture) => lecture.subjectId === subject.id),
    }));
  }, [data]);
  const modules = useMemo(() => {
    if (!data) return [];
    const { links, quizzes } = data;
    return getUniqueObjectsById(
      [...links, ...quizzes].map(
        ({
          lectureData: {
            subject: {
              module: { id: moduleId, name: moduleName },
            },
          },
        }) => ({
          id: moduleId,
          name: moduleName,
        })
      )
    ).map((myModule) => ({
      ...myModule,
      subjects: subjects.filter((subject) => subject.moduleId === myModule.id),
    }));
  }, [data]);
  const [checked, setChecked] = useState<string[]>([]);
  const [expanded, setExpanded] = useState<string[]>([]);

  const nodes = modules.map(({ id, name, subjects }) => ({
    label: name,
    value: id + name,
    children: subjects.map(({ id, name, lectures }) => ({
      label: name,
      value: id + name,
      children: lectures.map(({ id, title, links, quizzes }) => ({
        label: title,
        value: id + title,
        children: [
          ...links.map(({ id, title }) => ({
            label: title,
            value: `link-${id}`,
          })),
          ...quizzes.map(({ id, title }) => ({
            label: title,
            value: `quiz-${id}`,
          })),
        ],
      })),
    })),
  }));
  const [isIgnoring, setIsIgnoring] = useState(false);
  const [isNotifying, setIsNotifying] = useState(false);

  return (
    <Dialogue
      header="Notifications management"
      className="rounded-xl"
      onClose={onClose}
    >
      <h2 className="mb-2 max-[512px]:hidden">Notifications management</h2>
      {(() => {
        if (error) return <p>Error</p>;
        if (isLoading) return <p>Loading...</p>;
        if (!data || (data.links.length === 0 && data.quizzes.length === 0))
          return <p>No new sources were added, please add some first</p>;
        return (
          <>
            <div className="max-h-80 max-[512px]:max-h-none overflow-y-scroll max-[512px]:overflow-y-visible mb-2 max-[512px]:mb-4">
              <CheckboxTree
                nodes={nodes}
                checked={checked}
                expanded={expanded}
                onCheck={(checked) => setChecked(checked)}
                onExpand={(expanded) => setExpanded(expanded)}
                showNodeIcon={false}
                checkModel="leaf"
                icons={{
                  check: <FontAwesomeIcon icon={faSquareCheck} />,
                  uncheck: <FontAwesomeIcon icon={faSquare} />,
                  halfCheck: <FontAwesomeIcon icon={faSquareMinus} />,
                  expandClose: <FontAwesomeIcon icon={faChevronRight} />,
                  expandOpen: <FontAwesomeIcon icon={faChevronDown} />,
                }}
              />
            </div>
            <div className="flex gap-2">
              <Button
                disabled={checked.length === 0 || isLoading || isNotifying}
                onClick={async () => {
                  if (!data) return [];
                  const { links, quizzes } = data;
                  setIsNotifying(true);
                  const res = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL}/years/${yearId}/notifications/notify`,
                    {
                      method: "POST",
                      headers: {
                        authorization: `Bearer ${jwt}`,
                        "content-type": "application/json;charset=UTF-8",
                      },
                      body: JSON.stringify({
                        links: checked
                          .filter((id) => id.startsWith("link"))
                          .map((id) => +id.slice(5)),
                        quizzes: checked
                          .filter((id) => id.startsWith("quiz"))
                          .map((id) => +id.slice(5)),
                      }),
                    }
                  );
                  if (!res.ok) throw new Error("Failed ignoring");
                  await mutate({
                    links: links.filter(
                      ({ id }) => !checked.includes(`link-${id}`)
                    ),
                    quizzes: quizzes.filter(
                      ({ id }) => !checked.includes(`quiz-${id}`)
                    ),
                  });
                  setIsNotifying(false);
                  setChecked([]);
                }}
              >
                {isNotifying ? "Loading..." : "Send a notification"}
              </Button>
              <Button
                color="rose"
                disabled={checked.length === 0 || isLoading || isIgnoring}
                onClick={async () => {
                  if (!data) return [];
                  const { links, quizzes } = data;
                  setIsIgnoring(true);
                  const res = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL}/years/${yearId}/notifications/ignore`,
                    {
                      method: "POST",
                      headers: {
                        authorization: `Bearer ${jwt}`,
                        "content-type": "application/json;charset=UTF-8",
                      },
                      body: JSON.stringify({
                        links: checked
                          .filter((id) => id.startsWith("link"))
                          .map((id) => +id.slice(5)),
                        quizzes: checked
                          .filter((id) => id.startsWith("quiz"))
                          .map((id) => +id.slice(5)),
                      }),
                    }
                  );
                  if (!res.ok) throw new Error("Failed ignoring");
                  await mutate({
                    links: links.filter(
                      ({ id }) => !checked.includes(`link-${id}`)
                    ),
                    quizzes: quizzes.filter(
                      ({ id }) => !checked.includes(`quiz-${id}`)
                    ),
                  });
                  setIsIgnoring(false);
                  setChecked([]);
                }}
              >
                {isIgnoring ? "Loading..." : "Ignore"}
              </Button>
            </div>
          </>
        );
      })()}
    </Dialogue>
  );
}
