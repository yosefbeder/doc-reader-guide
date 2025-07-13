"use client";

import React, { useState } from "react";
import { useHotkeys } from "react-hotkeys-hook";

import Message from "@/components/Message";
import { Question } from "@/types";
import isValidURL from "@/utils/isValidURL";
import { useQuestions } from "@/lib/hooks";
import Summary from "./Summary";
import QuestionWrapper from "@/components/QuestionWrapper";

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
    orderedQuestions,
    currentQuestion,
    currentIndex,
    showingResults,
    isLoaded,
    resetState,
    ...rest
  } = useQuestions({
    options: {
      questions,
      answers,
      localStorageItem: `quiz-${quizId}-new`,
      serializeAnswers: (x) => Array.from(x),
      onLoad(storedAnswers) {
        try {
          storedAnswers && setAnswers(new Map(storedAnswers));
        } catch (err) {
          resetState();
        }
      },
      randomOrder: false,
    },
  });
  const explanation = questions[currentIndex].explanation;

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
    return (
      <Summary
        title={title}
        questions={questions}
        answers={answers}
        resetState={() => {
          resetState();
          setAnswers(new Map());
        }}
      />
    );
  }

  return (
    <QuestionWrapper
      questions={orderedQuestions}
      currentQuestion={currentQuestion}
      currentIndex={currentIndex}
      {...rest}
    >
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
    </QuestionWrapper>
  );
}
