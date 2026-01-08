"use client";

import React, { useState } from "react";
import { useSwipeable } from "react-swipeable";

import { DatabaseTable, Quiz, QuizType } from "@/types";
import Button from "./Button";
import { icons } from "./icons";
import QuizNav from "./QuizNav";

interface QuestionWrapperProps<T extends DatabaseTable> {
  type: QuizType;
  quiz: Quiz;
  questions: T[];
  currentQuestion: number;
  goToQuestion: (id: number) => void;
  currentIndex: number;
  backQuestion: () => void;
  nextQuestion: () => void;
  endQuiz: () => void;
  children: React.ReactNode;
  onCopy?: () => Promise<void> | void;
  onShare?: () => Promise<void> | void;
}

export default function QuizLayout<T extends DatabaseTable>({
  type,
  quiz,
  questions,
  currentQuestion,
  goToQuestion,
  currentIndex,
  backQuestion,
  nextQuestion,
  endQuiz,
  children,
  onCopy,
  onShare,
}: QuestionWrapperProps<T>) {
  const [copied, setCopied] = useState(false);

  const handlers = useSwipeable({
    onSwipedLeft: () => {
      if (currentIndex < questions.length - 1) nextQuestion();
    },
    onSwipedRight: () => {
      if (currentIndex > 0) backQuestion();
    },
  });

  return (
    <div {...handlers}>
      <QuizNav
        title={quiz.title}
        progress={(currentIndex + 1) / questions.length}
        lectureId={quiz.lectureData.id}
      />
      <div className="max-w-2xl mx-auto px-2 pt-4 pb-[72px] col">
        <div className="flex justify-between items-center">
          <span className="caption text-base">
            Question{" "}
            <select
              onChange={(e) => goToQuestion(+e.target.value)}
              value={currentQuestion}
            >
              {questions.map(({ id }, index) => (
                <option key={id} value={id}>
                  {index + 1}
                </option>
              ))}
            </select>{" "}
            of {questions.length}
          </span>
          <div className="flex items-center gap-4">
            {onCopy && (
              <button
                onClick={async () => {
                  await onCopy();
                  setCopied(true);
                  setTimeout(() => setCopied(false), 2000);
                }}
              >
                {copied ? icons["check"] : icons["clipboard-document-list"]}
              </button>
            )}
            {onShare && <button onClick={onShare}>{icons["share"]}</button>}
          </div>
        </div>
        {children}
      </div>
      <div className="w-full quiz-main fixed bottom-0 left-1/2 -translate-x-1/2 flex justify-between items-center bg-white dark:bg-slate-900 max-sm:gap-2">
        <Button
          onClick={backQuestion}
          color="white"
          className="flex gap-2 items-center max-sm:w-1/2 max-sm:justify-center"
          disabled={currentIndex === 0}
        >
          {icons["arrow-left"]}
          Back
        </Button>
        {currentIndex === 0 ? (
          <p className="caption max-sm:hidden">
            Press {type === "mcq" ? "number keys to answer, " : ""}← / → to
            navigate
          </p>
        ) : null}
        {currentIndex === questions.length - 1 ? (
          <Button
            onClick={endQuiz}
            className="flex gap-2 items-center max-sm:w-1/2 max-sm:justify-center"
          >
            End
            {icons["chart-pie"]}
          </Button>
        ) : (
          <Button
            onClick={nextQuestion}
            disabled={currentIndex === questions.length - 1}
            className="flex gap-2 items-center max-sm:w-1/2 max-sm:justify-center"
          >
            Next
            {icons["arrow-right"]}
          </Button>
        )}
      </div>
    </div>
  );
}
