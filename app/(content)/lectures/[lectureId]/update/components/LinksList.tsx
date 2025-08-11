"use client";

import React, { useState } from "react";

import Message from "@/components/Message";
import { Link as LinkType, WrittenQuiz, McqQuiz as QuizType } from "@/types";
import Link from "../../components/Link";
import { icons } from "@/components/icons";
import Quiz from "../../components/Quiz";
import { useCategories } from "@/lib/hooks";
import UpdateMcqQuizForm from "./UpdateMcqQuizForm";
import UpdateLinkForm from "./UpdateLinkForm";
import UpdateWrittenQuizForm from "./UpdateWrittenQuizForm";

export default function LinksList({
  lectureId,
  links,
  mcqQuizzes,
  writtenQuizzes,
}: {
  lectureId: number;
  links: LinkType[];
  mcqQuizzes: QuizType[];
  writtenQuizzes: WrittenQuiz[];
}) {
  const { categories, currentCategory, setCurrentCategory } = useCategories(
    links,
    mcqQuizzes,
    writtenQuizzes
  );
  const [current, setCurrent] = useState<{
    type: "link" | "quiz";
    id: number;
  }>();

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
                {category === "Questions" && (
                  <>
                    {mcqQuizzes.map((quiz) => (
                      <li key={quiz.id}>
                        {current &&
                        current.type === "quiz" &&
                        current.id === quiz.id ? (
                          <UpdateMcqQuizForm
                            quiz={quiz}
                            lectureId={lectureId}
                          />
                        ) : (
                          <Quiz
                            type="mcq"
                            quiz={quiz}
                            printable
                            updateable
                            onUpdate={() =>
                              setCurrent({ type: "quiz", id: quiz.id })
                            }
                          />
                        )}
                      </li>
                    ))}
                    {writtenQuizzes.map((quiz) => (
                      <li key={quiz.id}>
                        {current &&
                        current.type === "quiz" &&
                        current.id === quiz.id ? (
                          <UpdateWrittenQuizForm
                            quiz={quiz}
                            lectureId={lectureId}
                          />
                        ) : (
                          <Quiz
                            type="practical"
                            quiz={quiz}
                            updateable
                            onUpdate={() =>
                              setCurrent({ type: "quiz", id: quiz.id })
                            }
                          />
                        )}
                      </li>
                    ))}
                  </>
                )}
                {categoryLinks.map((link) => (
                  <li key={link.id}>
                    {current &&
                    current.type === "link" &&
                    current.id === link.id ? (
                      <UpdateLinkForm link={link} lectureId={lectureId} />
                    ) : (
                      <Link
                        link={link}
                        updateable
                        onUpdate={() =>
                          setCurrent({ type: "link", id: link.id })
                        }
                      />
                    )}
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
