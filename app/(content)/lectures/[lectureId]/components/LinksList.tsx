"use client";

import React from "react";

import Message from "@/components/Message";
import { Link as LinkType, WrittenQuiz, McqQuiz as QuizType } from "@/types";
import LinkCard from "./LinkCard";
import QuizCard from "./QuizCard";
import { useCategories } from "@/lib/hooks";
import { SummaryDetail } from "@/components/SummaryDetail";

export default function LinksList({
  links,
  mcqQuizzes,
  writtenQuizzes,
}: {
  links: LinkType[];
  mcqQuizzes: QuizType[];
  writtenQuizzes: WrittenQuiz[];
}) {
  const { categories, currentCategory, setCurrentCategory } = useCategories(
    links,
    mcqQuizzes,
    writtenQuizzes
  );

  if (categories.length === 0)
    return (
      <Message type="warning" className="self-start">
        No sources have been added yet
      </Message>
    );

  return (
    <div className="col flex-1">
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
              <span>{category === "Data" ? "External" : category}</span>
              <span className="text-sm">
                (
                {categoryLinks.length +
                  (category === "Questions"
                    ? mcqQuizzes.length + writtenQuizzes.length
                    : 0)}
                )
              </span>
            </SummaryDetail.Summary>

            <SummaryDetail.Detail>
              <ul className="flex flex-col gap-2 p-2">
                {category === "Questions" && (
                  <>
                    {mcqQuizzes.map((quiz) => (
                      <li key={`mcq-quiz-${quiz.id}`}>
                        <QuizCard type="mcq" quiz={quiz} printable />
                      </li>
                    ))}
                    {writtenQuizzes.map((quiz) => (
                      <li key={`written-quiz-${quiz.id}`}>
                        <QuizCard type="written" quiz={quiz} />
                      </li>
                    ))}
                  </>
                )}

                {categoryLinks.map((link) => (
                  <li key={`link-${link.id}`}>
                    <LinkCard link={link} />
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
