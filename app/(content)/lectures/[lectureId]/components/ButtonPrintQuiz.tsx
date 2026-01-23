"use client";

import React from "react";
import { useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";

import ButtonIcon from "@/components/ButtonIcon";
import { Action, McqQuiz, WrittenQuiz, Resource, QuizType } from "@/types";
import { getMcqQuiz, getWrittenQuiz } from "@/utils/getQuizClient";
import { logEvent } from "@/lib/event-logger";

import PrintMenu from "./print-quiz/PrintMenu";
import PrintHeader from "./print-quiz/PrintHeader";
import PrintQuestions from "./print-quiz/PrintQuestions";
import PrintAnswers from "./print-quiz/PrintAnswers";
import PrintExplanations from "./print-quiz/PrintExplanations";

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
  const [showPrintMenu, setShowPrintMenu] = useState(false);
  const [printMode, setPrintMode] = useState<
    "booklet-with-answers" | "booklet-without-answers" | "study"
  >("booklet-with-answers");

  const contentRef = useRef<HTMLDivElement>(null);

  const anchorRef = useRef<HTMLDivElement>(null);

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
      .filter(
        (item): item is { index: number; explanation: string } =>
          !!item.explanation
      );

  const handlePrint = (
    mode: "booklet-with-answers" | "booklet-without-answers" | "study"
  ) => {
    setPrintMode(mode);
    setShowPrintMenu(false);
    logEvent(
      type === "mcq" ? Resource.MCQ_QUIZ : Resource.WRITTEN_QUIZ,
      id,
      Action.PRINT_QUIZ,
      { mode }
    );
    setTimeout(() => reactToPrintFn(), 500);
  };

  return (
    <div className="relative" ref={anchorRef}>
      <ButtonIcon
        icon={isLoading ? "arrow-path" : "printer"}
        onClick={() => {
          (async () => {
            if (!quiz) {
              setIsLoading(true);
              try {
                if (type === "mcq") setQuiz(await getMcqQuiz(id));
                else setQuiz(await getWrittenQuiz(id));
                setShowPrintMenu(true);
              } catch (error) {
                alert(error);
              }
              setIsLoading(false);
            } else {
              setShowPrintMenu((prev) => !prev);
            }
          })();
        }}
        disabled={isLoading}
      />
      {showPrintMenu && (
        <PrintMenu
          anchorRef={anchorRef}
          onPrint={handlePrint}
          onClose={() => setShowPrintMenu(false)}
        />
      )}

      {quiz && quiz.questions && (
        <div ref={contentRef} className="print-section print-only">
          <PrintHeader
            title={title}
            printMode={printMode}
            quizId={quiz.id}
            type={type}
          />
          <h2 className="my-4">Questions</h2>
          <PrintQuestions quiz={quiz} type={type} printMode={printMode} />
          {printMode === "booklet-with-answers" && (
            <PrintAnswers quiz={quiz} type={type} />
          )}
          {printMode === "booklet-with-answers" &&
            explanations &&
            explanations.length > 0 && (
              <PrintExplanations explanations={explanations} />
            )}
        </div>
      )}
    </div>
  );
}
