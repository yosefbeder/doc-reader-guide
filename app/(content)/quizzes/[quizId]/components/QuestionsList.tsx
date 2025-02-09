"use client";

import Button from "@/components/Button";
import Message from "@/components/Message";
import { Question } from "@/types";
import isValidURL from "@/utils/isValidUrl";
import React, { useEffect, useState } from "react";

export default function QuestionsList({
  questions,
}: {
  questions: Question[];
}) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState(questions.map(() => -1));
  const [currentQuestionInput, setCurrentQuestionInput] = useState(1);
  const [showingResults, setShowingResults] = useState(false);
  const explanation = questions[currentQuestion].explanation;

  useEffect(() => {
    setCurrentQuestionInput(currentQuestion + 1);
  }, [currentQuestion]);

  if (showingResults) {
    const correct = answers.reduce(
      (acc, answer, index) =>
        answer === questions[index].correctOptionIndex ? acc + 1 : acc,
      0
    );
    return (
      <div className="max-w-lg">
        <h2 className="mb-4">
          Result → {correct} / {questions.length}
        </h2>
        <h2 className="mb-4">Summary</h2>
        <p className="mb-4">
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
                  <img src={question.image} alt="Question associated diagram" />
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
                          if (answers[questionIndex] === -1)
                            return "text-yellow-600";
                          else return "text-green-600";
                        else if (answers[questionIndex] === optionIndex)
                          return "text-red-600";
                      })()}`}
                    >
                      {option}
                    </li>
                  ))}
                </ol>
              </li>
            );
          })}
        </ol>
      </div>
    );
  }

  return (
    <div className="max-w-lg">
      <h2 className="mb-4">
        Question {currentQuestion + 1} of {questions.length}
      </h2>
      <h3 className="p-4 rounded-xl bg-cyan-50 mb-4">
        {questions[currentQuestion].text}
      </h3>
      {questions[currentQuestion].image ? (
        <img
          src={questions[currentQuestion].image}
          className="mb-4"
          alt="Question associated diagram"
        />
      ) : null}
      <ol className="list-[upper-alpha] list-inside flex flex-col gap-2 mb-4 px-2">
        {questions[currentQuestion].options.map((option, index) => (
          <button
            key={index}
            className={`block w-full text-left p-2 rounded-xl border transition-colors disabled:cursor-not-allowed ${(() => {
              if (answers[currentQuestion] !== -1) {
                if (questions[currentQuestion].correctOptionIndex === index)
                  return "bg-green-100 hover:bg-green-200 border-green-600";
                else if (answers[currentQuestion] === index)
                  return "bg-red-100 hover:bg-red-200 border-red-600";
              }
              return "bg-slate-50 hover:bg-slate-100 border-slate-300";
            })()}`}
            disabled={answers[currentQuestion] !== -1}
            onClick={() => {
              if (answers[currentQuestion] !== -1) return;
              setAnswers((prev) => [
                ...prev.slice(0, currentQuestion),
                index,
                ...prev.slice(currentQuestion + 1),
              ]);
            }}
          >
            <li>{option}</li>
          </button>
        ))}
      </ol>
      {answers[currentQuestion] !== -1 && explanation ? (
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
        <Button
          onClick={() => setCurrentQuestion((prev) => prev - 1)}
          disabled={currentQuestion === 0}
        >
          ← Back
        </Button>
        <div className="flex gap-2 max-sm:hidden">
          <input
            type="number"
            name="current-question"
            id="current-question"
            className="w-10"
            value={currentQuestionInput}
            onChange={(e) => setCurrentQuestionInput(e.target.valueAsNumber)}
          />
          <Button
            onClick={() => setCurrentQuestion(currentQuestionInput - 1)}
            disabled={
              currentQuestionInput < 1 ||
              currentQuestionInput > questions.length
            }
          >
            Go
          </Button>
        </div>
        <Button
          onClick={() => setCurrentQuestion((prev) => prev + 1)}
          disabled={currentQuestion === questions.length - 1}
        >
          {answers[currentQuestion] === -1 ? "Skip →" : "Continue →"}
        </Button>
      </div>
      <div className="flex justify-between mb-4">
        <div className="max-sm:flex gap-2 hidden">
          <input
            type="number"
            name="current-question"
            id="current-question"
            className="w-10"
            value={currentQuestionInput}
            onChange={(e) => setCurrentQuestionInput(e.target.valueAsNumber)}
          />
          <Button
            onClick={() => setCurrentQuestion(currentQuestionInput - 1)}
            disabled={
              currentQuestionInput < 1 ||
              currentQuestionInput > questions.length
            }
          >
            Go
          </Button>
        </div>
        <Button color="yellow" onClick={() => setShowingResults(true)}>
          End Quiz
        </Button>
      </div>
    </div>
  );
}
