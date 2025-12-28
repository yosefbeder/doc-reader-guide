import React from "react";

import { DatabaseTable, Quiz } from "@/types";
import Button from "./Button";
import { icons } from "./icons";
import QuizNav from "./QuizNav";

interface QuestionWrapperProps<T extends DatabaseTable> {
  quiz: Quiz;
  questions: T[];
  currentQuestion: number;
  goToQuestion: (id: number) => void;
  currentIndex: number;
  backQuestion: () => void;
  nextQuestion: () => void;
  endQuiz: () => void;
  children: React.ReactNode;
}

export default function QuizLayout<T extends DatabaseTable>({
  quiz,
  questions,
  currentQuestion,
  goToQuestion,
  currentIndex,
  backQuestion,
  nextQuestion,
  endQuiz,
  children,
}: QuestionWrapperProps<T>) {
  return (
    <>
      <QuizNav
        title={quiz.title}
        progress={(currentIndex + 1) / questions.length}
        lectureId={quiz.lectureData.id}
      />
      <div className="max-w-2xl mx-auto px-2 pt-4 pb-[72px] col">
        <span className="text-base text-slate-500 dark:text-slate-300">
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
        {children}
      </div>
      <div className="w-full quiz-main fixed bottom-0 left-1/2 -translate-x-1/2 flex justify-between items-center bg-white dark:bg-slate-900">
        <Button
          onClick={backQuestion}
          color="white"
          className="flex gap-2 items-center"
          disabled={currentIndex === 0}
        >
          {icons["arrow-left"]}
          Back
        </Button>
        {currentIndex === questions.length - 1 ? (
          <Button color="yellow" onClick={endQuiz}>
            End
          </Button>
        ) : (
          <Button
            onClick={nextQuestion}
            disabled={currentIndex === questions.length - 1}
            className="flex gap-2 items-center"
          >
            Next
            {icons["arrow-right"]}
          </Button>
        )}
      </div>
    </>
  );
}
