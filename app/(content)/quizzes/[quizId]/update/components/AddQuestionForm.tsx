"use client";

import { useFormState } from "react-dom";
import { useEffect, useState } from "react";

import ButtonSubmit from "@/components/ButtonSubmit";
import QuestionFields from "./QuestionFields";
import { addQuestion } from "@/lib/actions";
import Message from "@/components/Message";

export default function AddQuestionForm({ quizId }: { quizId: number }) {
  const [formState, formAction] = useFormState(addQuestion, {});
  const [forms, setForms] = useState([null]);

  useEffect(() => {
    if (formState.resetKey) setForms((prev) => [...prev, null]);
  }, [formState.resetKey]);

  return (
    <form action={formAction} className="max-w-lg mb-4">
      {forms.map((_, index) =>
        index === forms.length - 1 ? (
          <QuestionFields key={index} quizId={quizId} />
        ) : undefined
      )}
      {formState.message && formState.type && (
        <Message type={formState.type} className="mb-4">
          {formState.message}
        </Message>
      )}
      <ButtonSubmit>Add</ButtonSubmit>
    </form>
  );
}
