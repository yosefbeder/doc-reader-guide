"use client";

import React, { useCallback, useEffect, useState } from "react";
import {
  Answers,
  subQuestionMessageType,
  subQuestionText,
} from "./QuestionsList";
import { WrittenQuestion, QuestionState } from "@/types";
import ButtonIcon from "@/components/ButtonIcon";
import calcFactor from "@/utils/calcFactor";
import Message from "@/components/Message";
import HtmlContentClient from "@/components/HtmlContentClient";
import { SummaryDetail } from "@/components/SummaryDetail";

const border = new Map([
  [QuestionState.TRUE, "border-green-600"],
  [QuestionState.FALSE, "border-red-600"],
  [QuestionState.UNANSWERED, "border-yellow-600"],
  [QuestionState.UNSELECTED, "border-yellow-600"],
]);

interface SummaryProps {
  title: string;
  questions: WrittenQuestion[];
  answers: Answers;
  resetState: () => void;
}

export default function Summary({
  questions,
  answers,
  resetState,
}: SummaryProps) {
  const [currentIndex, setCurrentIndex] = useState<number>();
  let total = answers.tapes.size + answers.subQuestions.size;
  let correct = 0;
  answers.tapes.forEach((value) => value === QuestionState.TRUE && correct++);
  answers.subQuestions.forEach(
    (value) => value === QuestionState.TRUE && correct++
  );
  const calcFactors = useCallback(
    () =>
      questions.map((question) =>
        question.image ? calcFactor(question.width!) : null
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
    <>
      <div className="flex gap-2">
        <ButtonIcon icon="arrow-path" onClick={resetState} />
      </div>
      <h2 className="my-4">
        Result → {correct} / {total} (
        {Math.round((correct / total) * 10000) / 100}%)
      </h2>
      <h2 className="my-4">Summary</h2>
      <ol className="flex flex-col gap-4 max-w-xl">
        {questions.map((question, index) => {
          const factor = factors[index];
          return (
            <li key={question.id}>
              <SummaryDetail
                open={currentIndex === index}
                toggle={() =>
                  setCurrentIndex((prev) =>
                    prev === index ? undefined : index
                  )
                }
              >
                <SummaryDetail.Summary>
                  Question {index + 1}
                </SummaryDetail.Summary>
                <SummaryDetail.Detail>
                  <div className="p-2 flex flex-col gap-4">
                    {factor && (
                      <div className="relative">
                        <img
                          src={`${process.env.NEXT_PUBLIC_STATIC_URL}/image/${question.image}`}
                          width={question.width! * factor}
                          height={question.height! * factor}
                          alt="Question"
                        />
                        {question.masks.map(({ id, x, y, w, h }) => (
                          <div
                            key={"mask-" + id}
                            style={{
                              position: "absolute",
                              left: x * factor,
                              top: y * factor,
                              width: w * factor,
                              height: h * factor,
                              background: "white",
                              border: "2px solid black",
                            }}
                          ></div>
                        ))}
                        {question.tapes.map(({ id, x, y, w, h }) => (
                          <div
                            key={"tape-" + id}
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
                    <ol className="flex flex-col gap-4">
                      {question.subQuestions.map(
                        ({ id, text, answer }, index) => {
                          const questionState = answers.subQuestions.get(id)!;
                          return (
                            <li
                              key={`question-${id}`}
                              className="flex flex-col gap-4"
                            >
                              <p className="font-bold">
                                {question.subQuestions.length > 1
                                  ? `${index + 1}. ${text}`
                                  : text}
                              </p>
                              <>
                                <Message
                                  type={
                                    subQuestionMessageType.get(questionState)!
                                  }
                                >
                                  {subQuestionText.get(questionState)}
                                </Message>
                                <HtmlContentClient html={answer} />
                              </>
                            </li>
                          );
                        }
                      )}
                    </ol>
                  </div>
                </SummaryDetail.Detail>
              </SummaryDetail>
            </li>
          );
        })}
      </ol>
    </>
  );
}
