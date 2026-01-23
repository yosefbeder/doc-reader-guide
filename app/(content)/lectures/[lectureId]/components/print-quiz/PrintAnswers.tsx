"use client";

import React from "react";
import { McqQuiz, WrittenQuiz, QuizType } from "@/types";
import HtmlContentClient from "@/components/HtmlContentClient";
import indexToColor from "@/utils/indexToColor";
import CroppedImage from "./CroppedImage";

export default function PrintAnswers({
  quiz,
  type,
}: {
  quiz: McqQuiz | WrittenQuiz;
  type: QuizType;
}) {
  return (
    <>
      <h2 className="my-4">Answers</h2>
      <p className="caption my-4">
        Disclaimer: This quiz was printed on {new Date().toLocaleDateString()}.
        Answers may have changed since then.
      </p>
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
          <React.Fragment key={`answer-${question.id}`}>
            <h3 className="my-4">Question {questionIndex + 1}</h3>
            {question.image && question.tapes.length > 0 ? (
              <div className="flex gap-4 my-4">
                <div className="flex flex-col gap-2 w-80">
                  {question.tapes.map((tape, index) => (
                    <div
                      key={`tape-${tape.id}`}
                      className="flex items-center gap-2"
                    >
                      <span
                        className="shrink-0"
                        style={{ color: indexToColor(index).hex }}
                      >
                        {indexToColor(index).name}
                      </span>
                      <CroppedImage
                        image={question.image!}
                        x={tape.x}
                        y={tape.y}
                        w={tape.w}
                        h={tape.h}
                        originalWidth={question.width!}
                      />
                    </div>
                  ))}
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
                    {question.subQuestions.length > 1 ? `${index + 1}. ` : null}
                    <HtmlContentClient html={subQuestion.answer} />
                  </li>
                ))}
              </ol>
            )}
          </React.Fragment>
        ))
      )}
    </>
  );
}
