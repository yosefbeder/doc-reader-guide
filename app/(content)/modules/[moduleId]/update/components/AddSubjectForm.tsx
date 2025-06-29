"use client";

import { useFormState } from "react-dom";

import ButtonSubmit from "@/components/ButtonSubmit";
import SubjectFields from "./SubjectFields";
import { addSubject } from "@/lib/actions";
import Message from "@/components/Message";

export default function AddSubjectForm({ moduleId }: { moduleId: number }) {
  const [formState, formAction] = useFormState(addSubject, {});

  return (
    <form action={formAction}>
      <SubjectFields moduleId={moduleId} />
      {formState.message && formState.type && (
        <Message type={formState.type} className="mb-4">
          {formState.message}
        </Message>
      )}
      <ButtonSubmit>Add</ButtonSubmit>
    </form>
  );
}
