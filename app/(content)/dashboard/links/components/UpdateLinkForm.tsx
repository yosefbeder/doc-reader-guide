"use client";

import { useFormState } from "react-dom";

import LinkFields from "./LinkFields";
import { updateLink } from "@/lib/actions";
import Message from "@/components/Message";
import ButtonSubmit from "@/components/ButtonSubmit";
import { Link, Lecture } from "@/types";

export default function UpdateLinkForm({
  link,
  lectures,
}: {
  link: Link;
  lectures: Lecture[];
}) {
  const [formState, formAction] = useFormState(updateLink, {});

  return (
    <form action={formAction} className="max-w-lg">
      <LinkFields lectures={lectures} defaultValues={link} />
      {formState.message && formState.type && (
        <Message type={formState.type} className="mb-4">
          {formState.message}
        </Message>
      )}
      <ButtonSubmit>تعديل</ButtonSubmit>
    </form>
  );
}
