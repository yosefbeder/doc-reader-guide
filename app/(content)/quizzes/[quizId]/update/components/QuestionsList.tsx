"use client";

import { Question } from "@/types";
import UpdateQuestionForm from "./UpdateQuestionForm";
import { icons } from "@/components/icons";
import Button from "@/components/Button";
import useQuestionsDashboard from "@/lib/hooks/useQuestionsDashboard";

export default function QuestionsList({
  quizId,
  questions,
}: {
  questions: Question[];
  quizId: number;
}) {
  const {
    orderedQuestions,
    questionsOpen,
    setQuestionsOpen,
    currentQuestion,
    setCurrentQuestion,
  } = useQuestionsDashboard(questions, `quiz-${quizId}-new`, false);

  return (
    <section>
      <h2 className="mb-4">Update Questions</h2>
      <Button
        onClick={() => setQuestionsOpen((prev) => !prev)}
        className="mb-4"
      >
        {questionsOpen ? "Show Only Current Question" : "Show All Questions"}
      </Button>
      {orderedQuestions.map((question, index) => (
        <div
          key={question.id}
          className="max-w-lg mb-4"
          id={`question-${question.id}`}
        >
          {(() => {
            const questionOpen =
              questionsOpen || question.id === currentQuestion;
            return (
              <div className="overflow-hidden rounded-xl bg-slate-50">
                <button
                  onClick={() =>
                    setCurrentQuestion((prev) =>
                      question.id === prev ? undefined : question.id
                    )
                  }
                  className={`w-full text-left flex items-center gap-2 p-2 rounded-b-xl ${
                    questionOpen
                      ? "bg-cyan-600 hover:bg-cyan-700 text-white"
                      : "hover:bg-slate-100"
                  } transition-colors`}
                >
                  {questionOpen
                    ? icons["chevron-down"]
                    : icons["chevron-right"]}
                  Question {index + 1}
                </button>
                {questionOpen && (
                  <div className="p-2">
                    <UpdateQuestionForm quizId={+quizId} question={question} />
                  </div>
                )}
              </div>
            );
          })()}
        </div>
      ))}
    </section>
  );
}
