"use client";

import { useRef } from "react";
import { useFormState } from "react-dom";

import ButtonSubmit from "@/components/ButtonSubmit";
import SubjectFields from "./SubjectFields";
import { Subject } from "@/types";
import { deleteSubject, updateSubject } from "@/lib/actions/subjects";
import Message from "@/components/Message";
import ButtonDelete from "@/components/ButtonDelete";
import { useUpdateDeleteForms } from "@/lib/hooks";

export default function UpdateSubjectForm({
  subject: { id, icon, name, moduleId },
}: {
  subject: Subject;
}) {
  const [updateFormState, updateFormAction] = useFormState(updateSubject, {});
  const updateFormId = `update-subject-${id}`;
  const [deleteFormState, deleteFormAction] = useFormState(deleteSubject, {});
  const formRef = useRef(null);
  const { hideMessage, setHideMessage } = useUpdateDeleteForms(
    updateFormState,
    deleteFormState
  );

  return (
    <div onClickCapture={() => setHideMessage(true)}>
      <SubjectFields
        moduleId={moduleId}
        defaultValues={{ id, icon, name, moduleId }}
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
            name="subject-id"
            id="subject-id"
            className="hidden"
            defaultValue={id}
          />
          <ButtonDelete confirmationText={id.toString()} formRef={formRef} />
        </form>
      </div>
    </div>
  );
}
