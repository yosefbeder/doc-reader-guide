"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";

import Message from "@/components/Message";
import { Link as LinkType, Quiz } from "@/types";
import { icons } from "@/components/icons";
import ButtonPrintQuiz from "./ButtonPrintQuiz";
import LogoImage from "@/public/logo.png";

const typeIcons = {
  Video: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="size-6"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m15.75 10.5 4.72-4.72a.75.75 0 0 1 1.28.53v11.38a.75.75 0 0 1-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25h-9A2.25 2.25 0 0 0 2.25 7.5v9a2.25 2.25 0 0 0 2.25 2.25Z"
      />
    </svg>
  ),
  PDF: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="size-6"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
      />
    </svg>
  ),
  Record: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="size-6"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 18.75a6 6 0 0 0 6-6v-1.5m-6 7.5a6 6 0 0 1-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 0 1-3-3V4.5a3 3 0 1 1 6 0v8.25a3 3 0 0 1-3 3Z"
      />
    </svg>
  ),
  Data: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="size-6"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
      />
    </svg>
  ),
};

export default function LinksList({
  links,
  quizzes,
}: {
  links: LinkType[];
  quizzes: Quiz[];
}) {
  const categories = useMemo(() => {
    const temp = [];
    if (links.find((link) => link.category === "Data")) temp.push("Data");
    if (links.find((link) => link.category === "College")) temp.push("College");
    if (links.find((link) => link.category === "Summary")) temp.push("Summary");
    if (
      quizzes.length > 0 ||
      links.find((link) => link.category === "Questions")
    )
      temp.push("Questions");
    return temp;
  }, [links, quizzes]);
  const [currentCategory, setCurrentCategory] = useState<number>();

  if (categories.length === 0)
    return (
      <Message type="warning" className="my-2">
        No sources have been added yet
      </Message>
    );

  return (
    <div className="flex flex-col gap-4">
      {categories.map((category, index) => {
        const categoryLinks = links.filter(
          (link) => link.category === category
        );
        const categoryOpen = currentCategory === index;

        return (
          <div key={index} className="overflow-hidden rounded-xl bg-slate-50">
            <button
              onClick={() =>
                setCurrentCategory((prev) =>
                  prev === index ? undefined : index
                )
              }
              className={`w-full text-left flex items-center gap-2 p-2 rounded-b-xl ${
                categoryOpen
                  ? "bg-cyan-600 hover:bg-cyan-700 text-white"
                  : "hover:bg-slate-100"
              } transition-colors`}
            >
              {categoryOpen ? icons["chevron-down"] : icons["chevron-right"]}
              {category === "Data" ? "External" : category}
            </button>
            {categoryOpen && (
              <ul className="flex flex-col gap-2 p-2">
                {category === "Questions" &&
                  quizzes.map(({ id, title }) => (
                    <li
                      key={id}
                      className="flex superficial p-2 rounded-xl bg-white"
                    >
                      <Link
                        href={`/quizzes/${id}`}
                        className="grow flex items-center gap-2 reset-link"
                      >
                        <span>{typeIcons.Data}</span>
                        <div>
                          <div>{title}</div>
                          <div className="flex items-center gap-1 text-sm">
                            <div className="text-slate-700">Presented by</div>
                            <Image src={LogoImage} className="w-3" alt="Logo" />
                            <div className="text-cyan-700 font-extrabold">
                              DocReader Guide
                            </div>
                          </div>
                        </div>
                      </Link>
                      <ButtonPrintQuiz id={id} title={title} />
                    </li>
                  ))}
                {categoryLinks.map(({ id, title, subTitle, url, type }) => (
                  <li key={id}>
                    <a className="link-card" target="_blank" href={url}>
                      {typeIcons[type]}
                      {subTitle.trim() ? (
                        <div>
                          <div>{title}</div>
                          <div className="text-sm text-slate-500">
                            {subTitle}
                          </div>
                        </div>
                      ) : (
                        title
                      )}
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>
        );
      })}
    </div>
  );
}
