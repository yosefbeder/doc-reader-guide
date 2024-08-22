"use client";

import { useEffect } from "react";
import { useFormState } from "react-dom";

import ButtonSubmit from "@/components/ButtonSubmit";
import { deleteLink } from "@/lib/actions";

export default function ButtonDeleteLink({ id }: { id: number }) {
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
        defaultValue={id}
      />
      <ButtonSubmit color="rose">حذف</ButtonSubmit>
    </form>
  );
}
