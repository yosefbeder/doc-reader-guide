"use client";

import { useEffect, useRef } from "react";
import { useFormState } from "react-dom";

import { deleteModule } from "@/lib/actions";
import ButtonDelete from "@/components/ButtonDelete";

export default function ButtonDeleteModule({
  yearId,
  moduleId,
}: {
  yearId: number;
  moduleId: number;
}) {
  const [formState, formAction] = useFormState(deleteModule, {});
  const formRef = useRef(null);

  useEffect(() => {
    if (formState.message) alert(formState.message);
  }, [formState]);

  return (
    <form action={formAction} className="inline" ref={formRef}>
      <input
        type="number"
        name="year-id"
        id="year-id"
        className="hidden"
        defaultValue={yearId}
      />
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
