"use client";

import { useRef } from "react";
import { useFormState } from "react-dom";

import QuizFields from "./QuizFields";
import {
  deleteQuiz as deleteMcqQuiz,
  updateQuiz as updateMcqQuiz,
} from "@/lib/actions/mcqQuizzes";
import {
  deleteQuiz as deleteWrittenQuiz,
  updateQuiz as updateWrittenQuiz,
} from "@/lib/actions/writtenQuizzes";
import Message from "@/components/Message";
import ButtonSubmit from "@/components/ButtonSubmit";
import { Quiz, QuizType } from "@/types";
import ButtonDelete from "@/components/ButtonDelete";
import { useUpdateDeleteForms } from "@/lib/hooks";
import ButtonIcon from "@/components/ButtonIcon";

export default function UpdateQuizForm({
  type,
  quiz,
  lectureId,
  onClose,
  yearId,
}: {
  type: QuizType;
  quiz: Quiz;
  lectureId: number;
  onClose: () => void;
  yearId: number;
}) {
  const [updateFormState, updateFormAction] = useFormState(
    type === "mcq" ? updateMcqQuiz : updateWrittenQuiz,
    {}
  );
  const updateFormId = `update-${type}-quiz-${quiz.id}`;
  const [deleteFormState, deleteFormAction] = useFormState(
    type === "mcq" ? deleteMcqQuiz : deleteWrittenQuiz,
    {}
  );
  const formRef = useRef<HTMLFormElement>(null);
  const { hideMessage, setHideMessage } = useUpdateDeleteForms(
    updateFormState,
    deleteFormState
  );

  return (
    <div className="floating col" onClickCapture={() => setHideMessage(true)}>
      <div className="flex justify-between items-center">
        <h3>Update {type === "mcq" ? "MCQ" : "Written"} Quiz</h3>
        <ButtonIcon icon="x-mark" onClick={onClose} />
      </div>
      <QuizFields
        type={type}
        lectureId={lectureId}
        defaultValues={quiz}
        formId={updateFormId}
        yearId={yearId}
      />
      {updateFormState.message && updateFormState.type && !hideMessage && (
        <Message type={updateFormState.type}>{updateFormState.message}</Message>
      )}
      {deleteFormState.message && deleteFormState.type && !hideMessage && (
        <Message type={deleteFormState.type}>{deleteFormState.message}</Message>
      )}
      <div className="flex gap-2">
        <form action={updateFormAction} id={updateFormId}>
          <ButtonSubmit color="yellow">Update</ButtonSubmit>
        </form>
        <form action={deleteFormAction} ref={formRef}>
          <input
            type="number"
            name="quiz-id"
            id="quiz-id"
            className="hidden"
            defaultValue={quiz.id}
          />
          <ButtonDelete
            confirmationText={quiz.id.toString()}
            formRef={formRef}
          />
        </form>
      </div>
    </div>
  );
}
