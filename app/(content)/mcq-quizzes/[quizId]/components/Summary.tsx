"use client";

import ButtonIcon from "@/components/ButtonIcon";
import Logo from "@/components/Logo";
import FilterButton from "@/components/FilterButton";
import { logEvent } from "@/lib/event-logger";
import { Action, McqQuestion, Resource } from "@/types";
import calcMcqResult from "@/utils/calcMcqResult";
import isValidURL from "@/utils/isValidURL";
import React, { useState } from "react";
import { useReactToPrint } from "react-to-print";
import ResultPieChart from "@/components/ResultPieChart";

interface SummaryProps {
  id: number;
  title: string;
  questions: McqQuestion[];
  answers: Map<number, number>;
  resetState: () => void;
}

export default function Summary({
  id,
  title,
  questions,
  answers,
  resetState,
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
    documentTitle: title,
    fonts: [
      {
        family: "Inter",
        source:
          "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
      },
    ],
    preserveAfterPrint: true,
  });

  return (
    <main className="quiz-main mx-auto">
      <div className="flex gap-2 mb-4">
        <ButtonIcon
          icon="printer"
          onClick={() => {
            logEvent(Resource.MCQ_QUIZ, id, Action.PRINT_SUMMARY, {});
            reactToPrintFn();
          }}
        />
        <ButtonIcon
          icon="arrow-path"
          onClick={() => {
            logEvent(Resource.MCQ_QUIZ, id, Action.RESTART_QUIZ, {});
            resetState();
          }}
        />
      </div>
      <div className="max-w-2xl print-section" ref={contentRef}>
        <div className="print-only">
          <Logo />
        </div>
        <h1 className="h1 my-4 print-only">{title}</h1>
        <div className="my-4">
          <ResultPieChart
            correct={correct}
            skipped={skipped}
            incorrect={incorrect}
            total={total}
          />
        </div>
        <div className="flex flex-wrap gap-2 my-4 print:hidden">
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
                key={question.id}
                className="layer-1 p-2 rounded-xl print:shadow-none"
              >
                <span className="font-bold">
                  {questionIndex + 1}. {question.text}
                </span>
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
