"use client";

import React from "react";
import { useFormState } from "react-dom";

import ButtonSubmit from "@/components/ButtonSubmit";
import Message from "@/components/Message";
import { addQuestion } from "@/lib/actions/writtenQuizzes";
import { useAddForm } from "@/lib/hooks";
import QuestionFields from "./QuestionFields";

const formId = "practical-question-new";

export default function AddQuestionForm({ quizId }: { quizId: number }) {
  const [formState, formAction] = useFormState(addQuestion, {});
  const { hideMessage, setHideMessage, formKey } = useAddForm(formState);

  return (
    <div
      className="flex flex-col gap-4 max-w-xl"
      onClickCapture={() => setHideMessage(true)}
    >
      <form
        action={formAction}
        key={formKey}
        id={formId}
        className="flex flex-col gap-4"
      >
        <QuestionFields quizId={quizId} formId={formId} />
        {formState.message && formState.type && !hideMessage && (
          <Message type={formState.type}>{formState.message}</Message>
        )}
        <ButtonSubmit className="w-max">Add Question</ButtonSubmit>
      </form>
    </div>
  );
}
