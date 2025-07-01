"use client";

import { useFormState } from "react-dom";

import ButtonSubmit from "@/components/ButtonSubmit";
import QuizFields from "./QuizFields";
import { addQuiz } from "@/lib/actions";
import Message from "@/components/Message";
import { useAddForm } from "@/lib/hooks";

export default function AddQuizForm({ lectureId }: { lectureId: number }) {
  const [formState, formAction] = useFormState(addQuiz, {});
  const { hideMessage, setHideMessage, formKey } = useAddForm(formState);

  return (
    <form
      action={formAction}
      className="max-w-lg mb-4"
      onClickCapture={() => setHideMessage(true)}
    >
      <QuizFields key={formKey} lectureId={lectureId} />
      {formState.message && formState.type && !hideMessage && (
        <Message type={formState.type} className="mb-4">
          {formState.message}
        </Message>
      )}
      <ButtonSubmit>Add</ButtonSubmit>
    </form>
  );
}
