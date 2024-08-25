"use client";

import { useEffect, useRef } from "react";
import { useFormState } from "react-dom";

import ButtonSubmit from "@/components/ButtonSubmit";
import { deleteLink } from "@/lib/actions";
import ButtonDelete from "@/components/ButtonDelete";

export default function ButtonDeleteLink({ id }: { id: number }) {
  const [formState, formAction] = useFormState(deleteLink, {});
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (formState.message) alert(formState.message);
  }, [formState]);

  return (
    <form action={formAction} className="inline" ref={formRef}>
      <input
        type="number"
        name="link-id"
        id="link-id"
        className="hidden"
        defaultValue={id}
      />
      <ButtonDelete confirmationText={id.toString()} formRef={formRef} />
    </form>
  );
}
