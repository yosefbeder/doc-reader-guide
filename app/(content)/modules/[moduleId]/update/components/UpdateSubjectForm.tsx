"use client";

import { useRef } from "react";
import { useFormState } from "react-dom";

import ButtonSubmit from "@/components/ButtonSubmit";
import SubjectFields from "./SubjectFields";
import { Subject } from "@/types";
import { deleteSubject, updateSubject } from "@/lib/actions";
import Message from "@/components/Message";
import ButtonDelete from "@/components/ButtonDelete";

export default function UpdateSubjectForm({
  subject: {
    id,
    icon,
    name,
    module: { id: moduleId },
  },
}: {
  subject: Subject;
}) {
  const [updateFormsState, updateFormAction] = useFormState(updateSubject, {});
  const updateFormId = `update-subject-${id}`;
  const [deleteFormState, deleteFormAction] = useFormState(deleteSubject, {});
  const formRef = useRef(null);

  return (
    <>
      <SubjectFields
        moduleId={moduleId}
        defaultValues={{ id, icon, name, moduleId }}
        formId={updateFormId}
      />
      {updateFormsState.message && updateFormsState.type && (
        <Message type={updateFormsState.type} className="mb-4">
          {updateFormsState.message}
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
            name="subject-id"
            id="subject-id"
            className="hidden"
            defaultValue={id}
          />
          <ButtonDelete confirmationText={id.toString()} formRef={formRef} />
        </form>
      </div>
    </>
  );
}
