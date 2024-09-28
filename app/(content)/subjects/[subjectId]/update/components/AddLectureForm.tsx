"use client";

import { useFormState } from "react-dom";

import ButtonSubmit from "@/components/ButtonSubmit";
import LectureFields from "./LectureFields";
import { addLecture } from "@/lib/actions";
import Message from "@/components/Message";

export default function AddLectureForm({ subjectId }: { subjectId: number }) {
  const [formState, formAction] = useFormState(addLecture, {});

  return (
    <form action={formAction} className="max-w-lg mb-4">
      <LectureFields subjectId={subjectId} />
      {formState.message && formState.type && (
        <Message type={formState.type} className="mb-4">
          {formState.message}
        </Message>
      )}
      <ButtonSubmit>إضافة</ButtonSubmit>
    </form>
  );
}
