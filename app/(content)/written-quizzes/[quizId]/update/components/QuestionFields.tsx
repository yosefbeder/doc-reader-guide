"use client";

import React, { useState } from "react";
import Canvas, { State } from "./Canvas";
import ButtonIcon from "@/components/ButtonIcon";
import RichTextEditor from "@/components/RichTextEditor/RichTextEditor";
import replaceImgSrc from "@/utils/replaceImgSrc";

interface SubQuestion {
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
    imageUrl?: string;
    subQuestions: SubQuestion[];
  };
  quizId: number;
  formId: string;
}) {
  const [subQuestions, setSubQuestions] = useState<
    { counter: number; value: SubQuestion }[]
  >(
    init
      ? init.subQuestions.map((value, index) => ({ counter: index, value }))
      : [{ counter: 0, value: { text: "", answer: "" } }]
  );
  const [currentCounter, setCurrentCounter] = useState(
    init ? init.subQuestions.length : 1
  );
  return (
    <div className="flex flex-col gap-4 mb-4">
      <Canvas
        formId={formId}
        init={
          init && { id: init.id, state: init.state, imageUrl: init.imageUrl }
        }
      />
      <input
        type="number"
        id={`written-question-${init ? init.id : "new"}-quiz-id`}
        name="quiz-id"
        className="hidden"
        defaultValue={quizId}
        form={formId}
      />
      {init && (
        <input
          type="number"
          id={`written-question-${init ? init.id : "new"}-question-id`}
          name="question-id"
          className="hidden"
          defaultValue={init.id}
          form={formId}
        />
      )}
      {subQuestions.map(({ counter, value: { id, text, answer } }, index) => (
        <li key={`sub-question-${counter}`} className="flex items-center gap-2">
          <div className="flex flex-col gap-2 grow">
            {id && (
              <input
                type="text"
                name={`sub-question-${counter}-id`}
                id={`written-question-${
                  init ? init.id : "new"
                }-sub-question-${counter}-id`}
                className="hidden"
                defaultValue={id}
                form={formId}
              />
            )}
            <textarea
              className="px-2 py-1 border"
              name={`sub-question-${counter}-text`}
              id={`written-question-${
                init ? init.id : "new"
              }-sub-question-${counter}-text`}
              value={text}
              placeholder="Question"
              onChange={(e) => {
                setSubQuestions((prev) => [
                  ...prev.slice(0, index),
                  { counter, value: { id, text: e.target.value, answer } },
                  ...prev.slice(index + 1),
                ]);
              }}
              form={formId}
            />
            <RichTextEditor
              name={`sub-question-${counter}-answer`}
              id={`written-question-${
                init ? init.id : "new"
              }-sub-question-${counter}-answer`}
              value={replaceImgSrc(answer)}
              placeholder="Answer"
              onChange={(value) => {
                setSubQuestions((prev) => [
                  ...prev.slice(0, index),
                  { counter, value: { id, text, answer: value } },
                  ...prev.slice(index + 1),
                ]);
              }}
              form={formId}
            />
          </div>
          <ButtonIcon
            icon="x-mark"
            onClick={() =>
              setSubQuestions((prev) => [
                ...prev.slice(0, index),
                ...prev.slice(index + 1),
              ])
            }
          />
        </li>
      ))}
      <ButtonIcon
        icon="plus"
        type="button"
        className="w-max"
        onClick={() => {
          if (currentCounter >= +process.env.NEXT_PUBLIC_OPTIONS_LIMIT!) return;
          setSubQuestions((prev) => [
            ...prev,
            {
              counter: currentCounter,
              value: {
                text: "",
                answer: "",
              },
            },
          ]);
          setCurrentCounter((prev) => prev + 1);
        }}
      />
    </div>
  );
}
