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
import ButtonIcon from "@/components/ButtonIcon";
import calcFactor from "@/utils/calcFactor";
import Message from "@/components/Message";
import HtmlContentClient from "@/components/HtmlContentClient";
import { logEvent } from "@/lib/event-logger";
import ResultPieChart from "@/components/ResultPieChart";
import FilterButton from "@/components/FilterButton";
import { useReactToPrint } from "react-to-print";
import Logo from "@/components/Logo";

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
}

export default function Summary({
  quiz,
  questions,
  answers,
  resetState,
}: SummaryProps) {
  const [filter, setFilter] = useState<
    "all" | QuestionState.TRUE | QuestionState.FALSE | "skipped"
  >("all");
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

  const correct =
    Array.from(answers.tapes.values()).filter((v) => v === QuestionState.TRUE)
      .length +
    Array.from(answers.subQuestions.values()).filter(
      (v) => v === QuestionState.TRUE
    ).length;

  const incorrect =
    Array.from(answers.tapes.values()).filter((v) => v === QuestionState.FALSE)
      .length +
    Array.from(answers.subQuestions.values()).filter(
      (v) => v === QuestionState.FALSE
    ).length;

  const total = answers.tapes.size + answers.subQuestions.size;
  const skipped = total - correct - incorrect;
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

  return (
    <main className="quiz-main">
      <div className="flex gap-2 mb-4">
        <ButtonIcon
          icon="printer"
          onClick={() => {
            logEvent(Resource.WRITTEN_QUIZ, quiz.id, Action.PRINT_SUMMARY, {});
            reactToPrintFn();
          }}
        />
        <ButtonIcon
          icon="arrow-path"
          onClick={() => {
            logEvent(Resource.WRITTEN_QUIZ, quiz.id, Action.RESTART_QUIZ, {});
            resetState();
          }}
        />
      </div>
      <div className="print-section" ref={contentRef}>
        <div className="print-only">
          <Logo />
        </div>
        <h1 className="h1 my-4 print-only">{quiz.title}</h1>
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
              onClick={() => setFilter(QuestionState.TRUE)}
              active={filter === QuestionState.TRUE}
              color="green"
            >
              Correct ({correct})
            </FilterButton>
          ) : null}
          {incorrect ? (
            <FilterButton
              onClick={() => setFilter(QuestionState.FALSE)}
              active={filter === QuestionState.FALSE}
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
            question.tapes.forEach((t) => check(answers.tapes.get(t.id)!));
            question.subQuestions.forEach((s) =>
              check(answers.subQuestions.get(s.id)!)
            );

            if (filter !== "all") {
              if (filter === QuestionState.TRUE && !hasCorrect) return null;
              if (filter === QuestionState.FALSE && !hasIncorrect) return null;
              if (filter === "skipped" && !hasSkipped) return null;
            }

            return (
              <li
                key={`written-question-${question.id}`}
                className="layer-1 p-2 rounded-xl col"
              >
                <h2>Question {index + 1}</h2>
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
                              ].includes(answers.tapes.get(id)!)) ||
                            answers.tapes.get(id) === filter
                        )
                        .map(({ id, x, y, w, h }) => (
                          <div
                            key={`written-question-${question.id}-tape-${id}`}
                            className={`border-2 ${border.get(
                              answers.tapes.get(id)!
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
                    {question.subQuestions.map(
                      ({ id, text, answer }, index) => {
                        const questionState = answers.subQuestions.get(id)!;
                        if (
                          filter === "all" ||
                          (filter === "skipped" &&
                            [
                              QuestionState.UNANSWERED,
                              QuestionState.UNSELECTED,
                            ].includes(answers.subQuestions.get(id)!)) ||
                          answers.subQuestions.get(id) === filter
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
                                  type={
                                    subQuestionMessageType.get(questionState)!
                                  }
                                >
                                  {subQuestionText.get(questionState)}
                                </Message>
                              </div>
                              <HtmlContentClient html={answer} />
                            </li>
                          );
                      }
                    )}
                  </ol>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </main>
  );
}
