"use client";

import { useEffect, useRef } from "react";
import { useFormState } from "react-dom";

import ButtonSubmit from "@/components/ButtonSubmit";
import { deleteSubject } from "@/lib/actions";
import ButtonDelete from "@/components/ButtonDelete";

export default function ButtonDeleteSubject({
  subjectId,
}: {
  subjectId: number;
}) {
  const [formState, formAction] = useFormState(deleteSubject, {});
  const formRef = useRef(null);

  useEffect(() => {
    if (formState.message) alert(formState.message);
  }, [formState]);

  return (
    <form action={formAction} className="inline" ref={formRef}>
      <input
        type="number"
        name="subject-id"
        id="subject-id"
        className="hidden"
        defaultValue={subjectId}
      />
      <ButtonDelete confirmationText={subjectId.toString()} formRef={formRef} />
    </form>
  );
}
