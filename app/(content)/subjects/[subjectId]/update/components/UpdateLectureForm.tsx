"use client";

import { useFormState } from "react-dom";
import { useRef } from "react";

import ButtonSubmit from "@/components/ButtonSubmit";
import LectureFields from "./LectureFields";
import { Lecture } from "@/types";
import { deleteLecture, updateLecture } from "@/lib/actions/lectures";
import Message from "@/components/Message";
import ButtonDelete from "@/components/ButtonDelete";
import { useUpdateDeleteForms } from "@/lib/hooks";

export default function UpdateLectureForm({
  subjectId,
  lecture,
}: {
  subjectId: number;
  lecture: Lecture;
}) {
  const [updateFormState, updateFormAction] = useFormState(updateLecture, {});
  const updateFormId = `update-lecture-${lecture.id}`;
  const [deleteFormState, deleteFormAction] = useFormState(deleteLecture, {});
  const formRef = useRef<HTMLFormElement>(null);
  const { hideMessage, setHideMessage } = useUpdateDeleteForms(
    updateFormState,
    deleteFormState
  );

  return (
    <div onClickCapture={() => setHideMessage(true)}>
      <LectureFields
        subjectId={subjectId}
        defaultValues={lecture}
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
            name="lecture-id"
            id="lecture-id"
            className="hidden"
            defaultValue={lecture.id}
          />
          <ButtonDelete
            confirmationText={lecture.id.toString()}
            formRef={formRef}
          />
        </form>
      </div>
    </div>
  );
}
