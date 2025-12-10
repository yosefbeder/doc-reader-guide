"use client";

import React, { useEffect, useState } from "react";
import { useFormState } from "react-dom";

import ButtonSubmit from "@/components/ButtonSubmit";
import { quickAdd } from "@/lib/actions/writtenQuizzes";
import Message from "@/components/Message";
import Checkbox from "@/components/Checkbox";

export default function QuickAddForm({ quizId }: { quizId: number }) {
  const [formState, formAction] = useFormState(quickAdd, {});
  const [questions, setQuestions] = useState("");

  useEffect(() => {
    if (formState.resetKey) setQuestions("");
  }, [formState.resetKey]);
  return (
    <form action={formAction}>
      <input
        type="number"
        name="quiz-id"
        id="quiz-id"
        defaultValue={quizId}
        className="hidden"
      />
      <label htmlFor="questions" className="block mb-2">
        JSON
      </label>
      <textarea
        name="questions"
        id="questions"
        className="block mb-4"
        value={questions}
        onChange={(e) => setQuestions(e.target.value)}
      ></textarea>
      <div className="block mb-4">
        <Checkbox label="Notify?" name="notify" />
      </div>
      {formState.message && formState.type && (
        <Message type={formState.type} className="mb-4">
          {formState.message}
        </Message>
      )}
      <ButtonSubmit>Add</ButtonSubmit>
    </form>
  );
}
