"use client";

import React, { useCallback, useState } from "react";
import { useHotkeys } from "react-hotkeys-hook";

import Message from "@/components/Message";
import { Action, McqQuestion, McqQuiz, Resource } from "@/types";
import isValidURL from "@/utils/isValidURL";
import { useQuestions } from "@/lib/hooks";
import Summary from "./Summary";
import QuestionWrapper from "@/components/QuestionWrapper";
import useSettings from "@/lib/hooks/useSettings";
import { useSound } from "@/lib/hooks/useSound";
import Button from "@/components/Button";
import { logEvent } from "@/lib/event-logger";

const toUppercaseLetter = (index: number) => String.fromCharCode(65 + index);

const buildChatGPTLink = (
  quiz: McqQuiz,
  question: McqQuestion,
  answer: number
) => {
  const faculty = `${quiz.lectureData.subject.module.year.faculty.name} ${quiz.lectureData.subject.module.year.faculty.city}`;
  const subject = quiz.lectureData.subject.name;
  const prompt = `Play the role of ${
    subject.match(/exams/gi) ? "a medical" : subject
  } lecturer at ${faculty}.
I have a problem understanding this MCQ question:
${question.text}
${question.options
  .map((opt, i) => `${toUppercaseLetter(i)}. ${opt}`)
  .join("\n")}
${
  answer === question.correctOptionIndex
    ? "Though my answer is correct."
    : `My answer is ${toUppercaseLetter(
        answer
      )} and the model answer is ${toUppercaseLetter(
        question.correctOptionIndex
      )}.`
}
Can you help me understand it?`;
  return `https://chat.openai.com/?model=gpt-4&q=${prompt}`;
};

export default function QuestionsList({
  quiz,
  title,
  questions,
}: {
  quiz: McqQuiz;
  title: string;
  questions: McqQuestion[];
}) {
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
      questions,
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
        id={quiz.id}
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
      {orderedQuestions.map((question) => (
        <div
          key={question.id}
          className={`max-w-xl flex flex-col gap-4 ${
            currentQuestion === question.id ? "" : "hidden"
          }`}
        >
          <h3 className="p-4 rounded-xl bg-cyan-50">{question.text}</h3>
          {question.image ? (
            <img src={question.image} alt="Question associated diagram" />
          ) : null}
          {answers.has(question.id) && (
            <Button
              className="self-start"
              color="slate"
              shimmer={
                settings.instantFeedback &&
                question.correctOptionIndex !== answers.get(question.id)
              }
            >
              <a
                href={buildChatGPTLink(
                  quiz,
                  question,
                  answers.get(question.id)!
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
                <svg
                  role="img"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                  className="size-6 fill-current"
                >
                  <title>OpenAI</title>
                  <path d="M22.2819 9.8211a5.9847 5.9847 0 0 0-.5157-4.9108 6.0462 6.0462 0 0 0-6.5098-2.9A6.0651 6.0651 0 0 0 4.9807 4.1818a5.9847 5.9847 0 0 0-3.9977 2.9 6.0462 6.0462 0 0 0 .7427 7.0966 5.98 5.98 0 0 0 .511 4.9107 6.051 6.051 0 0 0 6.5146 2.9001A5.9847 5.9847 0 0 0 13.2599 24a6.0557 6.0557 0 0 0 5.7718-4.2058 5.9894 5.9894 0 0 0 3.9977-2.9001 6.0557 6.0557 0 0 0-.7475-7.0729zm-9.022 12.6081a4.4755 4.4755 0 0 1-2.8764-1.0408l.1419-.0804 4.7783-2.7582a.7948.7948 0 0 0 .3927-.6813v-6.7369l2.02 1.1686a.071.071 0 0 1 .038.052v5.5826a4.504 4.504 0 0 1-4.4945 4.4944zm-9.6607-4.1254a4.4708 4.4708 0 0 1-.5346-3.0137l.142.0852 4.783 2.7582a.7712.7712 0 0 0 .7806 0l5.8428-3.3685v2.3324a.0804.0804 0 0 1-.0332.0615L9.74 19.9502a4.4992 4.4992 0 0 1-6.1408-1.6464zM2.3408 7.8956a4.485 4.485 0 0 1 2.3655-1.9728V11.6a.7664.7664 0 0 0 .3879.6765l5.8144 3.3543-2.0201 1.1685a.0757.0757 0 0 1-.071 0l-4.8303-2.7865A4.504 4.504 0 0 1 2.3408 7.872zm16.5963 3.8558L13.1038 8.364 15.1192 7.2a.0757.0757 0 0 1 .071 0l4.8303 2.7913a4.4944 4.4944 0 0 1-.6765 8.1042v-5.6772a.79.79 0 0 0-.407-.667zm2.0107-3.0231l-.142-.0852-4.7735-2.7818a.7759.7759 0 0 0-.7854 0L9.409 9.2297V6.8974a.0662.0662 0 0 1 .0284-.0615l4.8303-2.7866a4.4992 4.4992 0 0 1 6.6802 4.66zM8.3065 12.863l-2.02-1.1638a.0804.0804 0 0 1-.038-.0567V6.0742a4.4992 4.4992 0 0 1 7.3757-3.4537l-.142.0805L8.704 5.459a.7948.7948 0 0 0-.3927.6813zm1.0976-2.3654l2.602-1.4998 2.6069 1.4998v2.9994l-2.5974 1.4997-2.6067-1.4997Z" />
                </svg>
                Discuss with ChatGPT
              </a>
            </Button>
          )}
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
          <ol className="list-[upper-alpha] list-inside flex flex-col gap-2 px-2">
            {question.options.map((option, index) => {
              const answer = answers.get(currentQuestion);
              return (
                <button
                  key={`${question.id}-${index}`}
                  className={`block w-full text-left p-2 rounded-xl border transition-colors disabled:cursor-not-allowed ${(() => {
                    if (answer !== undefined) {
                      if (settings.instantFeedback) {
                        if (question.correctOptionIndex === index)
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
      ))}
    </QuestionWrapper>
  );
}
