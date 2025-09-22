"use client";

import React, { useEffect, useRef } from "react";
import { useFormState } from "react-dom";

import ButtonDelete from "@/components/ButtonDelete";
import ButtonSubmit from "@/components/ButtonSubmit";
import Message from "@/components/Message";
import { User, WrittenQuestion } from "@/types";
import QuestionFields from "./QuestionFields";
import { useUpdateDeleteForms } from "@/lib/hooks";
import { updateQuestion, deleteQuestion } from "@/lib/actions/writtenQuizzes";
import notUpdateable from "@/utils/isUpdateable";
import cleanWrittenQuestion from "@/utils/cleanWrittenQuestion";

export default function UpdateQuestionForm({
  user,
  quizId,
  question,
}: {
  user: User;
  quizId: number;
  question: WrittenQuestion;
}) {
  const [updateFormState, updateFormAction] = useFormState(updateQuestion, {});
  const updateFormId = `update-question-${question.id}`;
  const [deleteFormState, deleteFormAction] = useFormState(deleteQuestion, {});
  const formRef = useRef<HTMLFormElement>(null);
  const { hideMessage, setHideMessage } = useUpdateDeleteForms(
    updateFormState,
    deleteFormState
  );
  const disabled = notUpdateable(user, question.creatorId);

  useEffect(() => {
    if (updateFormState.type === "success") {
      location.reload();
    }
  }, [updateFormState]);

  return (
    <div className="layer-1-form" onClickCapture={() => setHideMessage(true)}>
      <QuestionFields
        quizId={quizId}
        formId={updateFormId}
        init={{
          id: question.id,
          imageUrl: question.image
            ? `${process.env.NEXT_PUBLIC_STATIC_URL}/image/${question.image}`
            : undefined,
          state: {
            tapes: question.tapes.map(
              ({
                createdAt,
                updatedAt,
                tapeQuestionId,
                maskQuestionId,
                ...rest
              }) => ({
                ...rest,
              })
            ),
            masks: question.masks.map(
              ({
                createdAt,
                updatedAt,
                tapeQuestionId,
                maskQuestionId,
                ...rest
              }) => ({
                ...rest,
              })
            ),
          },
          subQuestions: question.subQuestions.map(
            ({ createdAt, updatedAt, ...rest }) => ({ ...rest })
          ),
        }}
      />
      {updateFormState.message && updateFormState.type && !hideMessage && (
        <Message type={updateFormState.type} className="mb-4">
          {updateFormState.message}
        </Message>
      )}
      {deleteFormState.message && deleteFormState.type && !hideMessage && (
        <Message type={deleteFormState.type} className="mb-4">
          {deleteFormState.message}
        </Message>
      )}
      <div className="flex gap-2">
        <form action={updateFormAction} className="inline" id={updateFormId}>
          <ButtonSubmit disabled={disabled} color="yellow">
            Update
          </ButtonSubmit>
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
            disabled={disabled}
            confirmationText={question.id.toString()}
            formRef={formRef}
          />
        </form>
      </div>
    </div>
  );
}
