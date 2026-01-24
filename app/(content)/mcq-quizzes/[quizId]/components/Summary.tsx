"use client";

import ButtonIcon from "@/components/ButtonIcon";
import Logo from "@/components/Logo";
import FilterButton from "@/components/FilterButton";
import { logEvent } from "@/lib/event-logger";
import { Action, McqQuestion, McqQuiz, Resource } from "@/types";
import calcMcqResult from "@/utils/calcMcqResult";
import isValidURL from "@/utils/isValidURL";
import { useSearchParams } from "next/navigation";
import React, { useState, useEffect } from "react";
import { useReactToPrint } from "react-to-print";
import ResultPieChart from "@/components/ResultPieChart";
import { icons } from "@/components/icons";
import { shareQuestion } from "../utils/shareQuestion";

interface SummaryProps {
  quiz: McqQuiz;
  questions: McqQuestion[];
  answers: Map<number, number>;
  resetState: () => void;
  stopwatch?: number;
}

export default function Summary({
  quiz,
  questions,
  answers,
  resetState,
  stopwatch,
}: SummaryProps) {
  const { correct, total } = calcMcqResult(questions, answers);
  const [filter, setFilter] = useState<
    "all" | "correct" | "incorrect" | "skipped"
  >("all");

  const skipped = questions.filter((q) => !answers.has(q.id)).length;
  const incorrect = total - correct - skipped;
  const contentRef = React.useRef<HTMLDivElement>(null);
  const reactToPrintFn = useReactToPrint({
    contentRef,
    documentTitle: quiz.title,
    fonts: [
      {
        family: "Inter",
        source:
          "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
      },
    ],
    preserveAfterPrint: true,
  });

  const searchParams = useSearchParams();

  useEffect(() => {
    const questionIdParam = searchParams.get("questionId");
    if (questionIdParam) {
      const element = document.getElementById(`question-${questionIdParam}`);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "center" });
        // Add a highlight effect
        element.classList.add("ring-2", "ring-primary");
        setTimeout(() => {
          element.classList.remove("ring-2", "ring-primary");
        }, 2000);
      }
    }
  }, [searchParams]);

  return (
    <main className="quiz-main mx-auto">
      <div className="flex gap-2 mb-4">
        <ButtonIcon
          icon="printer"
          onClick={() => {
            logEvent(Resource.MCQ_QUIZ, quiz.id, Action.PRINT_SUMMARY, {});
            reactToPrintFn();
          }}
        />
        <ButtonIcon
          icon="arrow-path"
          onClick={() => {
            logEvent(Resource.MCQ_QUIZ, quiz.id, Action.RESTART_QUIZ, {});
            resetState();
          }}
        />
      </div>
      <div className="max-w-2xl print-section" ref={contentRef}>
        <div className="print-only">
          <Logo />
        </div>
        <h1 className="h1 my-4 print-only">{quiz.title}</h1>
        {stopwatch !== undefined && (
          <div className="caption my-4">
            Total Time: {Math.floor(stopwatch / 60)}:
            {(stopwatch % 60).toString().padStart(2, "0")}
          </div>
        )}
        <div className="my-4">
          <ResultPieChart
            correct={correct}
            skipped={skipped}
            incorrect={incorrect}
            total={total}
          />
        </div>
        <div className="flex flex-wrap gap-2 my-4">
          <FilterButton
            onClick={() => setFilter("all")}
            active={filter === "all"}
            color="gray"
          >
            All ({total})
          </FilterButton>
          {correct ? (
            <FilterButton
              onClick={() => setFilter("correct")}
              active={filter === "correct"}
              color="green"
            >
              Correct ({correct})
            </FilterButton>
          ) : null}
          {incorrect ? (
            <FilterButton
              onClick={() => setFilter("incorrect")}
              active={filter === "incorrect"}
              color="red"
            >
              Incorrect ({incorrect})
            </FilterButton>
          ) : null}
          {skipped ? (
            <FilterButton
              onClick={() => setFilter("skipped")}
              active={filter === "skipped"}
              color="yellow"
            >
              Skipped ({skipped})
            </FilterButton>
          ) : null}
        </div>
        <ol className="col">
          {questions.map((question, questionIndex) => {
            const isSkipped = !answers.has(question.id);
            const isCorrect =
              !isSkipped &&
              answers.get(question.id) === question.correctOptionIndex;
            const isIncorrect = !isSkipped && !isCorrect;

            let status = "skipped";
            if (isCorrect) status = "correct";
            if (isIncorrect) status = "incorrect";

            if (filter !== "all" && filter !== status) return null;

            return (
              <li
                id={`question-${question.id}`}
                key={question.id}
                className="layer-1 p-2 rounded-xl print:shadow-none"
              >
                <div className="flex gap-2">
                  <span className="font-bold flex-1">
                    {questionIndex + 1}. {question.text}
                  </span>
                  <button
                    className="self-start"
                    onClick={() => shareQuestion(quiz, question, "summary")}
                  >
                    {icons["share"]}
                  </button>
                </div>
                {question.image ? (
                  <img src={question.image} alt="Question associated diagram" />
                ) : null}
                <ol className="list-[upper-alpha] list-inside">
                  {question.options.map((option, optionIndex) => (
                    <li
                      key={optionIndex}
                      className={`${(() => {
                        if (
                          optionIndex ===
                          questions[questionIndex].correctOptionIndex
                        )
                          if (!answers.has(question.id))
                            return "text-yellow-600";
                          else return "text-green-600";
                        else if (answers.get(question.id) === optionIndex)
                          return "text-red-600";
                      })()}`}
                    >
                      {option}
                      {optionIndex === question.correctOptionIndex
                        ? " (Correct)"
                        : answers.has(question.id) &&
                            answers.get(question.id) === optionIndex
                          ? " (Incorrect)"
                          : null}
                    </li>
                  ))}
                </ol>
                {question.explanation && (
                  <p>
                    <b>Explanation: </b>
                    {isValidURL(question.explanation) ? (
                      <a
                        className="link"
                        href={question.explanation}
                        target="_blank"
                      >
                        {question.explanation}
                      </a>
                    ) : (
                      question.explanation
                    )}
                  </p>
                )}
              </li>
            );
          })}
        </ol>
      </div>
    </main>
  );
}
