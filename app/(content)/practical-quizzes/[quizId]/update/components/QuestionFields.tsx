"use client";

import React, { useState } from "react";
import Canvas, { State } from "./Canvas";
import ButtonIcon from "@/components/ButtonIcon";

interface WrittenQuestion {
  id?: number;
  text: string;
  answer: string;
}

export default function QuestionFields({
  init,
  quizId,
  formId,
}: {
  init?: {
    id: number;
    state: State;
    imageUrl: string;
    writtenQuestions: WrittenQuestion[];
  };
  quizId: number;
  formId: string;
}) {
  const [writtenQuestions, setWrittenQuestions] = useState<
    { counter: number; value: WrittenQuestion }[]
  >(
    init
      ? init.writtenQuestions.map((value, index) => ({ counter: index, value }))
      : [{ counter: 0, value: { text: "Identify.", answer: "Answer 1." } }]
  );
  const [currentCounter, setCurrentCounter] = useState(1);

  return (
    <div className="flex flex-col gap-4">
      <Canvas
        formId={formId}
        init={
          init && { id: init.id, state: init.state, imageUrl: init.imageUrl }
        }
      />
      <input
        type="number"
        id={`practical-question-${init ? init.id : "new"}-quiz-id`}
        name="quiz-id"
        className="hidden"
        defaultValue={quizId}
        form={formId}
      />
      {init && (
        <input
          type="number"
          id={`practical-question-${init ? init.id : "new"}-question-id`}
          name="question-id"
          className="hidden"
          defaultValue={init.id}
          form={formId}
        />
      )}
      {writtenQuestions.map(
        ({ counter, value: { id, text, answer } }, index) => (
          <li key={id} className="flex items-center gap-2">
            <div className="flex flex-col gap-2 grow *:px-2 *:py-1 *:border">
              {id && (
                <input
                  type="text"
                  name={`written-question-${counter}-id`}
                  id={`practical-question-${
                    init ? init.id : "new"
                  }-written-question-${counter}-id`}
                  className="hidden"
                  defaultValue={id}
                  form={formId}
                />
              )}
              <input
                type="text"
                name={`written-question-${counter}-text`}
                id={`practical-question-${
                  init ? init.id : "new"
                }-written-question-${counter}-text`}
                value={text}
                onChange={(e) => {
                  setWrittenQuestions((prev) => [
                    ...prev.slice(0, index),
                    { counter, value: { text: e.target.value, answer } },
                    ...prev.slice(index + 1),
                  ]);
                }}
                form={formId}
              />
              <input
                type="text"
                name={`written-question-${counter}-answer`}
                id={`practical-question-${
                  init ? init.id : "new"
                }-written-question-${counter}-answer`}
                value={answer}
                onChange={(e) => {
                  setWrittenQuestions((prev) => [
                    ...prev.slice(0, index),
                    { counter, value: { text, answer: e.target.value } },
                    ...prev.slice(index + 1),
                  ]);
                }}
                form={formId}
              />
            </div>
            <ButtonIcon
              icon="x-mark"
              disabled={writtenQuestions.length < 2}
              onClick={() =>
                setWrittenQuestions((prev) => [
                  ...prev.slice(0, index),
                  ...prev.slice(index + 1),
                ])
              }
            />
          </li>
        )
      )}
      <ButtonIcon
        icon="plus"
        type="button"
        className="w-max"
        onClick={() => {
          if (currentCounter >= +process.env.NEXT_PUBLIC_OPTIONS_LIMIT!) return;
          setWrittenQuestions((prev) => [
            ...prev,
            {
              counter: currentCounter,
              value: {
                text: `Question ${currentCounter + 1}.`,
                answer: `Answer ${currentCounter + 1}.`,
              },
            },
          ]);
          setCurrentCounter((prev) => prev + 1);
        }}
      />
    </div>
  );
}
