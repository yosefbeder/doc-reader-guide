"use client";

import React, { useState } from "react";

import Message from "@/components/Message";
import { Link as LinkType, WrittenQuiz, McqQuiz as QuizType } from "@/types";
import Link from "../../components/Link";
import Quiz from "../../components/Quiz";
import { useCategories } from "@/lib/hooks";
import UpdateMcqQuizForm from "./UpdateMcqQuizForm";
import UpdateLinkForm from "./UpdateLinkForm";
import UpdateWrittenQuizForm from "./UpdateWrittenQuizForm";
import { SummaryDetail } from "@/components/SummaryDetail";

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
          <SummaryDetail
            key={index}
            open={categoryOpen}
            toggle={() =>
              setCurrentCategory((prev) => (prev === index ? undefined : index))
            }
          >
            <SummaryDetail.Summary>
              {category === "Data" ? "External" : category}
            </SummaryDetail.Summary>

            <SummaryDetail.Detail>
              <ul className="flex flex-col gap-2 p-2">
                {category === "Questions" && (
                  <>
                    {mcqQuizzes.map((quiz) => (
                      <li key={`mcq-${quiz.id}`}>
                        {current &&
                        current.type === "quiz" &&
                        current.id === quiz.id ? (
                          <UpdateMcqQuizForm
                            quiz={quiz}
                            lectureId={lectureId}
                            onClose={() => setCurrent(undefined)}
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
                      <li key={`written-${quiz.id}`}>
                        {current &&
                        current.type === "quiz" &&
                        current.id === quiz.id ? (
                          <UpdateWrittenQuizForm
                            quiz={quiz}
                            lectureId={lectureId}
                            onClose={() => setCurrent(undefined)}
                          />
                        ) : (
                          <Quiz
                            type="written"
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
                  <li key={`link-${link.id}`}>
                    {current &&
                    current.type === "link" &&
                    current.id === link.id ? (
                      <UpdateLinkForm
                        link={link}
                        lectureId={lectureId}
                        onClose={() => setCurrent(undefined)}
                      />
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
            </SummaryDetail.Detail>
          </SummaryDetail>
        );
      })}
    </div>
  );
}
