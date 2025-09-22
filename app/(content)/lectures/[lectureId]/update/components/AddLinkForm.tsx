"use client";

import { useFormState } from "react-dom";

import ButtonSubmit from "@/components/ButtonSubmit";
import LinkFields from "./LinkFields";
import { addLink } from "@/lib/actions/links";
import Message from "@/components/Message";
import { useAddForm } from "@/lib/hooks";

export default function AddLinkForm({
  lectureId,
  yearId,
}: {
  lectureId: number;
  yearId: number;
}) {
  const [formState, formAction] = useFormState(addLink, {});
  const { hideMessage, setHideMessage, formKey } = useAddForm(formState);

  return (
    <form
      className="layer-1-form col"
      action={formAction}
      onClickCapture={() => setHideMessage(true)}
    >
      <LinkFields key={formKey} lectureId={lectureId} yearId={yearId} />
      {formState.message && formState.type && !hideMessage && (
        <Message type={formState.type}>{formState.message}</Message>
      )}
      <ButtonSubmit className="self-start">Add</ButtonSubmit>
    </form>
  );
}
