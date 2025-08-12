"use client";

import { useRef } from "react";
import { useFormState } from "react-dom";

import WrittenQuizFields from "./WrittenQuizFields";
import { deleteQuiz, updateQuiz } from "@/lib/actions/writtenQuizzes";
import Message from "@/components/Message";
import ButtonSubmit from "@/components/ButtonSubmit";
import { WrittenQuiz } from "@/types";
import ButtonDelete from "@/components/ButtonDelete";
import { useUpdateDeleteForms } from "@/lib/hooks";
import ButtonIcon from "@/components/ButtonIcon";

export default function UpdateWrittenQuizForm({
  quiz,
  lectureId,
  onClose,
}: {
  quiz: WrittenQuiz;
  lectureId: number;
  onClose: () => void;
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
    <div className="floating" onClickCapture={() => setHideMessage(true)}>
      <div className="flex justify-between items-center mb-4">
        <h3>Update Link</h3>
        <ButtonIcon icon="x-mark" onClick={onClose} />
      </div>
      <WrittenQuizFields
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
