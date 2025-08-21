"use client";

import { useCallback, useEffect, useState } from "react";

import {
  WrittenQuestion,
  QuestionState,
  FormStateType,
  WrittenQuiz,
} from "@/types";
import { useQuestions } from "@/lib/hooks";
import Summary from "./Summary";
import calcFactor from "@/utils/calcFactor";
import SelectAnswerDialogue from "./SelectAnswerDialogue";
import QuestionWrapper from "@/components/QuestionWrapper";
import HtmlContentClient from "@/components/HtmlContentClient";
import Message from "@/components/Message";
import useSettings from "@/lib/hooks/useSettings";
import { useSound } from "@/lib/hooks/useSound";

const border = new Map([
  [QuestionState.TRUE, "border-green-600"],
  [QuestionState.FALSE, "border-red-600"],
  [QuestionState.UNANSWERED, "border-slate-700"],
  [QuestionState.UNSELECTED, "border-slate-700"],
]);

export const subQuestionMessageType = new Map<QuestionState, FormStateType>([
  [QuestionState.TRUE, "success"],
  [QuestionState.FALSE, "fail"],
  [QuestionState.UNANSWERED, "warning"],
  [QuestionState.UNSELECTED, "warning"],
]);

export const subQuestionText = new Map([
  [QuestionState.TRUE, "Correct"],
  [QuestionState.FALSE, "Incorrect"],
  [QuestionState.UNANSWERED, "Skipped"],
  [QuestionState.UNSELECTED, "Not specified"],
]);

export interface Answers {
  tapes: Map<number, QuestionState>;
  subQuestions: Map<number, QuestionState>;
}

export default function QuestionsList({
  quiz,
  title,
  questions,
}: {
  quiz: WrittenQuiz;
  title: string;
  questions: WrittenQuestion[];
}) {
  const playClick = useSound("/click.mp3");
  const playCorrect = useSound("/correct.mp3");
  const playIncorrect = useSound("/incorrect.mp3");
  const [{ writtenQuiz: settings }] = useSettings();
  const [answers, setAnswers] = useState<Answers>({
    tapes: new Map<number, QuestionState>(),
    subQuestions: new Map<number, QuestionState>(),
  });
  const onLoad = useCallback(
    (storedAnswersString: string) => {
      if (storedAnswersString) {
        const storedAnswers = JSON.parse(storedAnswersString);
        const storedTapes = new Map<number, QuestionState>(storedAnswers.tapes);
        const storedWrittenQuestions = new Map<number, QuestionState>(
          storedAnswers.subQuestions
        );
        const temp = {
          tapes: new Map<number, QuestionState>(),
          subQuestions: new Map<number, QuestionState>(),
        };
        questions.forEach((question) => {
          question.tapes.forEach(({ id }) =>
            temp.tapes.set(
              id,
              storedTapes.has(id)
                ? storedTapes.get(id)!
                : QuestionState.UNANSWERED
            )
          );
          question.subQuestions.forEach(({ id }) =>
            temp.subQuestions.set(
              id,
              storedWrittenQuestions.has(id)
                ? storedWrittenQuestions.get(id)!
                : QuestionState.UNANSWERED
            )
          );
        });
        setAnswers(temp);
      } else resetAnswers();
    },
    [questions]
  );
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
      quiz,
      questions,
      answers,
      localStorageItem: `written-quiz-${quiz.id}`,
      serializeAnswers: (x) => {
        return JSON.stringify({
          tapes: Array.from(x.tapes),
          subQuestions: Array.from(x.subQuestions),
        });
      },
      onLoad: onLoad,
      randomOrder: settings.shuffle,
    },
  });
  const updateTapeState = useCallback(
    (id: number, newState: QuestionState) => {
      setAnswers((prev) => {
        const temp = {
          subQuestions: prev.subQuestions,
          tapes: new Map(),
        };
        prev.tapes.forEach((answer, tapeId) => {
          if (tapeId === id) temp.tapes.set(id, newState);
          else temp.tapes.set(tapeId, answer);
        });
        return temp;
      });
    },
    [currentQuestion]
  );
  const updateWrittenQuestionState = useCallback(
    (id: number, newState: QuestionState) => {
      setAnswers((prev) => {
        const temp = {
          subQuestions: new Map(),
          tapes: prev.tapes,
        };
        prev.subQuestions.forEach((answer, writtenQuestionId) => {
          if (writtenQuestionId === id) temp.subQuestions.set(id, newState);
          else temp.subQuestions.set(writtenQuestionId, answer);
        });
        return temp;
      });
    },
    [currentQuestion]
  );
  const calcFactors = useCallback(
    () =>
      orderedQuestions.map((question) =>
        question.image ? calcFactor(question.width!) : null
      ),
    [orderedQuestions]
  );
  const [factors, setFactors] = useState(calcFactors());
  useEffect(() => {
    const adjustImages = () => setFactors(calcFactors());
    window.addEventListener("resize", adjustImages);
    return () => window.removeEventListener("resize", adjustImages);
  }, [calcFactors]);

  const resetAnswers = useCallback(() => {
    const temp = { tapes: new Map(), subQuestions: new Map() };
    orderedQuestions.forEach((question) => {
      question.tapes.forEach(({ id }) =>
        temp.tapes.set(id, QuestionState.UNANSWERED)
      );
      question.subQuestions.forEach(({ id }) =>
        temp.subQuestions.set(id, QuestionState.UNANSWERED)
      );
    });
    setAnswers(temp);
  }, [orderedQuestions]);

  if (!isLoaded) return;

  if (showingResults) {
    return (
      <Summary
        title={title}
        questions={orderedQuestions}
        answers={answers}
        resetState={() => {
          resetState();
          resetAnswers();
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
      {orderedQuestions.map((question, index) => {
        const factor = factors[index];
        return (
          <div
            key={`written-question-${question.id}`}
            className={currentQuestion === question.id ? "" : "hidden"}
          >
            {question.image && factor && (
              <div className="relative">
                <img
                  key={currentQuestion}
                  src={`${process.env.NEXT_PUBLIC_STATIC_URL}/image/${question.image}`}
                  width={question.width! * factor}
                  height={question.height! * factor}
                  alt="Question"
                  loading="eager"
                />
                {question.masks.map(({ id, x, y, w, h }) => (
                  <div
                    key={"mask-" + id}
                    style={{
                      position: "absolute",
                      left: x * factor,
                      top: y * factor,
                      width: w * factor,
                      height: h * factor,
                      background: "white",
                      border: "2px solid black",
                    }}
                  ></div>
                ))}
                {question.tapes.map(({ id, x, y, w, h }) => {
                  const questionState = answers.tapes.get(id)!;
                  const dialoguePosition =
                    x * factor + 80 > question.width! * factor
                      ? { right: 0 }
                      : { left: x * factor };
                  return (
                    <>
                      {questionState === QuestionState.UNSELECTED && (
                        <SelectAnswerDialogue
                          key={"dialogue-" + id}
                          style={{
                            position: "absolute",
                            zIndex: 10,
                            top: y * factor - 30,
                            ...dialoguePosition,
                          }}
                          onTrue={() => {
                            updateTapeState(id, QuestionState.TRUE);
                            if (settings.sounds) playCorrect();
                          }}
                          onFalse={() => {
                            updateTapeState(id, QuestionState.FALSE);
                            if (settings.sounds) playIncorrect();
                          }}
                        />
                      )}
                      <button
                        className={`border-2 ${border.get(questionState)} ${
                          questionState === QuestionState.UNANSWERED &&
                          "bg-yellow-200"
                        }`}
                        key={"tape-" + id}
                        style={{
                          position: "absolute",
                          left: x * factor,
                          top: y * factor,
                          width: w * factor,
                          height: h * factor,
                        }}
                        onClick={() => {
                          if (
                            answers.tapes.get(id) === QuestionState.UNANSWERED
                          ) {
                            updateTapeState(id, QuestionState.UNSELECTED);
                            if (settings.sounds) playClick();
                          }
                        }}
                      ></button>
                    </>
                  );
                })}
              </div>
            )}
            <ol className="flex flex-col gap-4">
              {question.subQuestions.map(({ id, text, answer }, index) => {
                const questionState = answers.subQuestions.get(id)!;
                return (
                  <li key={`question-${id}`} className="flex flex-col gap-4">
                    <p className="font-bold">
                      {question.subQuestions.length > 1
                        ? `${index + 1}. ${text}`
                        : text}
                    </p>
                    {questionState === QuestionState.UNSELECTED && (
                      <SelectAnswerDialogue
                        onTrue={() => {
                          updateWrittenQuestionState(id, QuestionState.TRUE);
                          if (settings.sounds) playCorrect();
                        }}
                        onFalse={() => {
                          updateWrittenQuestionState(id, QuestionState.FALSE);
                          if (settings.sounds) playIncorrect();
                        }}
                      />
                    )}
                    {questionState !== QuestionState.UNANSWERED ? (
                      <>
                        {[QuestionState.TRUE, QuestionState.FALSE].includes(
                          questionState
                        ) && (
                          <Message
                            type={subQuestionMessageType.get(questionState)!}
                          >
                            {subQuestionText.get(questionState)}
                          </Message>
                        )}
                        <HtmlContentClient html={answer} />
                      </>
                    ) : (
                      <button
                        className="font-bold text-cyan-600 self-start"
                        onClick={() => {
                          updateWrittenQuestionState(
                            id,
                            QuestionState.UNSELECTED
                          );
                          if (settings.sounds) playClick();
                        }}
                      >
                        [...]
                      </button>
                    )}
                  </li>
                );
              })}
            </ol>
          </div>
        );
      })}
    </QuestionWrapper>
  );
}
