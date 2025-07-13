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
    <div className="max-w-lg">
      <h2 className="mb-4">
        Question {currentIndex + 1} of {questions.length}
      </h2>
      {children}
      <div className="flex justify-between mb-4">
        <Button onClick={backQuestion} disabled={currentIndex === 0}>
          ← Back
        </Button>
        <Button
          onClick={nextQuestion}
          disabled={currentIndex === questions.length - 1}
        >
          Next →
        </Button>
      </div>
      <div className="flex justify-between mb-4">
        <select
          onChange={(e) => setCurrentQuestion(+e.target.value)}
          value={currentQuestion}
        >
          {questions.map(({ id }, index) => (
            <option key={id} value={id}>
              Question {index + 1}
            </option>
          ))}
        </select>
        <Button color="yellow" onClick={() => setShowingResults(true)}>
          End Quiz
        </Button>
      </div>
    </div>
  );
}
