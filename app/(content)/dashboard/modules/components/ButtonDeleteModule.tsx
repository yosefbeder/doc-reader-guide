"use client";

import { useEffect, useRef } from "react";
import { useFormState } from "react-dom";

import { deleteModule } from "@/lib/actions";
import ButtonDelete from "@/components/ButtonDelete";

export default function ButtonDeleteModule({ moduleId }: { moduleId: number }) {
  const [formState, formAction] = useFormState(deleteModule, {});
  const formRef = useRef(null);

  useEffect(() => {
    if (formState.message) alert(formState.message);
  }, [formState]);

  return (
    <form action={formAction} className="inline" ref={formRef}>
      <input
        type="number"
        name="module-id"
        id="module-id"
        className="hidden"
        defaultValue={moduleId}
      />
      <ButtonDelete confirmationText={moduleId.toString()} formRef={formRef} />
    </form>
  );
}
