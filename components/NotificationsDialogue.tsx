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

import { API_URL } from "@/constants";
import { Link } from "@/types";
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
      const res = await fetch(`${API_URL}/years/${yearId}/${key}`, {
        headers: { authorization: `Bearer ${jwt}` },
      });
      const json = await res.json();
      return json.data as Link[];
    },
    [yearId]
  );
  const {
    data: links,
    isLoading,
    error,
    mutate,
  } = useSWR("notifiable-links", fetcher, { revalidateOnMount: true });
  const lectures = useMemo(() => {
    if (!links) return [];
    return getUniqueObjectsById(
      links.map(({ lectureId, lectureTitle, subjectId }) => ({
        id: lectureId,
        title: lectureTitle,
        subjectId,
      }))
    ).map((lecture) => ({
      ...lecture,
      links: links.filter((link) => link.lectureId === lecture.id),
    }));
  }, [links]);
  const subjects = useMemo(() => {
    if (!links) return [];
    return getUniqueObjectsById(
      links.map(({ subjectId, subjectName, moduleId }) => ({
        id: subjectId,
        name: subjectName,
        moduleId,
      }))
    ).map((subject) => ({
      ...subject,
      lectures: lectures.filter((lecture) => lecture.subjectId === subject.id),
    }));
  }, [links]);
  const modules = useMemo(() => {
    if (!links) return [];
    return getUniqueObjectsById(
      links.map(({ moduleId, moduleName }) => ({
        id: moduleId,
        name: moduleName,
      }))
    ).map((myModule) => ({
      ...myModule,
      subjects: subjects.filter((subject) => subject.moduleId === myModule.id),
    }));
  }, [links]);
  const [checked, setChecked] = useState<string[]>([]);
  const [expanded, setExpanded] = useState<string[]>([]);

  const nodes = modules.map(({ id, name, subjects }) => ({
    label: name,
    value: id + name,
    children: subjects.map(({ id, name, lectures }) => ({
      label: name,
      value: id + name,
      children: lectures.map(({ id, title, links }) => ({
        label: title,
        value: id + title,
        children: links.map(({ id, title }) => ({
          label: title,
          value: id.toString(),
        })),
      })),
    })),
  }));
  const [isIgnoring, setIsIgnoring] = useState(false);
  const [isNotifying, setIsNotifying] = useState(false);

  return (
    <Dialogue header="إدارة الإشعارات" className="rounded-xl" onClose={onClose}>
      <h2 className="mb-2 max-[512px]:hidden">إدارة الإشعارات</h2>
      {(() => {
        if (error) return <p>حدث خطأ ما برجاء التواصل مع المطورين</p>;
        if (isLoading) return <p>تحميل...</p>;
        if (!links || links.length === 0)
          return <p>لا يوجد مصادر جديدة برجاء إضافة البعض أولًا</p>;
        return (
          <>
            <div
              lang="en"
              dir="ltr"
              className="max-h-80 max-[512px]:max-h-none overflow-y-scroll max-[512px]:overflow-y-visible mb-2 max-[512px]:mb-4"
            >
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
                  if (!links) return;
                  setIsNotifying(true);
                  const res = await fetch(
                    `${API_URL}/years/${yearId}/notifications/notify`,
                    {
                      method: "POST",
                      headers: {
                        authorization: `Bearer ${jwt}`,
                        "content-type": "application/json;charset=UTF-8",
                      },
                      body: JSON.stringify({
                        links: checked.map((string) => +string),
                      }),
                    }
                  );
                  if (!res.ok) throw new Error("Failed ignoring");
                  await mutate(
                    links.filter(({ id }) => !checked.includes(id.toString()))
                  );
                  setIsNotifying(false);
                  setChecked([]);
                }}
              >
                {isNotifying ? "تحميل..." : "إرسال إشعار"}
              </Button>
              <Button
                color="rose"
                disabled={checked.length === 0 || isLoading || isIgnoring}
                onClick={async () => {
                  if (!links) return;
                  setIsIgnoring(true);
                  const res = await fetch(
                    `${API_URL}/years/${yearId}/notifications/ignore`,
                    {
                      method: "POST",
                      headers: {
                        authorization: `Bearer ${jwt}`,
                        "content-type": "application/json;charset=UTF-8",
                      },
                      body: JSON.stringify({
                        links: checked.map((string) => +string),
                      }),
                    }
                  );
                  if (!res.ok) throw new Error("Failed ignoring");
                  await mutate(
                    links.filter(({ id }) => !checked.includes(id.toString()))
                  );
                  setIsIgnoring(false);
                  setChecked([]);
                }}
              >
                {isIgnoring ? "تحميل..." : "تجاهل"}
              </Button>
            </div>
          </>
        );
      })()}
    </Dialogue>
  );
}
