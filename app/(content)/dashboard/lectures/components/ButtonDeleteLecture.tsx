"use client";

import { useEffect } from "react";
import { useFormState } from "react-dom";

import ButtonSubmit from "@/components/ButtonSubmit";
import { deleteLecture } from "@/lib/actions";

export default function ButtonDeleteLecture({
  lectureId,
  subjectId,
}: {
  lectureId: number;
  subjectId: number;
}) {
  const [formState, formAction] = useFormState(deleteLecture, {});

  useEffect(() => {
    if (formState.message) alert(formState.message);
  }, [formState]);

  return (
    <form action={formAction} className="inline">
      <input
        type="number"
        name="lecture-id"
        id="lecture-id"
        className="hidden"
        defaultValue={lectureId}
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
