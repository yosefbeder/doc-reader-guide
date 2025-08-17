"use client";

import React, { useCallback, useState } from "react";
import { useHotkeys } from "react-hotkeys-hook";

import Message from "@/components/Message";
import { McqQuestion } from "@/types";
import isValidURL from "@/utils/isValidURL";
import { useQuestions } from "@/lib/hooks";
import Summary from "./Summary";
import QuestionWrapper from "@/components/QuestionWrapper";
import useSettings from "@/lib/hooks/useSettings";
import { useSound } from "@/lib/hooks/useSound";

export default function QuestionsList({
  quizId,
  title,
  questions,
}: {
  quizId: number;
  title: string;
  questions: McqQuestion[];
}) {
  const [{ mcqQuiz: settings }] = useSettings();
  const [answers, setAnswers] = useState(new Map<number, number>());
  const {
    orderedQuestions,
    currentQuestion,
    currentIndex,
    showingResults,
    isLoaded,
    resetState,
    nextQuestion,
    ...rest
  } = useQuestions({
    options: {
      questions,
      answers,
      localStorageItem: `mcq-quiz-${quizId}`,
      serializeAnswers: (x) => Array.from(x),
      onLoad(storedAnswers) {
        try {
          storedAnswers && setAnswers(new Map(storedAnswers));
        } catch (err) {
          resetState();
        }
      },
      randomOrder: settings.shuffle,
    },
  });
  const explanation = orderedQuestions[currentIndex].explanation;
  const playClick = useSound("/click.mp3");
  const playCorrect = useSound("/correct.mp3");
  const playIncorrect = useSound("/incorrect.mp3");
  const answerQuestion = useCallback(
    (answer: number | undefined, index: number) => {
      if (answer && settings.instantFeedback) return;
      if (settings.sounds) {
        if (!settings.instantFeedback) {
          if (index !== answer) playClick();
        } else {
          if (index === orderedQuestions[currentIndex].correctOptionIndex)
            playCorrect();
          else playIncorrect();
        }
      }
      setAnswers((prev) => {
        const newMap = new Map(prev);
        newMap.set(currentQuestion, index);
        return newMap;
      });
      if (settings.autoMove && answer === undefined)
        setTimeout(() => nextQuestion(), 1000);
    },
    [settings, orderedQuestions, currentQuestion]
  );

  useHotkeys(
    "1,2,3,4,5",
    (event) => {
      const optionIndex = parseInt(event.key) - 1;
      if (
        optionIndex >= 0 &&
        optionIndex < orderedQuestions[currentIndex].options.length
      )
        answerQuestion(answers.get(currentQuestion), optionIndex);
    },
    [currentIndex, orderedQuestions, answers, currentQuestion]
  );

  if (!isLoaded) return;

  if (showingResults) {
    return (
      <Summary
        title={title}
        questions={orderedQuestions}
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
      nextQuestion={nextQuestion}
      {...rest}
    >
      <div className="max-w-xl flex flex-col gap-4">
        <h3 className="p-4 rounded-xl bg-cyan-50">
          {orderedQuestions[currentIndex].text}
        </h3>
        {orderedQuestions[currentIndex].image ? (
          <img
            src={orderedQuestions[currentIndex].image}
            alt="Question associated diagram"
          />
        ) : null}
        {answers.has(currentQuestion) && explanation ? (
          <Message type="information">
            {isValidURL(explanation) ? (
              <a href={explanation} target="_blank">
                {explanation}
              </a>
            ) : (
              explanation
            )}
          </Message>
        ) : null}
        <ol className="list-[upper-alpha] list-inside flex flex-col gap-2 px-2">
          {orderedQuestions[currentIndex].options.map((option, index) => {
            const answer = answers.get(currentQuestion);
            return (
              <button
                key={`${orderedQuestions[currentIndex].id}-${index}`}
                className={`block w-full text-left p-2 rounded-xl border transition-colors disabled:cursor-not-allowed ${(() => {
                  if (answer !== undefined) {
                    if (settings.instantFeedback) {
                      if (
                        orderedQuestions[currentIndex].correctOptionIndex ===
                        index
                      )
                        return "bg-green-100 hover:bg-green-200 border-green-600";
                      else if (answer === index)
                        return "bg-red-100 hover:bg-red-200 border-red-600";
                    } else {
                      if (answer === index)
                        return "bg-blue-100 hover:bg-blue-200 border-blue-600";
                    }
                  }
                  return "bg-slate-50 hover:bg-slate-100 border-slate-300";
                })()}`}
                disabled={answer !== undefined && settings.instantFeedback}
                onClick={() => answerQuestion(answer, index)}
              >
                <li>{option}</li>
              </button>
            );
          })}
        </ol>
      </div>
    </QuestionWrapper>
  );
}
