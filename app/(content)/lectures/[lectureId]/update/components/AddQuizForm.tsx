"use client";

import { useFormState } from "react-dom";

import ButtonSubmit from "@/components/ButtonSubmit";
import QuizFields from "./QuizFields";
import { addQuiz as addMcqQuiz } from "@/lib/actions/mcqQuizzes";
import { addQuiz as addWrittenQuiz } from "@/lib/actions/writtenQuizzes";
import Message from "@/components/Message";
import { useAddForm } from "@/lib/hooks";
import { QuizType } from "@/types";

export default function AddQuizForm({
  type,
  lectureId,
  yearId,
}: {
  type: QuizType;
  lectureId: number;
  yearId: number;
}) {
  const [formState, formAction] = useFormState(
    type === "mcq" ? addMcqQuiz : addWrittenQuiz,
    {}
  );
  const { hideMessage, setHideMessage, formKey } = useAddForm(formState);

  return (
    <form
      action={formAction}
      className="col"
      onClickCapture={() => setHideMessage(true)}
    >
      <QuizFields
        type={type}
        key={formKey}
        lectureId={lectureId}
        yearId={yearId}
      />
      {formState.message && formState.type && !hideMessage && (
        <Message type={formState.type}>{formState.message}</Message>
      )}
      <ButtonSubmit className="self-start">Add</ButtonSubmit>
    </form>
  );
}
