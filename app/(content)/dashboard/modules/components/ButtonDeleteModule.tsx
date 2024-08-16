"use client";

import { useEffect } from "react";
import { useFormState } from "react-dom";

import ButtonSubmit from "@/components/ButtonSubmit";
import { deleteModule } from "@/lib/actions";

export default function ButtonDeleteModule({
  yearId,
  moduleId,
}: {
  yearId: number;
  moduleId: number;
}) {
  const [formState, formAction] = useFormState(deleteModule, {});

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
        name="module-id"
        id="module-id"
        className="hidden"
        defaultValue={moduleId}
      />
      <ButtonSubmit color="rose">حذف</ButtonSubmit>
    </form>
  );
}
