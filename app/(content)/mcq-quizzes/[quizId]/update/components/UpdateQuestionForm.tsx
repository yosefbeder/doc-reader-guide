"use client";

import { useRef } from "react";
import { useFormState } from "react-dom";

import QuestionFields from "./QuestionFields";
import { deleteQuestion, updateQuestion } from "@/lib/actions/mcqQuizzes";
import Message from "@/components/Message";
import ButtonSubmit from "@/components/ButtonSubmit";
import { McqQuestion, User } from "@/types";
import ButtonDelete from "@/components/ButtonDelete";
import { useUpdateDeleteForms } from "@/lib/hooks";
import notUpdateable from "@/utils/isUpdateable";

export default function UpdateQuestionForm({
  user,
  question,
  quizId,
}: {
  user: User;
  question: McqQuestion;
  quizId: number;
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

  return (
    <div className="layer-1-form" onClickCapture={() => setHideMessage(true)}>
      <QuestionFields
        quizId={quizId}
        defaultValues={question}
        formId={updateFormId}
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
        <form action={updateFormAction} id={updateFormId}>
          <ButtonSubmit disabled={disabled} color="yellow">
            Update
          </ButtonSubmit>
        </form>
        <form action={deleteFormAction} ref={formRef}>
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
