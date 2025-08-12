"use client";

import { useFormState } from "react-dom";

import ButtonSubmit from "@/components/ButtonSubmit";
import WrittenQuizFields from "./WrittenQuizFields";
import { addQuiz } from "@/lib/actions/writtenQuizzes";
import Message from "@/components/Message";
import { useAddForm } from "@/lib/hooks";

export default function AddWrittenQuizForm({
  lectureId,
}: {
  lectureId: number;
}) {
  const [formState, formAction] = useFormState(addQuiz, {});
  const { hideMessage, setHideMessage, formKey } = useAddForm(formState);

  return (
    <form
      className="floating"
      action={formAction}
      onClickCapture={() => setHideMessage(true)}
    >
      <WrittenQuizFields key={formKey} lectureId={lectureId} />
      {formState.message && formState.type && !hideMessage && (
        <Message type={formState.type} className="mb-4">
          {formState.message}
        </Message>
      )}
      <ButtonSubmit>Add</ButtonSubmit>
    </form>
  );
}
