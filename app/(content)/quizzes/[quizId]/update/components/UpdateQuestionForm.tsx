"use client";

import { useRef } from "react";
import { useFormState } from "react-dom";

import QuestionFields from "./QuestionFields";
import { deleteQuestion, updateQuestion } from "@/lib/actions";
import Message from "@/components/Message";
import ButtonSubmit from "@/components/ButtonSubmit";
import { Question } from "@/types";
import ButtonDelete from "@/components/ButtonDelete";
import ButtonCopy from "./ButtonCopy";

export default function UpdateQuestionForm({
  question,
  quizId,
}: {
  question: Question;
  quizId: number;
}) {
  const [updateFormState, updateFormAction] = useFormState(updateQuestion, {});
  const updateFormId = `update-question-${question.id}`;
  const [deleteFormState, deleteFormAction] = useFormState(deleteQuestion, {});
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <>
      <QuestionFields
        quizId={quizId}
        defaultValues={question}
        formId={updateFormId}
      />
      {updateFormState.message && updateFormState.type && (
        <Message type={updateFormState.type} className="mb-4">
          {updateFormState.message}
        </Message>
      )}
      {deleteFormState.message && deleteFormState.type && (
        <Message type={deleteFormState.type} className="mb-4">
          {deleteFormState.message}
        </Message>
      )}
      <div className="flex gap-2">
        <form action={updateFormAction} className="inline" id={updateFormId}>
          <ButtonSubmit color="yellow">تعديل</ButtonSubmit>
        </form>
        <form action={deleteFormAction} className="inline" ref={formRef}>
          <input
            type="number"
            name="question-id"
            id="question-id"
            className="hidden"
            defaultValue={question.id}
          />
          <ButtonDelete
            confirmationText={question.id.toString()}
            formRef={formRef}
          />
        </form>
        <ButtonCopy
          text={JSON.stringify([
            {
              image: question.image || undefined,
              explanation: question.explanation || undefined,
              text: question.text,
              options: question.options,
              correctOptionIndex: question.correctOptionIndex,
            },
          ])}
        />
      </div>
    </>
  );
}
