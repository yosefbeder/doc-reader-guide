"use client";

import { useFormState } from "react-dom";
import { useRef } from "react";

import ModuleFields from "./ModuleFields";
import { Module, User } from "@/types";
import { deleteModule, updateModule } from "@/lib/actions/modules";
import Message from "@/components/Message";
import ButtonDelete from "@/components/ButtonDelete";
import ButtonSubmit from "@/components/ButtonSubmit";
import { useUpdateDeleteForms } from "@/lib/hooks";
import notUpdateable from "@/utils/isUpdateable";

export default function UpdateModuleForm({
  user,
  myModule: { id, icon, name, semesterName, yearId, creatorId },
}: {
  user: User;
  myModule: Module;
}) {
  const [updateFormState, updateFormAction] = useFormState(updateModule, {});
  const updateFormId = `update-module-${id}`;
  const [deleteFormState, deleteFormAction] = useFormState(deleteModule, {});
  const deleteFormRef = useRef(null);
  const { hideMessage, setHideMessage } = useUpdateDeleteForms(
    updateFormState,
    deleteFormState
  );
  const disabled = notUpdateable(user, creatorId);

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
      {deleteFormState.message && deleteFormState.type && !hideMessage && (
        <Message type={deleteFormState.type} className="mb-4">
          {deleteFormState.message}
        </Message>
      )}
      <div className="flex gap-2">
        <form action={updateFormAction} id={updateFormId}>
          <ButtonSubmit type="submit" color="yellow" disabled={disabled}>
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
            disabled={disabled}
          />
        </form>
      </div>
    </div>
  );
}
