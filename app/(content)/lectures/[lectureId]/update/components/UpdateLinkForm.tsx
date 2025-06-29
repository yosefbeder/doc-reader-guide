"use client";

import { useRef } from "react";
import { useFormState } from "react-dom";

import LinkFields from "./LinkFields";
import { deleteLink, updateLink } from "@/lib/actions";
import Message from "@/components/Message";
import ButtonSubmit from "@/components/ButtonSubmit";
import { Link } from "@/types";
import ButtonDelete from "@/components/ButtonDelete";

export default function UpdateLinkForm({
  link,
  lectureId,
}: {
  link: Link;
  lectureId: number;
}) {
  const [updateFormState, updateFormAction] = useFormState(updateLink, {});
  const updateFormId = `update-link-${link.id}`;
  const [deleteFormState, deleteFormAction] = useFormState(deleteLink, {});
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <>
      <LinkFields
        lectureId={lectureId}
        defaultValues={link}
        formId={updateFormId}
      />
      {updateFormState.message && updateFormState.type && (
        <Message type={updateFormState.type} className="mb-4">
          {updateFormState.message}
        </Message>
      )}
      {deleteFormState.message && deleteFormState.type && (
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
    </>
  );
}
