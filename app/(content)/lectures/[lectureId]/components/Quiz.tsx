"use client";

import { useEffect, useState } from "react";
import NextLink from "next/link";
import Image from "next/image";

import { QuestionState, Quiz as QuizType } from "@/types";
import ButtonPrintQuiz from "./ButtonPrintQuiz";
import LogoImage from "@/public/logo.png";
import ButtonIcon from "@/components/ButtonIcon";
import { icons } from "@/components/icons";

export default function Quiz({
  quiz,
  type,
  printable = false,
  updateable = false,
  onUpdate,
}: {
  quiz: QuizType;
  type: "mcq" | "written";
  printable?: boolean;
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
    <div className="flex items-center gap-2 floating">
      <NextLink
        href={`/${type === "mcq" ? "mcq-quizzes" : "written-quizzes"}/${
          quiz.id
        }`}
        className="grow flex items-center gap-2"
      >
        <span>{type === "mcq" ? icons["queue-list"] : icons["pencil"]}</span>
        <div>
          <div className={showingResults ? "line-through" : ""}>
            {quiz.title}
          </div>
          {!showingResults &&
            typeof answered !== "undefined" &&
            typeof total !== "undefined" && (
              <div className="text-sm">
                {answered} / {total} (
                {Math.round((answered / total) * 10000) / 100}%)
              </div>
            )}
          <div className="flex items-center gap-1 text-sm">
            <div className="text-slate-700">Presented by</div>
            <Image src={LogoImage} className="w-3" alt="Logo" />
            <div className="text-cyan-700 font-extrabold">DocReader Guide</div>
          </div>
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
