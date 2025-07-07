"use client";

import React, { useState } from "react";
import { useFormState } from "react-dom";

import ButtonIcon from "@/components/ButtonIcon";
import ButtonSubmit from "@/components/ButtonSubmit";
import Message from "@/components/Message";
import { addPracticalQuestion } from "@/lib/actions";
import { useAddForm } from "@/lib/hooks";
import Canvas from "./Canvas";
import QuestionFields from "./QuestionFields";

const formId = "practical-question-new";

export default function AddQuestionForm({ quizId }: { quizId: number }) {
  const [formState, formAction] = useFormState(addPracticalQuestion, {});
  const { hideMessage, setHideMessage, formKey } = useAddForm(formState);

  return (
    <div
      className="flex flex-col gap-4 max-w-lg"
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
