"use client";

import { useEffect } from "react";
import { useFormState } from "react-dom";

import ButtonSubmit from "@/components/ButtonSubmit";
import { deleteLink } from "@/lib/actions";
import { LinkPlace } from "./LinkFields";

export default function ButtonDeleteLink({
  linkId,
  place,
  id,
}: {
  linkId: number;
  place: LinkPlace;
  id: number;
}) {
  const [formState, formAction] = useFormState(deleteLink, {});

  useEffect(() => {
    if (formState.message) alert(formState.message);
  }, [formState]);

  return (
    <form action={formAction} className="inline">
      <input
        type="number"
        name="link-id"
        id="link-id"
        className="hidden"
        defaultValue={linkId}
      />
      <input
        type="number"
        name="id"
        id="id"
        className="hidden"
        defaultValue={id}
      />
      <input
        type="text"
        name="place"
        id="place"
        className="hidden"
        defaultValue={place}
      />
      <ButtonSubmit color="rose">حذف</ButtonSubmit>
    </form>
  );
}
