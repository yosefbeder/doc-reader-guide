"use client";

import { useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";

import ButtonIcon from "@/components/ButtonIcon";
import { McqQuiz } from "@/types";
import { getMcqQuiz } from "@/utils/getQuizClient";
import Logo from "@/components/Logo";
import isValidURL from "@/utils/isValidURL";

export default function ButtonPrintQuiz({
  id,
  title,
}: {
  id: number;
  title: string;
}) {
  const [quiz, setQuiz] = useState<McqQuiz>();
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
    quiz.questions
      .map(({ explanation }, index) => ({ index, explanation }))
      .filter(({ explanation }) => explanation);

  return (
    <>
      <ButtonIcon
        icon={isLoading ? "arrow-path" : "printer"}
        onClick={() => {
          (async () => {
            if (!quiz) {
              setIsLoading(true);
              try {
                setQuiz(await getMcqQuiz(id));
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
          <h1 className="my-4">{title}</h1>
          <p>
            Solve it online at:{" "}
            <a
              className="link"
              href={`${window.location.origin}/mcq-quizzes/${quiz.id}`}
              target="_blank"
            >
              {window.location.origin}/mcq-quizzes/{quiz.id}
            </a>
          </p>
          <h2 className="my-4">Questions</h2>
          <ol>
            {quiz.questions.map((question, questionIndex) => {
              let skipImage = false;
              if (quiz.questions[questionIndex - 1]?.image === question?.image)
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
                      <li key={`question-${question.id}-option-${optionIndex}`}>
                        {option}
                      </li>
                    ))}
                  </ol>
                </li>
              );
            })}
          </ol>
          <h2 className="my-4">Answers</h2>
          <table className="table-auto">
            <tbody>
              {Array.from({
                length: Math.ceil(quiz.questions.length / 8),
              }).map((_, index) => {
                const start = index * 8;
                const end = start + 8;
                const questionsSlice = quiz.questions.slice(start, end);
                return (
                  <tr key={`row-${index}`}>
                    {questionsSlice.map((question, questionIndex) => {
                      const realQuestionIndex = start + questionIndex;
                      return (
                        <>
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
                                quiz.questions[realQuestionIndex]
                                  .correctOptionIndex
                            )}
                          </td>
                        </>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
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
