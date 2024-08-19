"use client";

import { useFormState } from "react-dom";

import LinkFields, { LinkPlace } from "./LinkFields";
import { updateLink } from "@/lib/actions";
import Message from "@/components/Message";
import ButtonSubmit from "@/components/ButtonSubmit";

export default function UpdateLinkForm({
  place,
  id,
  selectOptions,
  link: { id: linkId, title, subTitle, url, type, category },
}: {
  place: LinkPlace;
  id: number;
  selectOptions: any[];
  link: any;
}) {
  const [formState, formAction] = useFormState(updateLink, {});

  return (
    <form action={formAction} className="max-w-lg">
      <LinkFields
        place={place}
        selectOptions={selectOptions}
        defaultValues={{ linkId, title, subTitle, url, type, category, id }}
      />
      {formState.message && formState.type && (
        <Message type={formState.type} className="mb-4">
          {formState.message}
        </Message>
      )}
      <ButtonSubmit>تعديل</ButtonSubmit>
    </form>
  );
}
