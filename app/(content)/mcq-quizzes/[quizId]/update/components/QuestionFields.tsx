"use client";

import Input from "@/components/Input";
import { McqQuestion } from "@/types";
import { useState } from "react";
import ButtonIcon from "@/components/ButtonIcon";
import Button from "@/components/Button";
import TextArea from "@/components/TextArea";

const QuestionFields = ({
  quizId,
  defaultValues,
  formId,
}: {
  quizId: number;
  defaultValues?: McqQuestion;
  formId?: string;
}) => {
  const [correctOptionId, setCorrectOptionId] = useState(
    defaultValues ? defaultValues.correctOptionIndex : 0
  );
  const [currentId, setCurrentId] = useState(
    defaultValues ? defaultValues.options.length : 1
  );
  const [options, setOptions] = useState(
    defaultValues?.options.map((option, index) => ({
      id: index,
      value: option,
    })) || [{ id: 0, value: "Option 1" }]
  );

  return (
    <div>
      {defaultValues && (
        <input
          type="number"
          id={`question-${defaultValues?.id || "new"}-id`}
          name="question-id"
          className="hidden"
          defaultValue={defaultValues.id}
          form={formId}
        />
      )}
      <TextArea
        label="Text"
        icon="book-open"
        id={`question-${defaultValues?.id || "new"}-text`}
        name="text"
        required
        defaultValue={defaultValues?.text}
        className="mb-4"
        form={formId}
      />
      <Input
        label="Image"
        icon="link"
        type="url"
        id={`question-${defaultValues?.id || "new"}-image`}
        name="image"
        defaultValue={defaultValues?.image}
        className="mb-4"
        form={formId}
      />
      <TextArea
        label="Explanation"
        icon="book-open"
        id={`question-${defaultValues?.id || "new"}-explanation`}
        name="explanation"
        defaultValue={defaultValues?.explanation}
        className="mb-4"
        form={formId}
      />
      {options.map(({ id }, index) => (
        <li key={id} className="flex gap-2 mb-2">
          <div className="flex items-center">
            <input
              type="radio"
              name="correct-option-id"
              id={`option-${id}-radio`}
              value={id}
              checked={correctOptionId === id}
              onChange={() => setCorrectOptionId(id)}
              form={formId}
            />
          </div>
          <input
            type="text"
            id={`option-${id}-text`}
            name={`option-${id}-text`}
            className="grow"
            value={options[index].value}
            onChange={(e) => {
              setOptions((prev) => [
                ...prev.slice(0, index),
                { id, value: e.target.value },
                ...prev.slice(index + 1),
              ]);
            }}
            form={formId}
          />
          <ButtonIcon
            icon="x-mark"
            disabled={options.length < 2}
            onClick={() =>
              setOptions((prev) => [
                ...prev.slice(0, index),
                ...prev.slice(index + 1),
              ])
            }
          />
        </li>
      ))}
      <Button
        type="button"
        className="mb-4"
        onClick={() => {
          if (currentId >= +process.env.NEXT_PUBLIC_OPTIONS_LIMIT!) return;
          setOptions((prev) => [
            ...prev,
            { id: currentId, value: `Option ${currentId + 1}` },
          ]);
          setCurrentId((prev) => prev + 1);
        }}
      >
        Add Option
      </Button>
      <input
        type="number"
        id={`question-${defaultValues?.id || "new"}-quiz-id`}
        name="quiz-id"
        className="hidden"
        defaultValue={quizId}
        form={formId}
      />
    </div>
  );
};

export default QuestionFields;
