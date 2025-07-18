"use client";

import { useFormState } from "react-dom";

import ButtonSubmit from "@/components/ButtonSubmit";
import PracticalQuizFields from "./PracticalQuizFields";
import { addPracticalQuiz } from "@/lib/actions";
import Message from "@/components/Message";
import { useAddForm } from "@/lib/hooks";

export default function AddPracticalQuizForm({
  lectureId,
}: {
  lectureId: number;
}) {
  const [formState, formAction] = useFormState(addPracticalQuiz, {});
  const { hideMessage, setHideMessage, formKey } = useAddForm(formState);

  return (
    <form
      action={formAction}
      className="max-w-lg"
      onClickCapture={() => setHideMessage(true)}
    >
      <PracticalQuizFields key={formKey} lectureId={lectureId} />
      {formState.message && formState.type && !hideMessage && (
        <Message type={formState.type} className="mb-4">
          {formState.message}
        </Message>
      )}
      <ButtonSubmit>Add</ButtonSubmit>
    </form>
  );
}
