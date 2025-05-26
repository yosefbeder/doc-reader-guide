"use client";

import { Question } from "@/types";
import React, { useEffect } from "react";
import UpdateQuestionForm from "./UpdateQuestionForm";

export default function QuestionsList({
  quizId,
  questions,
}: {
  questions: Question[];
  quizId: number;
}) {
  useEffect(() => {
    const quizJSON = localStorage.getItem(`quiz-${quizId}-new`);
    if (quizJSON) {
      const quizData = JSON.parse(quizJSON);
      if (quizData.currentQuestion) {
        const questionElement = document.getElementById(
          `question-${quizData.currentQuestion}`
        );
        if (questionElement) {
          questionElement.scrollIntoView({ behavior: "smooth" });
        }
      }
    }
  }, []);

  return questions.map((question, index) => (
    <div
      key={question.id}
      className="max-w-lg mb-4"
      id={`question-${question.id}`}
    >
      <UpdateQuestionForm index={index} quizId={+quizId} question={question} />
    </div>
  ));
}
