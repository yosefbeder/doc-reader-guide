import React, { useRef } from "react";
import { useFormState } from "react-dom";

import ButtonDelete from "@/components/ButtonDelete";
import ButtonSubmit from "@/components/ButtonSubmit";
import Message from "@/components/Message";
import { PracticalQuestion } from "@/types";
import QuestionFields from "./QuestionFields";
import { useUpdateDeleteForms } from "@/lib/hooks";
import {
  updatePracticalQuestion,
  deletePracticalQuestion,
} from "@/lib/actions";

export default function UpdateQuestionForm({
  quizId,
  question,
}: {
  quizId: number;
  question: PracticalQuestion;
}) {
  const [updateFormState, updateFormAction] = useFormState(
    updatePracticalQuestion,
    {}
  );
  const updateFormId = `update-question-${question.id}`;
  const [deleteFormState, deleteFormAction] = useFormState(
    deletePracticalQuestion,
    {}
  );
  const formRef = useRef<HTMLFormElement>(null);
  const { hideMessage, setHideMessage } = useUpdateDeleteForms(
    updateFormState,
    deleteFormState
  );

  return (
    <div
      className="superficial p-2 rounded-xl bg-white"
      onClickCapture={() => setHideMessage(true)}
    >
      <QuestionFields
        quizId={quizId}
        formId={updateFormId}
        init={{
          id: question.id,
          imageUrl: `${process.env.NEXT_PUBLIC_STATIC_URL}/image/${question.image}`,
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
          writtenQuestions: question.writtenQuestions.map(
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
          <ButtonSubmit color="yellow">Update</ButtonSubmit>
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
      </div>
    </div>
  );
}
