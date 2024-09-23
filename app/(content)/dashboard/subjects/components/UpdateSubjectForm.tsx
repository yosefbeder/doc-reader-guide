"use client";

import { useFormState } from "react-dom";

import ButtonSubmit from "@/components/ButtonSubmit";
import SubjectFields from "./SubjectFields";
import { Module, Subject } from "@/types";
import { updateSubject } from "@/lib/actions";
import Message from "@/components/Message";

export default function UpdateSubjectForm({
  modules,
  subject: { id, icon, name, moduleId },
}: {
  modules: Module[];
  subject: Subject;
}) {
  const [formState, formAction] = useFormState(updateSubject, {});

  return (
    <form action={formAction} className="max-w-lg">
      <SubjectFields
        modules={modules}
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
