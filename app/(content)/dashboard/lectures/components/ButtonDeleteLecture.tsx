"use client";

import { useEffect, useRef } from "react";
import { useFormState } from "react-dom";

import { deleteLecture } from "@/lib/actions";
import ButtonDelete from "@/components/ButtonDelete";

export default function ButtonDeleteLecture({
  lectureId,
  subjectId,
}: {
  lectureId: number;
  subjectId: number;
}) {
  const [formState, formAction] = useFormState(deleteLecture, {});
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (formState.message) alert(formState.message);
  }, [formState]);

  return (
    <form action={formAction} className="inline" ref={formRef}>
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
      <ButtonDelete confirmationText={lectureId.toString()} formRef={formRef} />
    </form>
  );
}
