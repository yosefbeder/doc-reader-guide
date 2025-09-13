"use client";

import { useRef } from "react";
import { useFormState } from "react-dom";

import LinkFields from "./LinkFields";
import { deleteLink, updateLink } from "@/lib/actions/links";
import Message from "@/components/Message";
import ButtonSubmit from "@/components/ButtonSubmit";
import { Link } from "@/types";
import ButtonDelete from "@/components/ButtonDelete";
import { useUpdateDeleteForms } from "@/lib/hooks";
import ButtonIcon from "@/components/ButtonIcon";

export default function UpdateLinkForm({
  link,
  lectureId,
  onClose,
  yearId,
}: {
  link: Link;
  lectureId: number;
  onClose: () => void;
  yearId: number;
}) {
  const [updateFormState, updateFormAction] = useFormState(updateLink, {});
  const updateFormId = `update-link-${link.id}`;
  const [deleteFormState, deleteFormAction] = useFormState(deleteLink, {});
  const formRef = useRef<HTMLFormElement>(null);
  const { hideMessage, setHideMessage } = useUpdateDeleteForms(
    updateFormState,
    deleteFormState
  );

  return (
    <div className="floating col" onClickCapture={() => setHideMessage(true)}>
      <div className="flex justify-between items-center">
        <h3>Update Link</h3>
        <ButtonIcon icon="x-mark" onClick={onClose} />
      </div>
      <LinkFields
        lectureId={lectureId}
        defaultValues={link}
        formId={updateFormId}
        yearId={yearId}
      />
      {updateFormState.message && updateFormState.type && !hideMessage && (
        <Message type={updateFormState.type}>{updateFormState.message}</Message>
      )}
      {deleteFormState.message && deleteFormState.type && !hideMessage && (
        <Message type={deleteFormState.type}>{deleteFormState.message}</Message>
      )}
      <div className="flex gap-2">
        <form action={updateFormAction} id={updateFormId}>
          <ButtonSubmit color="yellow">Update</ButtonSubmit>
        </form>
        <form action={deleteFormAction} ref={formRef}>
          <input
            type="number"
            name="link-id"
            id="link-id"
            className="hidden"
            defaultValue={link.id}
          />
          <ButtonDelete
            confirmationText={link.id.toString()}
            formRef={formRef}
          />
        </form>
      </div>
    </div>
  );
}
