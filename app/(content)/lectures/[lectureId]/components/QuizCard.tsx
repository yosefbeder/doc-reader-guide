"use client";

import { useEffect, useState } from "react";
import NextLink from "next/link";

import { Action, QuestionState, Quiz, QuizType, Resource } from "@/types";
import ButtonPrintQuiz from "./ButtonPrintQuiz";
import ButtonIcon from "@/components/ButtonIcon";
import { icons } from "@/components/icons";
import { logEvent } from "@/lib/event-logger";
import getPrefix from "@/utils/getPrefix";
import formatLectureTitle from "@/utils/formatLectureTitle";
import DocReaderBadge from "@/components/DocReaderBadge";

export default function QuizCard({
  quiz,
  type,
  updateable = false,
  showPath = false,
  discardable = false,
  onUpdate,
  onDiscard,
}: {
  quiz: Quiz;
  type: QuizType;
  showPath?: boolean;
  updateable?: boolean;
  discardable?: boolean;
  onUpdate?: () => void;
  onDiscard?: () => void;
}) {
  const [isCompleted, setIsCompleted] = useState(false);
  const [total, setTotal] = useState<number>();
  const [answered, setAnswered] = useState<number>();

  useEffect(() => {
    if (!localStorage.getItem(`${type}-quiz-${quiz.id}`)) return;
    const stored = JSON.parse(localStorage.getItem(`${type}-quiz-${quiz.id}`)!);
    setIsCompleted(stored?.showingResults || stored?.isCompleted);
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
          <div className={isCompleted ? "line-through" : ""}>{quiz.title}</div>
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
                  <sup>{getPrefix(semesterName)}</sup> Semester {">"}{" "}
                  {moduleName} {">"} {subjectName} {">"}{" "}
                  {formatLectureTitle(lectureTitle)}
                </div>
              );
            })()}
          {!isCompleted &&
            typeof answered !== "undefined" &&
            typeof total !== "undefined" &&
            answered > 0 && (
              <div className="caption">
                {answered} / {total} (
                {Math.round((answered / total) * 10000) / 100}%)
              </div>
            )}
          {!showPath && (
            <div className="caption">
              <DocReaderBadge />
            </div>
          )}
        </div>
      </NextLink>
      <ButtonPrintQuiz id={quiz.id} title={quiz.title} type={type} />
      {updateable && (
        <ButtonIcon
          icon="pencil-square"
          onClick={() => onUpdate && onUpdate()}
        />
      )}
      {discardable && !isCompleted && (
        <ButtonIcon
          icon="x-mark"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();

            const key = `${type}-quiz-${quiz.id}`;
            const stored = localStorage.getItem(key);
            if (stored) {
              const data = JSON.parse(stored);
              data.isCompleted = true;
              data.completedAt = Date.now();
              localStorage.setItem(key, JSON.stringify(data));
              setIsCompleted(true);
              if (onDiscard) onDiscard();
            }
          }}
        />
      )}
    </div>
  );
}
