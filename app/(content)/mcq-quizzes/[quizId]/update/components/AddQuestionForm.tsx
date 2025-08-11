"use client";

import { useFormState } from "react-dom";

import ButtonSubmit from "@/components/ButtonSubmit";
import QuestionFields from "./QuestionFields";
import { addQuestion } from "@/lib/actions/mcqQuizzes";
import Message from "@/components/Message";
import { useAddForm } from "@/lib/hooks";

export default function AddQuestionForm({ quizId }: { quizId: number }) {
  const [formState, formAction] = useFormState(addQuestion, {});
  const { hideMessage, setHideMessage, formKey } = useAddForm(formState);

  return (
    <form
      action={formAction}
      className="max-w-lg"
      onClickCapture={() => setHideMessage(true)}
    >
      <QuestionFields key={formKey} quizId={quizId} />
      {formState.message && formState.type && !hideMessage && (
        <Message type={formState.type} className="mb-4">
          {formState.message}
        </Message>
      )}
      <ButtonSubmit>Add</ButtonSubmit>
    </form>
  );
}
