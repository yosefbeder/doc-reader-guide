"use client";

import { Action, McqQuestion, McqQuiz, Resource } from "@/types";
import calcMcqResult from "@/utils/calcMcqResult";
import isValidURL from "@/utils/isValidURL";
import { useSearchParams } from "next/navigation";
import React, { useState, useEffect } from "react";
import { icons } from "@/components/icons";
import { useQuizHistory } from "@/lib/hooks/useQuizHistory";
import { shareQuestion } from "../utils/shareQuestion";
import Button from "@/components/Button";
import { logEvent } from "@/lib/event-logger";
import buildChatGPTLink from "@/utils/buildChatGPTLink";
import toUppercaseLetter from "../utils/toUppercaseLetter";
import QuizSummaryLayout from "@/components/QuizSummaryLayout";

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
  /* eslint-disable react-hooks/exhaustive-deps */
  const calcResult = React.useCallback(
    (a: Map<number, number>) => {
      const { correct, total } = calcMcqResult(questions, a);
      const skipped = questions.filter((q) => !a.has(q.id)).length;
      const incorrect = total - correct - skipped;
      return { correct, incorrect, skipped, total };
    },
    [questions]
  );
  const deserialize = React.useCallback(
    (data: any) => new Map<number, number>(data),
    []
  );

  const {
    selectedAttempt,
    selectedAttemptIndex,
    setSelectedAttemptIndex,
    allAttempts,
  } = useQuizHistory(
    quiz.id,
    "mcq",
    answers,
    stopwatch,
    calcResult,
    deserialize
  );

  const {
    correct,
    incorrect,
    skipped,
    total,
    answers: displayAnswers,
  } = selectedAttempt;

  const [filter, setFilter] = useState<
    "all" | "correct" | "incorrect" | "skipped"
  >("all");

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

  const filterOptions = [
    { label: `All (${total})`, value: "all" as const, color: "gray" as const },
    ...(correct
      ? [
          {
            label: `Correct (${correct})`,
            value: "correct" as const,
            color: "green" as const,
          },
        ]
      : []),
    ...(incorrect
      ? [
          {
            label: `Incorrect (${incorrect})`,
            value: "incorrect" as const,
            color: "red" as const,
          },
        ]
      : []),
    ...(skipped
      ? [
          {
            label: `Skipped (${skipped})`,
            value: "skipped" as const,
            color: "yellow" as const,
          },
        ]
      : []),
  ];

  return (
    <QuizSummaryLayout
      quiz={quiz}
      resource={Resource.MCQ_QUIZ}
      resetState={resetState}
      history={{
        attempts: allAttempts,
        selectedAttemptIndex,
        onSelectAttempt: setSelectedAttemptIndex,
      }}
      stats={{
        correct,
        incorrect,
        skipped,
        total,
        stopwatch: selectedAttempt.stopwatch,
      }}
      filter={filter}
      onFilterChange={setFilter}
      filterOptions={filterOptions}
    >
      {incorrect > 0 && (
        <Button className="self-center mb-4">
          <a
            href={buildChatGPTLink(
              questions
                .filter((q) => {
                  const isSkipped = !displayAnswers.has(q.id);
                  const isCorrect =
                    !isSkipped &&
                    displayAnswers.get(q.id) === q.correctOptionIndex;
                  return !isSkipped && !isCorrect;
                })
                .map(
                  (q) =>
                    `${q.text}\n${q.options
                      .map((opt, i) => `${toUppercaseLetter(i)}. ${opt}`)
                      .join("\n")}`
                )
                .join("\n\n---\n\n"),
              quiz.lectureData.subject.module.customGPT
            )}
            onClick={() =>
              logEvent(Resource.MCQ_QUIZ, quiz.id, Action.DICUSS_WITH_CHATGPT, {
                questionIds: questions
                  .filter((q) => {
                    const isSkipped = !displayAnswers.has(q.id);
                    const isCorrect =
                      !isSkipped &&
                      displayAnswers.get(q.id) === q.correctOptionIndex;
                    return !isSkipped && !isCorrect;
                  })
                  .map((q) => q.id),
              })
            }
            className="flex gap-2 items-center justify-center"
            target="_blank"
          >
            {icons["open-ai"]}
            Discuss All Incorrects with ChatGPT
          </a>
        </Button>
      )}
      <ol className="col">
        {questions.map((question, questionIndex) => {
          const isSkipped = !displayAnswers.has(question.id);
          const isCorrect =
            !isSkipped &&
            displayAnswers.get(question.id) === question.correctOptionIndex;
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
                <h3 className="flex-1">
                  {questionIndex + 1}. {question.text}
                </h3>
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
                        if (!displayAnswers.has(question.id))
                          return "text-yellow-600";
                        else return "text-green-600";
                      else if (displayAnswers.get(question.id) === optionIndex)
                        return "text-red-600";
                    })()}`}
                  >
                    {option}
                    {optionIndex === question.correctOptionIndex
                      ? " (Correct)"
                      : displayAnswers.has(question.id) &&
                          displayAnswers.get(question.id) === optionIndex
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
    </QuizSummaryLayout>
  );
}
