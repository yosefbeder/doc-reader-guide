"use client";

import { useFormState } from "react-dom";

import ButtonSubmit from "@/components/ButtonSubmit";
import QuizFields from "./QuizFields";
import { addQuiz } from "@/lib/actions";
import Message from "@/components/Message";

export default function AddQuizForm({ lectureId }: { lectureId: number }) {
  const [formState, formAction] = useFormState(addQuiz, {});

  return (
    <form action={formAction} className="max-w-lg mb-4">
      <QuizFields lectureId={lectureId} />
      {formState.message && formState.type && (
        <Message type={formState.type} className="mb-4">
          {formState.message}
        </Message>
      )}
      <ButtonSubmit>إضافة</ButtonSubmit>
    </form>
  );
}
