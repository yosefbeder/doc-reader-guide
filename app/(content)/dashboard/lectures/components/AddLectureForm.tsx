"use client";

import { useFormState } from "react-dom";

import ButtonSubmit from "@/components/ButtonSubmit";
import LectureFields from "./LectureFields";
import { addLecture } from "@/lib/actions";
import Message from "@/components/Message";
import { Lecture } from "@/types";

export default function AddLectureForm({ lectures }: { lectures: Lecture[] }) {
  const [formState, formAction] = useFormState(addLecture, {});

  return (
    <form action={formAction} className="max-w-lg mb-4">
      <LectureFields lectures={lectures} />
      {formState.message && formState.type && (
        <Message type={formState.type} className="mb-4">
          {formState.message}
        </Message>
      )}
      <ButtonSubmit>إضافة</ButtonSubmit>
    </form>
  );
}
