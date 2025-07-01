"use client";

import { useFormState } from "react-dom";
import { useRef } from "react";

import ModuleFields from "./ModuleFields";
import { Module } from "@/types";
import { deleteModule, updateModule } from "@/lib/actions";
import Message from "@/components/Message";
import ButtonDelete from "@/components/ButtonDelete";
import ButtonSubmit from "@/components/ButtonSubmit";
import { useUpdateForm } from "@/lib/hooks";

export default function UpdateModuleForm({
  myModule: { id, icon, name, semesterName, yearId },
}: {
  myModule: Module;
}) {
  const [updateFormState, updateFormAction] = useFormState(updateModule, {});
  const updateFormId = `update-module-${id}`;
  const [_, deleteFormAction] = useFormState(deleteModule, {});
  const deleteFormRef = useRef(null);
  const { hideMessage, setHideMessage } = useUpdateForm(updateFormState);

  return (
    <div onClickCapture={() => setHideMessage(true)}>
      <ModuleFields
        yearId={yearId}
        defaultValues={{ id, icon, name, semesterName }}
        formId={updateFormId}
      />
      {updateFormState.message && updateFormState.type && !hideMessage && (
        <Message type={updateFormState.type} className="mb-4">
          {updateFormState.message}
        </Message>
      )}
      <div className="flex gap-2">
        <form action={updateFormAction} id={updateFormId}>
          <ButtonSubmit type="submit" color="yellow">
            Update
          </ButtonSubmit>
        </form>
        <form action={deleteFormAction} className="inline" ref={deleteFormRef}>
          <input
            type="number"
            name="module-id"
            id="module-id"
            className="hidden"
            defaultValue={id}
          />
          <ButtonDelete
            confirmationText={id.toString()}
            formRef={deleteFormRef}
          />
        </form>
      </div>
    </div>
  );
}
