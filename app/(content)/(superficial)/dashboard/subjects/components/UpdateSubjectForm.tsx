"use client";

import { useFormState } from "react-dom";

import ButtonSubmit from "@/components/ButtonSubmit";
import SubjectFields from "./SubjectFields";
import { Subject } from "@/types";
import { updateSubject } from "@/lib/actions";
import Message from "@/components/Message";

export default function UpdateSubjectForm({
  yearId,
  subject: { id, icon, name, moduleId },
}: {
  yearId: number;
  subject: Subject;
}) {
  const [formState, formAction] = useFormState(updateSubject, {});

  return (
    <form action={formAction} className="max-w-lg">
      <SubjectFields
        yearId={yearId}
        defaultValues={{ id, icon, name, moduleId }}
      />
      {formState.message && formState.type && (
        <Message type={formState.type} className="mb-4">
          {formState.message}
        </Message>
      )}
      <ButtonSubmit>تعديل</ButtonSubmit>
    </form>
  );
}
