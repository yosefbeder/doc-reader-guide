"use client";

import { useCallback, useEffect, useState } from "react";

import { WrittenQuestion, QuestionState } from "@/types";
import { useQuestions } from "@/lib/hooks";
import Summary from "./Summary";
import calcFactor from "@/utils/calcFactor";
import SelectAnswerDialogue from "./SelectAnswerDialogue";
import QuestionWrapper from "@/components/QuestionWrapper";

const border = new Map([
  [QuestionState.TRUE, "border-green-600"],
  [QuestionState.FALSE, "border-red-600"],
  [QuestionState.UNANSWERED, "border-slate-700"],
  [QuestionState.UNSELECTED, "border-slate-700"],
]);

const writtenAnswer = new Map([
  [QuestionState.TRUE, "text-green-600"],
  [QuestionState.FALSE, "text-red-600"],
  [QuestionState.UNANSWERED, "text-slate-700"],
  [QuestionState.UNSELECTED, "text-slate-700"],
]);

export interface Answers {
  tapes: Map<number, QuestionState>;
  subQuestions: Map<number, QuestionState>;
}

export default function QuestionsList({
  quizId,
  title,
  questions,
}: {
  quizId: number;
  title: string;
  questions: WrittenQuestion[];
}) {
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
      questions,
      answers,
      localStorageItem: `practical-quiz-${quizId}`,
      serializeAnswers: (x) => {
        return JSON.stringify({
          tapes: Array.from(x.tapes),
          subQuestions: Array.from(x.subQuestions),
        });
      },
      onLoad: onLoad,
      randomOrder: true,
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
  const [factor, setFactor] = useState<number>();

  const resetAnswers = useCallback(() => {
    const temp = { tapes: new Map(), subQuestions: new Map() };
    questions.forEach((question) => {
      question.tapes.forEach(({ id }) =>
        temp.tapes.set(id, QuestionState.UNANSWERED)
      );
      question.subQuestions.forEach(({ id }) =>
        temp.subQuestions.set(id, QuestionState.UNANSWERED)
      );
    });
    setAnswers(temp);
  }, [questions]);

  useEffect(() => {
    if (!orderedQuestions[currentIndex].image) return;
    const adjustImage = () =>
      setFactor(calcFactor(orderedQuestions[currentIndex].width!));
    adjustImage();
    window.addEventListener("resize", adjustImage);
    return () => window?.removeEventListener("resize", adjustImage);
  }, [currentQuestion]);

  if (!isLoaded) return;

  if (showingResults) {
    return (
      <Summary
        title={title}
        questions={questions}
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
      {orderedQuestions[currentIndex].image && factor && (
        <div className="relative">
          <img
            key={currentQuestion}
            src={`${process.env.NEXT_PUBLIC_STATIC_URL}/image/${orderedQuestions[currentIndex].image}`}
            width={orderedQuestions[currentIndex].width! * factor}
            height={orderedQuestions[currentIndex].height! * factor}
            alt="Question"
            loading="eager"
          />
          {orderedQuestions[currentIndex].masks.map(({ id, x, y, w, h }) => (
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
          {orderedQuestions[currentIndex].tapes.map(({ id, x, y, w, h }) => {
            const questionState = answers.tapes.get(id)!;
            const dialoguePosition =
              x * factor + 80 > orderedQuestions[currentIndex].width! * factor
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
                    onTrue={() => updateTapeState(id, QuestionState.TRUE)}
                    onFalse={() => updateTapeState(id, QuestionState.FALSE)}
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
                    if (answers.tapes.get(id) === QuestionState.UNANSWERED) {
                      updateTapeState(id, QuestionState.UNSELECTED);
                    }
                  }}
                ></button>
              </>
            );
          })}
        </div>
      )}
      <ol>
        {orderedQuestions[currentIndex].subQuestions.map(
          ({ id, text, answer }, index) => {
            const questionState = answers.subQuestions.get(id)!;
            return (
              <li key={`question-${id}`}>
                <p className="font-bold">
                  {index + 1}. {text}
                </p>
                {questionState === QuestionState.UNSELECTED && (
                  <SelectAnswerDialogue
                    onTrue={() =>
                      updateWrittenQuestionState(id, QuestionState.TRUE)
                    }
                    onFalse={() =>
                      updateWrittenQuestionState(id, QuestionState.FALSE)
                    }
                  />
                )}
                {questionState !== QuestionState.UNANSWERED ? (
                  <p className={writtenAnswer.get(questionState)}>{answer}</p>
                ) : (
                  <button
                    className="font-bold text-cyan-600"
                    onClick={() =>
                      updateWrittenQuestionState(id, QuestionState.UNSELECTED)
                    }
                  >
                    [...]
                  </button>
                )}
              </li>
            );
          }
        )}
      </ol>
    </QuestionWrapper>
  );
}
