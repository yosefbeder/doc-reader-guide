import { DatabaseTable } from "@/types";
import React, { Dispatch, SetStateAction } from "react";
import Button from "./Button";

interface QuestionWrapperProps<T extends DatabaseTable> {
  questions: T[];
  currentQuestion: number;
  setCurrentQuestion: Dispatch<SetStateAction<number>>;
  currentIndex: number;
  backQuestion: () => void;
  nextQuestion: () => void;
  setShowingResults: Dispatch<SetStateAction<boolean>>;
  children: React.ReactNode;
}

export default function QuestionWrapper<T extends DatabaseTable>({
  questions,
  currentQuestion,
  setCurrentQuestion,
  currentIndex,
  backQuestion,
  nextQuestion,
  setShowingResults,
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
            onChange={(e) => setCurrentQuestion(+e.target.value)}
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
          <Button color="yellow" onClick={() => setShowingResults(true)}>
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
