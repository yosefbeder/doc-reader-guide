"use client";

import { useActionState } from "react";

import ButtonSubmit from "@/components/ButtonSubmit";
import LectureFields from "./LectureFields";
import { addLecture } from "@/lib/actions/lectures";
import Message from "@/components/Message";
import { useAddForm } from "@/lib/hooks";

export default function AddLectureForm({ subjectId }: { subjectId: number }) {
  const [formState, formAction] = useActionState(addLecture, {});
  const { hideMessage, setHideMessage, formKey } = useAddForm(formState);

  return (
    <form
      action={formAction}
      className="col"
      onClickCapture={() => setHideMessage(true)}
    >
      <LectureFields key={formKey} subjectId={subjectId} />
      {formState.message && formState.type && !hideMessage && (
        <Message type={formState.type}>{formState.message}</Message>
      )}
      <ButtonSubmit className="self-start">Add</ButtonSubmit>
    </form>
  );
}
