"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import { useReactToPrint } from "react-to-print";

import Button from "@/components/Button";
import ButtonIcon from "@/components/ButtonIcon";
import Message from "@/components/Message";
import { Question } from "@/types";
import isValidURL from "@/utils/isValidURL";
import Logo from "@/components/Logo";
import { useQuestions } from "@/lib/hooks";

export default function QuestionsList({
  quizId,
  title,
  questions,
}: {
  quizId: number;
  title: string;
  questions: Question[];
}) {
  const [answers, setAnswers] = useState(new Map<number, number>());
  const {
    currentQuestion,
    setCurrentQuestion,
    currentIndex,
    backQuestion,
    nextQuestion,
    showingResults,
    setShowingResults,
    isLoaded,
    resetState,
  } = useQuestions(
    questions,
    `quiz-${quizId}-new`,
    answers,
    (x) => Array.from(x),
    (storedAnswers) => {
      try {
        storedAnswers && setAnswers(new Map(storedAnswers));
      } catch (err) {
        resetState();
      }
    },
    false
  );
  const explanation = questions[currentIndex].explanation;
  const contentRef = React.useRef<HTMLDivElement>(null);
  const reactToPrintFn = useReactToPrint({
    contentRef,
    documentTitle: title,
    fonts: [
      {
        family: "Inter",
        source:
          "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
      },
    ],
    preserveAfterPrint: true,
  });
  useHotkeys(
    "1,2,3,4,5",
    (event) => {
      const optionIndex = parseInt(event.key) - 1;
      if (
        optionIndex >= 0 &&
        optionIndex < questions[currentIndex].options.length &&
        !answers.has(currentQuestion)
      ) {
        setAnswers((prev) => {
          const newMap = new Map(prev);
          newMap.set(currentQuestion, optionIndex);
          return newMap;
        });
      }
    },
    [currentIndex, questions, answers, currentQuestion]
  );

  if (!isLoaded) return;

  if (showingResults) {
    const correct = Array.from(answers.entries()).reduce(
      (acc, [questionId, optionIndex]) =>
        optionIndex ===
        questions.find(({ id }) => id === questionId)?.correctOptionIndex
          ? acc + 1
          : acc,
      0
    );
    return (
      <>
        <div className="flex gap-2 mb-4">
          <ButtonIcon icon="printer" onClick={reactToPrintFn} />
          <ButtonIcon
            icon="arrow-path"
            onClick={() => {
              setAnswers(new Map());
              resetState();
            }}
          />
        </div>
        <div className="max-w-lg print-section" ref={contentRef}>
          <div className="print-only">
            <Logo />
          </div>
          <h1 className="my-4 print-only">{title}</h1>
          <h2 className="my-4">
            Result → {correct} / {questions.length} (
            {Math.round((correct / questions.length) * 10000) / 100}%)
          </h2>
          <h2 className="my-4">Summary</h2>
          <p className="my-4">
            <span className="text-green-600">* Correct</span>
            <br />
            <span className="text-red-600">* Incorrect</span>
            <br />
            <span className="text-yellow-600">* Skipped</span>
          </p>
          <ol>
            {questions.map((question, questionIndex) => {
              return (
                <li key={question.id}>
                  <span className="font-bold">
                    {questionIndex + 1}. {question.text}
                  </span>
                  {question.image ? (
                    <img
                      src={question.image}
                      alt="Question associated diagram"
                    />
                  ) : null}
                  <ol className="list-[upper-alpha] list-inside">
                    {question.options.map((option, optionIndex) => (
                      <li
                        key={optionIndex}
                        className={`${(() => {
                          if (
                            optionIndex ===
                            questions[questionIndex].correctOptionIndex
                          )
                            if (!answers.has(question.id))
                              return "text-yellow-600";
                            else return "text-green-600";
                          else if (answers.get(question.id) === optionIndex)
                            return "text-red-600";
                        })()}`}
                      >
                        {option}
                      </li>
                    ))}
                  </ol>
                  {question.explanation && (
                    <p>
                      <b>Explanation: </b>
                      {isValidURL(question.explanation) ? (
                        <a href={question.explanation} target="_blank">
                          {question.explanation}
                        </a>
                      ) : (
                        question.explanation
                      )}
                    </p>
                  )}
                </li>
              );
            })}
          </ol>
        </div>
      </>
    );
  }

  return (
    <div className="max-w-lg">
      <h2 className="mb-4">
        Question {currentIndex + 1} of {questions.length}
      </h2>
      <h3 className="p-4 rounded-xl bg-cyan-50 mb-4">
        {questions[currentIndex].text}
      </h3>
      {questions[currentIndex].image ? (
        <img
          src={questions[currentIndex].image}
          className="mb-4"
          alt="Question associated diagram"
        />
      ) : null}
      <ol className="list-[upper-alpha] list-inside flex flex-col gap-2 mb-4 px-2">
        {questions[currentIndex].options.map((option, index) => {
          const answer = answers.get(currentQuestion);
          return (
            <button
              key={index}
              className={`block w-full text-left p-2 rounded-xl border transition-colors disabled:cursor-not-allowed ${(() => {
                if (answer !== undefined) {
                  if (questions[currentIndex].correctOptionIndex === index)
                    return "bg-green-100 hover:bg-green-200 border-green-600";
                  else if (answer === index)
                    return "bg-red-100 hover:bg-red-200 border-red-600";
                }
                return "bg-slate-50 hover:bg-slate-100 border-slate-300";
              })()}`}
              disabled={answer !== undefined}
              onClick={() => {
                if (answer) return;
                setAnswers((prev) => {
                  const newMap = new Map(prev);
                  newMap.set(currentQuestion, index);
                  return newMap;
                });
              }}
            >
              <li>{option}</li>
            </button>
          );
        })}
      </ol>
      {answers.has(currentQuestion) && explanation ? (
        <Message type="information" className="mb-4">
          {isValidURL(explanation) ? (
            <a href={explanation} target="_blank">
              {explanation}
            </a>
          ) : (
            explanation
          )}
        </Message>
      ) : null}
      <div className="flex justify-between mb-4">
        <Button onClick={backQuestion} disabled={currentIndex === 0}>
          ← Back
        </Button>
        <Button
          onClick={nextQuestion}
          disabled={currentIndex === questions.length - 1}
        >
          {answers.has(currentQuestion) ? "Continue →" : "Skip →"}
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
