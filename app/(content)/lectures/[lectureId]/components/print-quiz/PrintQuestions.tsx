"use client";

import React from "react";
import { McqQuiz, WrittenQuiz, QuizType } from "@/types";
import HtmlContentClient from "@/components/HtmlContentClient";
import indexToColor from "@/utils/indexToColor";
import toUppercaseLetter from "@/app/(content)/mcq-quizzes/[quizId]/utils/toUppercaseLetter";
import isValidURL from "@/utils/isValidURL";
import CroppedImage from "./CroppedImage";

export default function PrintQuestions({
  quiz,
  type,
  printMode,
}: {
  quiz: McqQuiz | WrittenQuiz;
  type: QuizType;
  printMode: "booklet-with-answers" | "booklet-without-answers" | "study";
}) {
  return (
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
                  <img src={question.image} alt="Question associated diagram" />
                ) : null}
                <ol className="list-[upper-alpha] list-inside">
                  {question.options.map((option, optionIndex) => (
                    <React.Fragment
                      key={`question-${question.id}-option-${optionIndex}`}
                    >
                      <li
                        className={`inline-block ${
                          printMode === "study" &&
                          optionIndex === question.correctOptionIndex
                            ? "bg-yellow-300"
                            : ""
                        }`}
                      >
                        {toUppercaseLetter(optionIndex)}. {option}
                      </li>
                      <br />
                    </React.Fragment>
                  ))}
                </ol>
                {printMode === "study" && question.explanation && (
                  <div className="mt-2 text-sm text-slate-600">
                    <strong>Explanation:</strong>{" "}
                    {isValidURL(question.explanation) ? (
                      <a
                        className="link"
                        href={question.explanation}
                        target="_blank"
                      >
                        {question.explanation}
                      </a>
                    ) : (
                      question.explanation
                    )}
                  </div>
                )}
              </li>
            );
          })
        : (quiz as WrittenQuiz).questions.map((question, questionIndex) => (
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
                            border: "2px solid " + indexToColor(index).hex,
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
                        box covers
                        {printMode === "study" ? (
                          <CroppedImage
                            image={question.image!}
                            x={tape.x}
                            y={tape.y}
                            w={tape.w}
                            h={tape.h}
                            originalWidth={question.width!}
                            className="inline-block align-middle ml-2"
                          />
                        ) : (
                          " ………"
                        )}
                      </li>
                    ))}
                    {question.subQuestions.map((subQuestion, index) => (
                      <li key={`sub-question-${subQuestion.id}`}>
                        <span>
                          {question.subQuestions.length > 1
                            ? `${index + 1}. ${subQuestion.text}`
                            : subQuestion.text}
                        </span>
                        {printMode === "study" ? (
                          <div className="mt-2 pl-4 border-l-2 border-slate-300">
                            <HtmlContentClient html={subQuestion.answer} />
                          </div>
                        ) : (
                          <div className="border-b-2 border-dotted border-slate-400 w-full my-4" />
                        )}
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
                      {printMode === "study" ? (
                        <div className="mt-2 pl-4 border-l-2 border-slate-300">
                          <HtmlContentClient html={subQuestion.answer} />
                        </div>
                      ) : (
                        <div className="border-b-2 border-dotted border-slate-400 w-full my-4" />
                      )}
                    </li>
                  ))}
                </ol>
              )}
            </li>
          ))}
    </ol>
  );
}
