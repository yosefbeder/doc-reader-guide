"use client";

import { useFormState } from "react-dom";

import ButtonSubmit from "@/components/ButtonSubmit";
import LectureFields from "./LectureFields";
import { Lecture } from "@/types";
import { deleteLecture, updateLecture } from "@/lib/actions";
import Message from "@/components/Message";
import { useRef } from "react";
import ButtonDelete from "@/components/ButtonDelete";
import { useUpdateForm } from "@/lib/hooks";

export default function UpdateLectureForm({
  subjectId,
  lecture,
}: {
  subjectId: number;
  lecture: Lecture;
}) {
  const [updateFormState, updateFormAction] = useFormState(updateLecture, {});
  const updateFormId = `update-lecture-${lecture.id}`;
  const [_, deleteFormAction] = useFormState(deleteLecture, {});
  const formRef = useRef<HTMLFormElement>(null);
  const { hideMessage, setHideMessage } = useUpdateForm(updateFormState);

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
