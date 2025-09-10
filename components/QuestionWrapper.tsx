import React from "react";

import { DatabaseTable } from "@/types";
import Button from "./Button";

interface QuestionWrapperProps<T extends DatabaseTable> {
  questions: T[];
  currentQuestion: number;
  goToQuestion: (id: number) => void;
  currentIndex: number;
  backQuestion: () => void;
  nextQuestion: () => void;
  endQuiz: () => void;
  children: React.ReactNode;
}

export default function QuestionWrapper<T extends DatabaseTable>({
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
      <div className="flex flex-col gap-4 pb-[73px]">{children}</div>
      <div className="w-full max-w-screen-lg fixed bottom-0 left-1/2 -translate-x-1/2 flex justify-between items-center py-4 px-2 bg-white border-t border-slate-200">
        <Button onClick={backQuestion} disabled={currentIndex === 0}>
          Back
        </Button>
        <span className="text-base text-slate-500">
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
          / {questions.length}
        </span>
        {currentIndex === questions.length - 1 ? (
          <Button color="yellow" onClick={endQuiz}>
            End
          </Button>
        ) : (
          <Button
            onClick={nextQuestion}
            disabled={currentIndex === questions.length - 1}
          >
            Next
          </Button>
        )}
      </div>
    </>
  );
}
