"use client";

import { useFormState } from "react-dom";

import ButtonSubmit from "@/components/ButtonSubmit";
import LinkFields, { ModifiedLecture } from "./LinkFields";
import { addLink } from "@/lib/actions";
import Message from "@/components/Message";

export default function AddLinkForm({
  lectures,
}: {
  lectures: ModifiedLecture[];
}) {
  const [formState, formAction] = useFormState(addLink, {});

  return (
    <form action={formAction} className="max-w-lg mb-4">
      <LinkFields lectures={lectures} />
      {formState.message && formState.type && (
        <Message type={formState.type} className="mb-4">
          {formState.message}
        </Message>
      )}
      <ButtonSubmit>إضافة</ButtonSubmit>
    </form>
  );
}
