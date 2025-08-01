"use client";

import { useFormState } from "react-dom";

import ButtonSubmit from "@/components/ButtonSubmit";
import LinkFields from "./LinkFields";
import { addLink } from "@/lib/actions";
import Message from "@/components/Message";
import { useAddForm } from "@/lib/hooks";

export default function AddLinkForm({ lectureId }: { lectureId: number }) {
  const [formState, formAction] = useFormState(addLink, {});
  const { hideMessage, setHideMessage, formKey } = useAddForm(formState);

  return (
    <form
      action={formAction}
      className="max-w-lg"
      onClickCapture={() => setHideMessage(true)}
    >
      <LinkFields key={formKey} lectureId={lectureId} />
      {formState.message && formState.type && !hideMessage && (
        <Message type={formState.type} className="mb-4">
          {formState.message}
        </Message>
      )}
      <ButtonSubmit>Add</ButtonSubmit>
    </form>
  );
}
