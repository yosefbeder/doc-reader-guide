"use client";

import { Question } from "@/types";
import React, { useCallback, useEffect } from "react";
import UpdateQuestionForm from "./UpdateQuestionForm";
import { icons } from "@/components/icons";
import { useHotkeys } from "react-hotkeys-hook";

export default function QuestionsList({
  quizId,
  questions,
}: {
  questions: Question[];
  quizId: number;
}) {
  const [currentQuestion, setCurrentQuestion] = React.useState<number>();
  const currentIndex = questions.findIndex(({ id }) => id === currentQuestion);
  const backQuestion = useCallback(() => {
    if (currentIndex !== 0)
      setCurrentQuestion(() => questions[currentIndex - 1].id);
  }, [currentIndex, questions]);
  const nextQuestion = useCallback(() => {
    if (currentIndex !== questions.length - 1)
      setCurrentQuestion(() => questions[currentIndex + 1].id);
  }, [currentIndex, questions]);
  useHotkeys("left", backQuestion, [currentIndex, questions]);
  useHotkeys("right", nextQuestion, [currentIndex, questions]);

  useEffect(() => {
    const quizJSON = localStorage.getItem(`quiz-${quizId}-new`);
    if (quizJSON) {
      const quizData = JSON.parse(quizJSON);
      if (quizData.currentQuestion) {
        setCurrentQuestion(quizData.currentQuestion);
      }
    }
  }, []);

  useEffect(() => {
    const questionElement = document.getElementById(
      `question-${currentQuestion}`
    );
    if (questionElement) {
      questionElement.scrollIntoView({ behavior: "smooth" });
    }
  }, [currentQuestion]);

  return questions.map((question, index) => (
    <div
      key={question.id}
      className="max-w-lg mb-4"
      id={`question-${question.id}`}
    >
      <button
        onClick={() =>
          setCurrentQuestion((prev) =>
            question.id === prev ? undefined : question.id
          )
        }
        className={`w-full text-left flex items-center gap-2 p-2 rounded-xl ${
          question.id === currentQuestion
            ? "bg-cyan-600 hover:bg-cyan-700 text-white mb-2"
            : "bg-cyan-50 hover:bg-cyan-100"
        } transition-colors`}
      >
        {question.id === currentQuestion
          ? icons["chevron-down"]
          : icons["chevron-right"]}
        Question {index + 1}
      </button>
      {question.id === currentQuestion && (
        <UpdateQuestionForm quizId={+quizId} question={question} />
      )}
    </div>
  ));
}
