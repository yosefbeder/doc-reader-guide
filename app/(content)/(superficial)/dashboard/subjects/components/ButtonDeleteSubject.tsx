"use client";

import { useEffect } from "react";
import { useFormState } from "react-dom";

import ButtonSubmit from "@/components/ButtonSubmit";
import { deleteSubject } from "@/lib/actions";

export default function ButtonDeleteSubject({
  yearId,
  subjectId,
}: {
  yearId: number;
  subjectId: number;
}) {
  const [formState, formAction] = useFormState(deleteSubject, {});

  useEffect(() => {
    if (formState.message) alert(formState.message);
  }, [formState]);

  return (
    <form action={formAction} className="inline">
      <input
        type="number"
        name="year-id"
        id="year-id"
        className="hidden"
        defaultValue={yearId}
      />
      <input
        type="number"
        name="subject-id"
        id="subject-id"
        className="hidden"
        defaultValue={subjectId}
      />
      <ButtonSubmit color="rose">حذف</ButtonSubmit>
    </form>
  );
}
