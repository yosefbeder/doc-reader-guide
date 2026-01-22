"use client";

import { useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";

import ButtonIcon from "@/components/ButtonIcon";
import { Action, McqQuiz, WrittenQuiz, Resource, QuizType } from "@/types";
import { getMcqQuiz, getWrittenQuiz } from "@/utils/getQuizClient";
import Logo from "@/components/Logo";
import isValidURL from "@/utils/isValidURL";
import { logEvent } from "@/lib/event-logger";
import HtmlContentClient from "@/components/HtmlContentClient";
import React from "react";
import indexToColor from "@/utils/indexToColor";

export default function ButtonPrintQuiz({
  id,
  title,
  type,
}: {
  id: number;
  title: string;
  type: QuizType;
}) {
  const [quiz, setQuiz] = useState<McqQuiz | WrittenQuiz>();
  const [isLoading, setIsLoading] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
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
  const explanations =
    quiz &&
    type === "mcq" &&
    (quiz as McqQuiz).questions
      .map(({ explanation }, index) => ({ index, explanation }))
      .filter(({ explanation }) => explanation);

  return (
    <>
      <ButtonIcon
        icon={isLoading ? "arrow-path" : "printer"}
        onClick={() => {
          (async () => {
            logEvent(
              type === "mcq" ? Resource.MCQ_QUIZ : Resource.WRITTEN_QUIZ,
              id,
              Action.PRINT_QUIZ,
              {}
            );
            if (!quiz) {
              setIsLoading(true);
              try {
                if (type === "mcq") setQuiz(await getMcqQuiz(id));
                else setQuiz(await getWrittenQuiz(id));
                setTimeout(() => reactToPrintFn(), 1000);
              } catch (error) {
                alert(error);
              }
              setIsLoading(false);
            } else reactToPrintFn();
          })();
        }}
        disabled={isLoading}
      />
      {quiz && quiz.questions && (
        <div ref={contentRef} className="print-section print-only">
          <Logo />
          <h1 className="h1 my-4">{title}</h1>
          <p>
            Solve it online at:{" "}
            <a
              className="link"
              href={`${window.location.origin}/${type}-quizzes/${quiz.id}`}
              target="_blank"
            >
              {window.location.origin}/{type}-quizzes/{quiz.id}
            </a>
          </p>
          <h2 className="my-4">Questions</h2>
          <ol>
            {type === "mcq"
              ? (quiz as McqQuiz).questions.map((question, questionIndex) => {
                  let skipImage = false;
                  if (
                    (quiz as McqQuiz).questions[questionIndex - 1]?.image ===
                    question?.image
                  )
                    skipImage = true;
                  return (
                    <li key={`question-${question.id}-image`}>
                      <span className="font-bold">
                        {questionIndex + 1}. {question.text}
                      </span>
                      {question.image && !skipImage ? (
                        <img
                          src={question.image}
                          alt="Question associated diagram"
                        />
                      ) : null}
                      <ol className="list-[upper-alpha] list-inside">
                        {question.options.map((option, optionIndex) => (
                          <li
                            key={`question-${question.id}-option-${optionIndex}`}
                          >
                            {option}
                          </li>
                        ))}
                      </ol>
                    </li>
                  );
                })
              : (quiz as WrittenQuiz).questions.map(
                  (question, questionIndex) => (
                    <li key={`question-${question.id}`}>
                      <h3 className="my-4">Question {questionIndex + 1}</h3>
                      {question.image ? (
                        <div className="flex gap-4 my-4">
                          <div className="relative w-80">
                            <img
                              src={`${process.env.NEXT_PUBLIC_STATIC_URL}/image/${question.image}`}
                              alt="Question associated diagram"
                            />
                            {question.tapes.map((tape, index) => {
                              const factor = 320 / question.width!;

                              return (
                                <div
                                  key={`tape-${tape.id}`}
                                  style={{
                                    position: "absolute",
                                    left: tape.x * factor,
                                    top: tape.y * factor,
                                    width: tape.w * factor,
                                    height: tape.h * factor,
                                    backgroundColor: indexToColor(index).hex,
                                    border:
                                      "2px solid " + indexToColor(index).hex,
                                  }}
                                />
                              );
                            })}
                            {question.masks.map((mask, index) => {
                              const factor = 320 / question.width!;
                              return (
                                <div
                                  key={`mask-${mask.id}`}
                                  className="border-2 border-slate-700 bg-white"
                                  style={{
                                    position: "absolute",
                                    left: mask.x * factor,
                                    top: mask.y * factor,
                                    width: mask.w * factor,
                                    height: mask.h * factor,
                                  }}
                                />
                              );
                            })}
                          </div>
                          <ul className="flex-1 flex flex-col gap-2">
                            {question.tapes.map((tape, index) => (
                              <li key={`tape-${tape.id}`}>
                                <span
                                  style={{
                                    color: indexToColor(index).hex,
                                  }}
                                >
                                  {indexToColor(index).name}
                                </span>{" "}
                                box covers ………
                              </li>
                            ))}
                            {question.subQuestions.map((subQuestion, index) => (
                              <li key={`sub-question-${subQuestion.id}`}>
                                <span className="font-bold">
                                  {question.subQuestions.length > 1
                                    ? `${index + 1}. ${subQuestion.text}`
                                    : subQuestion.text}
                                </span>
                                <div className="border-b-2 border-dotted border-slate-400 w-full my-4" />
                              </li>
                            ))}
                          </ul>
                        </div>
                      ) : (
                        <ol className="list-inside">
                          {question.subQuestions.map((subQuestion, index) => (
                            <li key={`sub-question-${subQuestion.id}`}>
                              <span className="font-bold">
                                {question.subQuestions.length > 1
                                  ? `${index + 1}. ${subQuestion.text}`
                                  : subQuestion.text}
                              </span>
                              <div className="border-b-2 border-dotted border-slate-400 w-full my-4" />
                            </li>
                          ))}
                        </ol>
                      )}
                    </li>
                  )
                )}
          </ol>
          <h2 className="my-4">Answers</h2>
          {type === "mcq" ? (
            <table className="table-auto">
              <tbody>
                {Array.from({
                  length: Math.ceil((quiz as McqQuiz).questions.length / 8),
                }).map((_, index) => {
                  const start = index * 8;
                  const end = start + 8;
                  const questionsSlice = (quiz as McqQuiz).questions.slice(
                    start,
                    end
                  );
                  return (
                    <tr key={`row-${index}`}>
                      {questionsSlice.map((question, questionIndex) => {
                        const realQuestionIndex = start + questionIndex;
                        return (
                          <React.Fragment
                            key={`question-${question.id}-column-${realQuestionIndex}`}
                          >
                            <td
                              key={`question-${question.id}-column`}
                              className="bg-slate-50"
                            >
                              {realQuestionIndex + 1}{" "}
                              {question.explanation ? "*" : ""}
                            </td>
                            <td key={`question-${question.id}-answer-column`}>
                              {String.fromCharCode(
                                65 +
                                  (quiz as McqQuiz).questions[realQuestionIndex]
                                    .correctOptionIndex
                              )}
                            </td>
                          </React.Fragment>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          ) : (
            (quiz as WrittenQuiz).questions.map((question, questionIndex) => (
              <>
                <h3 className="my-4">Question {questionIndex + 1}</h3>
                {question.image ? (
                  <div className="flex gap-4 my-4">
                    <div className="relative w-80">
                      <img
                        src={`${process.env.NEXT_PUBLIC_STATIC_URL}/image/${question.image}`}
                        alt="Question associated diagram"
                      />
                      {question.tapes.map((tape, index) => {
                        const factor = 320 / question.width!;
                        return (
                          <div
                            key={`tape-${tape.id}`}
                            style={{
                              position: "absolute",
                              width: tape.w * factor,
                              height: tape.h * factor,
                              top: tape.y * factor,
                              left: tape.x * factor,
                              border: "2px solid " + indexToColor(index).hex,
                            }}
                          ></div>
                        );
                      })}
                    </div>
                    <ol>
                      {question.subQuestions.map((subQuestion, index) => (
                        <li
                          key={`sub-question-${subQuestion.id}-answer`}
                          className="flex gap-2"
                        >
                          {question.subQuestions.length > 1
                            ? `${index + 1}. `
                            : null}
                          <HtmlContentClient html={subQuestion.answer} />
                        </li>
                      ))}
                    </ol>
                  </div>
                ) : (
                  <ol>
                    {question.subQuestions.map((subQuestion, index) => (
                      <li
                        key={`sub-question-${subQuestion.id}-answer`}
                        className="flex gap-2"
                      >
                        {question.subQuestions.length > 1
                          ? `${index + 1}. `
                          : null}
                        <HtmlContentClient html={subQuestion.answer} />
                      </li>
                    ))}
                  </ol>
                )}
              </>
            ))
          )}
          {explanations && explanations.length > 0 && (
            <>
              <h2 className="my-4">Explanations</h2>
              <ul>
                {explanations.map(({ index, explanation }) => (
                  <li key={`explanation-${index}`}>
                    {index + 1}.{" "}
                    {isValidURL(explanation!) ? (
                      <a className="link" href={explanation} target="_blank">
                        {explanation}
                      </a>
                    ) : (
                      explanation
                    )}
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      )}
    </>
  );
}
