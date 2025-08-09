"use client";

import { useFormState } from "react-dom";

import ButtonSubmit from "@/components/ButtonSubmit";
import LectureFields from "./LectureFields";
import { addLecture } from "@/lib/actions/lectures";
import Message from "@/components/Message";
import { useAddForm } from "@/lib/hooks";

export default function AddLectureForm({ subjectId }: { subjectId: number }) {
  const [formState, formAction] = useFormState(addLecture, {});
  const { hideMessage, setHideMessage, formKey } = useAddForm(formState);

  return (
    <form
      action={formAction}
      className="max-w-lg mb-4"
      onClickCapture={() => setHideMessage(true)}
    >
      <LectureFields key={formKey} subjectId={subjectId} />
      {formState.message && formState.type && !hideMessage && (
        <Message type={formState.type} className="mb-4">
          {formState.message}
        </Message>
      )}
      <ButtonSubmit>Add</ButtonSubmit>
    </form>
  );
}
