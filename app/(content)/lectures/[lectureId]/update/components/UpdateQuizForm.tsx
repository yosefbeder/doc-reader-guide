"use client";

import { useRef } from "react";
import { useFormState } from "react-dom";

import QuizFields from "./QuizFields";
import { deleteQuiz, updateQuiz } from "@/lib/actions";
import Message from "@/components/Message";
import ButtonSubmit from "@/components/ButtonSubmit";
import { Quiz } from "@/types";
import ButtonDelete from "@/components/ButtonDelete";
import { useUpdateDeleteForms } from "@/lib/hooks";

export default function UpdateQuizForm({
  quiz,
  lectureId,
}: {
  quiz: Quiz;
  lectureId: number;
}) {
  const [updateFormState, updateFormAction] = useFormState(updateQuiz, {});
  const updateFormId = `update-quiz-${quiz.id}`;
  const [deleteFormState, deleteFormAction] = useFormState(deleteQuiz, {});
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
      <QuizFields
        lectureId={lectureId}
        defaultValues={quiz}
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
        <form action={updateFormAction} className="inline" id={updateFormId}>
          <ButtonSubmit color="yellow">Update</ButtonSubmit>
        </form>
        <form action={deleteFormAction} className="inline" ref={formRef}>
          <input
            type="number"
            name="quiz-id"
            id="quiz-id"
            className="hidden"
            defaultValue={quiz.id}
          />
          <ButtonDelete
            confirmationText={quiz.id.toString()}
            formRef={formRef}
          />
        </form>
      </div>
    </div>
  );
}
