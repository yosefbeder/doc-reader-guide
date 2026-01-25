"use client";

import React, { useCallback, useEffect, useState } from "react";
import {
  Answers,
  subQuestionMessageType,
  subQuestionText,
} from "./QuestionsList";
import {
  WrittenQuestion,
  QuestionState,
  Resource,
  Action,
  WrittenQuiz,
} from "@/types";
import calcFactor from "@/utils/calcFactor";
import Message from "@/components/Message";
import HtmlContentClient from "@/components/HtmlContentClient";
import { useSearchParams } from "next/navigation";
import { icons } from "@/components/icons";
import { shareQuestion } from "../utils/shareQuestion";
import { useQuizHistory } from "@/lib/hooks/useQuizHistory";
import QuizSummaryLayout from "@/components/QuizSummaryLayout";

const border = new Map([
  [QuestionState.TRUE, "border-green-600"],
  [QuestionState.FALSE, "border-red-600"],
  [QuestionState.UNANSWERED, "border-yellow-600"],
  [QuestionState.UNSELECTED, "border-yellow-600"],
]);

interface SummaryProps {
  quiz: WrittenQuiz;
  questions: WrittenQuestion[];
  answers: Answers;
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
  const [filter, setFilter] = useState<
    "all" | QuestionState.TRUE | QuestionState.FALSE | "skipped"
  >("all");
  /* eslint-disable react-hooks/exhaustive-deps */
  const deserialize = React.useCallback((data: any) => {
    const json = JSON.parse(data);
    return {
      tapes: new Map<number, QuestionState>(json.tapes),
      subQuestions: new Map<number, QuestionState>(json.subQuestions),
    };
  }, []);

  const calcResult = React.useCallback((a: Answers) => {
    const correct =
      Array.from(a.tapes.values()).filter((v) => v === QuestionState.TRUE)
        .length +
      Array.from(a.subQuestions.values()).filter(
        (v) => v === QuestionState.TRUE
      ).length;

    const incorrect =
      Array.from(a.tapes.values()).filter((v) => v === QuestionState.FALSE)
        .length +
      Array.from(a.subQuestions.values()).filter(
        (v) => v === QuestionState.FALSE
      ).length;

    const total = a.tapes.size + a.subQuestions.size;
    const skipped = total - correct - incorrect;
    return { correct, incorrect, skipped, total };
  }, []);

  const {
    selectedAttempt,
    selectedAttemptIndex,
    setSelectedAttemptIndex,
    allAttempts,
  } = useQuizHistory(
    quiz.id,
    "written",
    answers,
    stopwatch || 0,
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
  const calcFactors = useCallback(
    () =>
      questions.map((question) =>
        question.image ? calcFactor(question.width!, 16) : null
      ),
    [questions]
  );
  const [factors, setFactors] = useState(calcFactors());

  useEffect(() => {
    const adjustImages = () => setFactors(calcFactors());
    window.addEventListener("resize", adjustImages);
    return () => window.removeEventListener("resize", adjustImages);
  }, [calcFactors]);

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
            value: QuestionState.TRUE,
            color: "green" as const,
          },
        ]
      : []),
    ...(incorrect
      ? [
          {
            label: `Incorrect (${incorrect})`,
            value: QuestionState.FALSE,
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
  ] as any; // Cast to any or correct specific union type if complex

  return (
    <QuizSummaryLayout
      quiz={quiz}
      resource={Resource.WRITTEN_QUIZ}
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
      <ol className="col">
        {questions.map((question, index) => {
          const factor = factors[index];
          let hasCorrect = false;
          let hasIncorrect = false;
          let hasSkipped = false;
          const check = (s: QuestionState) => {
            if (s === QuestionState.FALSE) hasIncorrect = true;
            if (
              s === QuestionState.UNANSWERED ||
              s === QuestionState.UNSELECTED
            )
              hasSkipped = true;
            if (s === QuestionState.TRUE) hasCorrect = true;
          };
          question.tapes.forEach((t) => check(displayAnswers.tapes.get(t.id)!));
          question.subQuestions.forEach((s) =>
            check(displayAnswers.subQuestions.get(s.id)!)
          );

          if (filter !== "all") {
            if (filter === QuestionState.TRUE && !hasCorrect) return null;
            if (filter === QuestionState.FALSE && !hasIncorrect) return null;
            if (filter === "skipped" && !hasSkipped) return null;
          }

          return (
            <li
              id={`question-${question.id}`}
              key={`written-question-${question.id}`}
              className="layer-1 p-2 rounded-xl col"
            >
              <div className="flex gap-2">
                <h2 className="flex-1">Question {index + 1}</h2>
                <button
                  className="self-start"
                  onClick={() => shareQuestion(quiz, question, "summary")}
                >
                  {icons["share"]}
                </button>
              </div>
              <div>
                {factor && (
                  <div className="relative mb-4">
                    <img
                      src={`${process.env.NEXT_PUBLIC_STATIC_URL}/image/${question.image}`}
                      width={question.width! * factor}
                      height={question.height! * factor}
                      alt="Question"
                    />
                    {question.tapes
                      .filter(
                        ({ id }) =>
                          filter === "all" ||
                          (filter === "skipped" &&
                            [
                              QuestionState.UNANSWERED,
                              QuestionState.UNSELECTED,
                            ].includes(displayAnswers.tapes.get(id)!)) ||
                          displayAnswers.tapes.get(id) === filter
                      )
                      .map(({ id, x, y, w, h }) => (
                        <div
                          key={`written-question-${question.id}-tape-${id}`}
                          className={`border-2 ${border.get(
                            displayAnswers.tapes.get(id)!
                          )}`}
                          style={{
                            position: "absolute",
                            left: x * factor,
                            top: y * factor,
                            width: w * factor,
                            height: h * factor,
                          }}
                        ></div>
                      ))}
                  </div>
                )}
                <ol className="col list-decimal list-inside">
                  {question.subQuestions.map(({ id, text, answer }, index) => {
                    const questionState = displayAnswers.subQuestions.get(id)!;
                    if (
                      filter === "all" ||
                      (filter === "skipped" &&
                        [
                          QuestionState.UNANSWERED,
                          QuestionState.UNSELECTED,
                        ].includes(displayAnswers.subQuestions.get(id)!)) ||
                      displayAnswers.subQuestions.get(id) === filter
                    )
                      return (
                        <li
                          key={`written-question-${question.id}-sub-question-${id}`}
                          className="col"
                        >
                          <p className="font-bold inline">
                            {question.subQuestions.length > 1
                              ? `${index + 1}. ${text}`
                              : text}
                          </p>
                          <div>
                            <Message
                              type={subQuestionMessageType.get(questionState)!}
                            >
                              {subQuestionText.get(questionState)}
                            </Message>
                          </div>
                          <HtmlContentClient html={answer} />
                        </li>
                      );
                  })}
                </ol>
              </div>
            </li>
          );
        })}
      </ol>
    </QuizSummaryLayout>
  );
}
