"use client";

import React, { useCallback, useState } from "react";
import { useHotkeys } from "react-hotkeys-hook";

import Message from "@/components/Message";
import { Action, McqQuiz, Resource } from "@/types";
import isValidURL from "@/utils/isValidURL";
import { useQuestions } from "@/lib/hooks";
import Summary from "./Summary";
import QuizLayout from "@/components/QuizLayout";
import useSettings from "@/lib/hooks/useSettings";
import { useSound } from "@/lib/hooks/useSound";
import Button from "@/components/Button";
import { logEvent } from "@/lib/event-logger";
import buildChatGPTLink from "@/utils/buildChatGPTLink";
import { icons } from "@/components/icons";
import QuizNav from "@/components/QuizNav";

const toUppercaseLetter = (index: number) => String.fromCharCode(65 + index);

export default function QuestionsList({ quiz }: { quiz: McqQuiz }) {
  const {
    settings: { mcqQuiz: settings },
  } = useSettings();
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
      type: "mcq",
      quiz,
      questions: quiz.questions,
      answers,
      localStorageItem: `mcq-quiz-${quiz.id}`,
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
      logEvent(Resource.MCQ_QUESTION, currentQuestion, Action.SELECT_OPTION, {
        index,
      });
      setAnswers((prev) => {
        const newMap = new Map(prev);
        newMap.set(currentQuestion, index);
        return newMap;
      });
      if (settings.autoMove && answer === undefined)
        setTimeout(() => nextQuestion(), 250);
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
      <>
        <QuizNav
          title={quiz.title}
          progress={1}
          lectureId={quiz.lectureData.id}
        />
        <Summary
          id={quiz.id}
          title={quiz.title}
          questions={orderedQuestions}
          answers={answers}
          resetState={() => {
            resetState();
            setAnswers(new Map());
          }}
        />
      </>
    );
  }

  return (
    <QuizLayout
      quiz={quiz}
      questions={orderedQuestions}
      currentQuestion={currentQuestion}
      currentIndex={currentIndex}
      nextQuestion={nextQuestion}
      {...rest}
    >
      {orderedQuestions.map((question) => (
        <div
          key={question.id}
          className={currentQuestion === question.id ? "col" : "hidden"}
        >
          <h3 className="p-4 rounded-xl bg-cyan-50 dark:bg-slate-800">
            {question.text}
          </h3>
          {question.image ? (
            <img src={question.image} alt="Question associated diagram" />
          ) : null}
          <ol className="list-[upper-alpha] list-inside flex flex-col gap-2">
            {question.options.map((option, index) => {
              const answer = answers.get(currentQuestion);
              return (
                <button
                  key={`${question.id}-${index}`}
                  className={`block w-full text-left p-2 rounded-xl border transition-colors disabled:cursor-not-allowed ${(() => {
                    if (answer !== undefined) {
                      if (settings.instantFeedback) {
                        if (question.correctOptionIndex === index)
                          return "bg-green-100 hover:bg-green-200 border-green-600 dark:bg-green-900 dark:hover:bg-green-800 dark:border-green-400";
                        else if (answer === index)
                          return "bg-red-100 hover:bg-red-200 border-red-600 dark:bg-red-900 dark:hover:bg-red-800 dark:border-red-400";
                      } else {
                        if (answer === index)
                          return "bg-blue-100 hover:bg-blue-200 border-blue-600 dark:bg-blue-900 dark:hover:bg-blue-800 dark:border-blue-400";
                      }
                    }
                    return "bg-slate-50 hover:bg-slate-100 border-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 dark:border-slate-600";
                  })()}`}
                  disabled={answer !== undefined && settings.instantFeedback}
                  onClick={() => answerQuestion(answer, index)}
                >
                  <li>{option}</li>
                </button>
              );
            })}
          </ol>
          {answers.has(question.id) &&
          explanation &&
          settings.instantFeedback ? (
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
          {answers.has(question.id) && (
            <Button
              className="self-start"
              shimmer={
                settings.instantFeedback &&
                question.correctOptionIndex !== answers.get(question.id)
              }
            >
              <a
                href={buildChatGPTLink(
                  `${question.text}\n${question.options
                    .map((opt, i) => `${toUppercaseLetter(i)}. ${opt}`)
                    .join("\n")}`,
                  quiz.lectureData.subject.module.customGPT
                )}
                onClick={() =>
                  logEvent(
                    Resource.MCQ_QUESTION,
                    question.id,
                    Action.DICUSS_WITH_CHATGPT,
                    {}
                  )
                }
                className="flex gap-2 items-center"
                target="_blank"
              >
                {icons["open-ai"]}
                Discuss with ChatGPT
              </a>
            </Button>
          )}
        </div>
      ))}
    </QuizLayout>
  );
}
