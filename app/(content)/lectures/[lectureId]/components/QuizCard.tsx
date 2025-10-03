"use client";

import { useEffect, useState } from "react";
import NextLink from "next/link";
import Image from "next/image";

import { Action, QuestionState, Quiz, QuizType, Resource } from "@/types";
import ButtonPrintQuiz from "./ButtonPrintQuiz";
import LogoImage from "@/public/logo.png";
import ButtonIcon from "@/components/ButtonIcon";
import { icons } from "@/components/icons";
import { logEvent } from "@/lib/event-logger";
import getPrefix from "@/utils/getPrefix";

export default function QuizCard({
  quiz,
  type,
  printable = false,
  updateable = false,
  showPath = false,
  onUpdate,
}: {
  quiz: Quiz;
  type: QuizType;
  printable?: boolean;
  showPath?: boolean;
  updateable?: boolean;
  onUpdate?: () => void;
}) {
  const [showingResults, setShowingResults] = useState(false);
  const [total, setTotal] = useState<number>();
  const [answered, setAnswered] = useState<number>();

  useEffect(() => {
    if (!localStorage.getItem(`${type}-quiz-${quiz.id}`)) return;
    const stored = JSON.parse(localStorage.getItem(`${type}-quiz-${quiz.id}`)!);
    setShowingResults(stored?.showingResults);
    if (type === "mcq") {
      setTotal(stored?.questionsOrder.length);
      setAnswered(stored?.answers.length);
    } else {
      const answers = JSON.parse(stored.answers || "{}");
      const tapes = new Map(answers.tapes);
      const subQuestions = new Map(answers.subQuestions);
      setTotal(tapes.size + subQuestions.size);
      let counter = 0;
      tapes.forEach(
        (value: any) => value !== QuestionState.UNANSWERED && counter++
      );
      subQuestions.forEach(
        (value: any) => value !== QuestionState.UNANSWERED && counter++
      );
      setAnswered(counter);
    }
  }, []);

  return (
    <div className="flex items-center gap-2 p-2 rounded-xl layer-1 clickable">
      <NextLink
        href={`/${type === "mcq" ? "mcq-quizzes" : "written-quizzes"}/${
          quiz.id
        }`}
        className="grow flex items-center gap-2"
        onClick={() =>
          logEvent(
            type === "mcq" ? Resource.MCQ_QUIZ : Resource.WRITTEN_QUIZ,
            quiz.id,
            Action.NAVIGATE,
            {}
          )
        }
      >
        <span>{type === "mcq" ? icons["queue-list"] : icons["pencil"]}</span>
        <div>
          <div className={showingResults ? "line-through" : ""}>
            {quiz.title}
          </div>
          {showPath &&
            (() => {
              const {
                lectureData: {
                  title: lectureTitle,
                  subject: {
                    name: subjectName,
                    module: { name: moduleName, semesterName },
                  },
                },
              } = quiz;
              return (
                <div className="caption">
                  {semesterName}
                  <sup>{getPrefix(semesterName)}</sup> Semester → {moduleName}→{" "}
                  {subjectName}→ {lectureTitle}
                </div>
              );
            })()}
          {!showingResults &&
            typeof answered !== "undefined" &&
            typeof total !== "undefined" && (
              <div className="caption">
                {answered} / {total} (
                {Math.round((answered / total) * 10000) / 100}%)
              </div>
            )}
          {!showPath && (
            <div className="flex items-center gap-1 caption">
              <div>Presented by</div>
              <Image src={LogoImage} className="w-3" alt="Logo" />
              <div className="text-cyan-700 dark:text-cyan-500 font-extrabold">
                DocReader Guide
              </div>
            </div>
          )}
        </div>
      </NextLink>
      {printable && <ButtonPrintQuiz id={quiz.id} title={quiz.title} />}
      {updateable && (
        <ButtonIcon
          icon="pencil-square"
          onClick={() => onUpdate && onUpdate()}
        />
      )}
    </div>
  );
}
