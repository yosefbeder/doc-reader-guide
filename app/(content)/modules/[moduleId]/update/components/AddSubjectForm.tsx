"use client";

import { useFormState } from "react-dom";

import ButtonSubmit from "@/components/ButtonSubmit";
import SubjectFields from "./SubjectFields";
import { addSubject } from "@/lib/actions/subjects";
import Message from "@/components/Message";
import { useAddForm } from "@/lib/hooks";

export default function AddSubjectForm({ moduleId }: { moduleId: number }) {
  const [formState, formAction] = useFormState(addSubject, {});
  const { hideMessage, setHideMessage, formKey } = useAddForm(formState);

  return (
    <form
      action={formAction}
      className="col"
      onClickCapture={() => setHideMessage(true)}
    >
      <SubjectFields key={formKey} moduleId={moduleId} />
      {formState.message && formState.type && !hideMessage && (
        <Message type={formState.type}>{formState.message}</Message>
      )}
      <ButtonSubmit className="self-start">Add</ButtonSubmit>
    </form>
  );
}
