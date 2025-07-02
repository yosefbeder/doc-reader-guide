"use client";

import { Question } from "@/types";
import React, { useCallback, useEffect, useState } from "react";
import UpdateQuestionForm from "./UpdateQuestionForm";
import { icons } from "@/components/icons";
import { useHotkeys } from "react-hotkeys-hook";
import Button from "@/components/Button";

export default function QuestionsList({
  quizId,
  questions,
}: {
  questions: Question[];
  quizId: number;
}) {
  const [questionsOpen, setQuestionsOpen] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState<number>();
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

  return (
    <section>
      <h2 className="mb-4">Update Questions</h2>
      <Button
        onClick={() => setQuestionsOpen((prev) => !prev)}
        className="mb-4"
      >
        {questionsOpen ? "Show Only Current Question" : "Show All Questions"}
      </Button>
      {questions.map((question, index) => (
        <div
          key={question.id}
          className="max-w-lg mb-4"
          id={`question-${question.id}`}
        >
          {(() => {
            const questionOpen =
              questionsOpen || question.id === currentQuestion;
            return (
              <div className="overflow-hidden rounded-xl bg-slate-50">
                <button
                  onClick={() =>
                    setCurrentQuestion((prev) =>
                      question.id === prev ? undefined : question.id
                    )
                  }
                  className={`w-full text-left flex items-center gap-2 p-2 rounded-b-xl ${
                    questionOpen
                      ? "bg-cyan-600 hover:bg-cyan-700 text-white"
                      : "hover:bg-slate-100"
                  } transition-colors`}
                >
                  {questionOpen
                    ? icons["chevron-down"]
                    : icons["chevron-right"]}
                  Question {index + 1}
                </button>
                {questionOpen && (
                  <div className="p-2">
                    <UpdateQuestionForm quizId={+quizId} question={question} />
                  </div>
                )}
              </div>
            );
          })()}
        </div>
      ))}
    </section>
  );
}
