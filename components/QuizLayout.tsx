"use client";

import React, { useState } from "react";
import { AnimatePresence, motion, useDragControls } from "framer-motion";

import { DatabaseTable, Quiz, QuizType } from "@/types";
import Button from "./Button";
import { icons } from "./icons";
import QuizNav from "./QuizNav";

interface QuestionWrapperProps<T extends DatabaseTable> {
  type: QuizType;
  quiz: Quiz;
  questions: T[];
  currentQuestion: number;
  goToQuestion: (id: number) => void;
  currentIndex: number;
  backQuestion: () => void;
  nextQuestion: () => void;
  endQuiz: () => void;
  children: React.ReactNode;
  onCopy?: () => Promise<void> | void;
  onShare?: () => Promise<void> | void;
}

export default function QuizLayout<T extends DatabaseTable>({
  type,
  quiz,
  questions,
  currentQuestion,
  goToQuestion,
  currentIndex,
  backQuestion,
  nextQuestion,
  endQuiz,
  children,
  onCopy,
  onShare,
}: QuestionWrapperProps<T>) {
  const [copied, setCopied] = useState(false);

  const [tuple, setTuple] = useState([currentIndex, currentIndex]);
  const dragControls = useDragControls();

  if (tuple[1] !== currentIndex) {
    setTuple([tuple[1], currentIndex]);
  }

  const prev = tuple[0];
  const direction = currentIndex > prev ? 1 : currentIndex < prev ? -1 : 0;

  return (
    <>
      <QuizNav
        title={quiz.title}
        progress={(currentIndex + 1) / questions.length}
        lectureId={quiz.lectureData.id}
      />
      <div
        className="max-w-2xl mx-auto px-2 pt-4 pb-[72px] col overflow-x-hidden relative touch-pan-y min-h-[calc(100dvh-150px)]"
        onPointerDown={(e) => dragControls.start(e)}
      >
        <div className="flex justify-between items-center">
          <span className="caption text-base">
            Question{" "}
            <select
              onChange={(e) => goToQuestion(+e.target.value)}
              value={currentQuestion}
            >
              {questions.map(({ id }, index) => (
                <option key={id} value={id}>
                  {index + 1}
                </option>
              ))}
            </select>{" "}
            of {questions.length}
          </span>
          <div className="flex items-center gap-4">
            {onCopy && (
              <button
                onClick={async () => {
                  await onCopy();
                  setCopied(true);
                  setTimeout(() => setCopied(false), 2000);
                }}
              >
                {copied ? icons["check"] : icons["clipboard-document-list"]}
              </button>
            )}
            {onShare && <button onClick={onShare}>{icons["share"]}</button>}
          </div>
        </div>
        <AnimatePresence mode="popLayout" custom={direction}>
          <motion.div
            key={currentQuestion}
            custom={direction}
            variants={{
              enter: (direction: number) => ({
                x: direction > 0 ? "100%" : direction < 0 ? "-100%" : 0,
                opacity: 0,
              }),
              center: {
                x: 0,
                opacity: 1,
              },
              exit: (direction: number) => ({
                x: direction < 0 ? "100%" : direction > 0 ? "-100%" : 0,
                opacity: 0,
              }),
            }}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              ease: "easeOut",
              duration: 0.15,
            }}
            drag="x"
            dragControls={dragControls}
            dragListener={false}
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={1}
            onDragEnd={(e, { offset, velocity }) => {
              const swipe = Math.abs(offset.x) * velocity.x;
              if (swipe < -10000) {
                if (currentIndex < questions.length - 1) nextQuestion();
              } else if (swipe > 10000) {
                if (currentIndex > 0) backQuestion();
              }
            }}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </div>
      <div className="w-full quiz-main fixed bottom-0 left-1/2 -translate-x-1/2 flex justify-between items-center bg-white dark:bg-slate-900 max-sm:gap-2">
        <Button
          onClick={backQuestion}
          color="white"
          className="flex gap-2 items-center max-sm:w-1/2 max-sm:justify-center"
          disabled={currentIndex === 0}
        >
          {icons["arrow-left"]}
          Back
        </Button>
        {currentIndex === 0 ? (
          <p className="caption max-sm:hidden">
            Press {type === "mcq" ? "number keys to answer, " : ""}← / → to
            navigate
          </p>
        ) : null}
        {currentIndex === questions.length - 1 ? (
          <Button
            onClick={endQuiz}
            className="flex gap-2 items-center max-sm:w-1/2 max-sm:justify-center"
          >
            End
            {icons["chart-pie"]}
          </Button>
        ) : (
          <Button
            onClick={nextQuestion}
            disabled={currentIndex === questions.length - 1}
            className="flex gap-2 items-center max-sm:w-1/2 max-sm:justify-center"
          >
            Next
            {icons["arrow-right"]}
          </Button>
        )}
      </div>
    </>
  );
}
