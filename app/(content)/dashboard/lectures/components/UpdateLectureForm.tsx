"use client";

import { useFormState } from "react-dom";

import ButtonSubmit from "@/components/ButtonSubmit";
import LectureFields from "./LectureFields";
import { Lecture } from "@/types";
import { updateLecture } from "@/lib/actions";
import Message from "@/components/Message";

export default function UpdateLectureForm({
  lecture: { id, title, subjectId, date },
}: {
  lecture: Lecture;
}) {
  const [formState, formAction] = useFormState(updateLecture, {});

  return (
    <form action={formAction} className="max-w-lg">
      <LectureFields defaultValues={{ id, title, subjectId, date }} />
      {formState.message && formState.type && (
        <Message type={formState.type} className="mb-4">
          {formState.message}
        </Message>
      )}
      <ButtonSubmit>تعديل</ButtonSubmit>
    </form>
  );
}
