"use client";

import { useFormState } from "react-dom";

import ButtonSubmit from "@/components/ButtonSubmit";
import SubjectFields from "./SubjectFields";
import { addSubject } from "@/lib/actions";
import Message from "@/components/Message";

export default function AddSubjectForm({ yearId }: { yearId: number }) {
  const [formState, formAction] = useFormState(addSubject, {});

  return (
    <form action={formAction} className="max-w-lg mb-4">
      <SubjectFields yearId={yearId} />
      {formState.message && formState.type && (
        <Message type={formState.type} className="mb-4">
          {formState.message}
        </Message>
      )}
      <ButtonSubmit>إضافة</ButtonSubmit>
    </form>
  );
}
