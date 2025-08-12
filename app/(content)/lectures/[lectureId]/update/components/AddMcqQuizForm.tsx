"use client";

import { useFormState } from "react-dom";

import ButtonSubmit from "@/components/ButtonSubmit";
import McqQuizFields from "./McqQuizFields";
import { addQuiz } from "@/lib/actions/mcqQuizzes";
import Message from "@/components/Message";
import { useAddForm } from "@/lib/hooks";

export default function AddMcqQuizForm({ lectureId }: { lectureId: number }) {
  const [formState, formAction] = useFormState(addQuiz, {});
  const { hideMessage, setHideMessage, formKey } = useAddForm(formState);

  return (
    <form action={formAction} onClickCapture={() => setHideMessage(true)}>
      <McqQuizFields key={formKey} lectureId={lectureId} />
      {formState.message && formState.type && !hideMessage && (
        <Message type={formState.type} className="mb-4">
          {formState.message}
        </Message>
      )}
      <ButtonSubmit>Add</ButtonSubmit>
    </form>
  );
}
