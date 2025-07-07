"use client";

import React from "react";

import Message from "@/components/Message";
import { Link as LinkType, PracticalQuiz, Quiz as QuizType } from "@/types";
import Link from "./Link";
import { icons } from "@/components/icons";
import Quiz from "./Quiz";
import { useCategories } from "@/lib/hooks";

export default function LinksList({
  links,
  quizzes,
  practicalQuizzes,
}: {
  links: LinkType[];
  quizzes: QuizType[];
  practicalQuizzes: PracticalQuiz[];
}) {
  const { categories, currentCategory, setCurrentCategory } = useCategories(
    links,
    quizzes,
    practicalQuizzes
  );

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
                    {quizzes.map((quiz) => (
                      <li key={quiz.id}>
                        <Quiz type="mcq" quiz={quiz} printable />
                      </li>
                    ))}
                    {practicalQuizzes.map((quiz) => (
                      <li key={`practical-${quiz.id}`}>
                        <Quiz type="practical" quiz={quiz} />
                      </li>
                    ))}
                  </>
                )}
                {categoryLinks.map((link) => (
                  <li key={link.id}>
                    <Link link={link} />
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
