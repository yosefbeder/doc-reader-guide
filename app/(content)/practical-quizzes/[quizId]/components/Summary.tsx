"use client";

import React, { useCallback, useEffect, useState } from "react";
import { Answers } from "./QuestionsList";
import { PracticalQuestion, QuestionState } from "@/types";
import ButtonIcon from "@/components/ButtonIcon";
import calcFactor from "@/utils/calcFactor";

const border = new Map([
  [QuestionState.TRUE, "border-green-600"],
  [QuestionState.FALSE, "border-red-600"],
  [QuestionState.UNANSWERED, "border-yellow-600"],
  [QuestionState.UNSELECTED, "border-yellow-600"],
]);

const writtenAnswer = new Map([
  [QuestionState.TRUE, "text-green-600"],
  [QuestionState.FALSE, "text-red-600"],
  [QuestionState.UNANSWERED, "text-yellow-600"],
  [QuestionState.UNSELECTED, "text-yellow-600"],
]);

interface SummaryProps {
  title: string;
  questions: PracticalQuestion[];
  answers: Answers;
  resetState: () => void;
}

export default function Summary({
  questions,
  answers,
  resetState,
}: SummaryProps) {
  let total = answers.tapes.size + answers.writtenQuestions.size;
  let correct = 0;
  answers.tapes.forEach((value) => value === QuestionState.TRUE && correct++);
  answers.writtenQuestions.forEach(
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
      <div className="flex gap-2 mb-4">
        <ButtonIcon icon="arrow-path" onClick={resetState} />
      </div>
      <h2 className="my-4">
        Result → {correct} / {total} (
        {Math.round((correct / total) * 10000) / 100}%)
      </h2>
      <h2 className="my-4">Summary</h2>
      <p className="my-4">
        <span className="text-green-600">* Correct</span>
        <br />
        <span className="text-red-600">* Incorrect</span>
        <br />
        <span className="text-yellow-600">* Skipped</span>
      </p>
      <ol>
        {questions.map((question, index) => {
          const factor = factors[index];
          return (
            <>
              {factor && (
                <div className="relative mb-4">
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
              <ol className="mb-4">
                {question.writtenQuestions.map(
                  ({ id, text, answer }, index) => {
                    const questionState = answers.writtenQuestions.get(id)!;
                    return (
                      <li key={`question-${id}`}>
                        <p className="font-bold">
                          {index + 1}. {text}
                        </p>
                        <p className={writtenAnswer.get(questionState)}>
                          {answer}
                        </p>
                      </li>
                    );
                  }
                )}
              </ol>
            </>
          );
        })}
      </ol>
    </>
  );
}
