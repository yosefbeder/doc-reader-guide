"use client";

import Button from "@/components/Button";
import useQuestionsDashboard from "@/lib/hooks/useQuestionsDashboard";
import { User, WrittenQuestion } from "@/types";
import React from "react";
import UpdateQuestionForm from "./UpdateQuestionForm";
import { SummaryDetail } from "@/components/SummaryDetail";
import useSettings from "@/lib/hooks/useSettings";
import Toggle from "@/components/Toggle";

export default function QuestionsList({
  user,
  quizId,
  questions,
}: {
  user: User;
  quizId: number;
  questions: WrittenQuestion[];
}) {
  const [{ writtenQuiz: settings }] = useSettings();
  const {
    orderedQuestions,
    questionsOpen,
    setQuestionsOpen,
    currentQuestion,
    setCurrentQuestion,
  } = useQuestionsDashboard(
    questions,
    `written-quiz-${quizId}`,
    settings.shuffle
  );

  return (
    <section>
      <h3 className="mb-4">Update Questions</h3>
      <div className="mb-4">
        <Toggle
          label="Open all questions"
          checked={questionsOpen}
          onChange={() => setQuestionsOpen((prev) => !prev)}
        />
      </div>
      {orderedQuestions.map((question, index) => (
        <div
          key={`written-question-${question.id}`}
          className="max-w-xl mb-4"
          id={`question-${question.id}`}
        >
          {(() => {
            const questionOpen =
              questionsOpen || question.id === currentQuestion;
            return (
              <SummaryDetail
                open={questionOpen}
                toggle={() =>
                  setCurrentQuestion((prev) =>
                    question.id === prev ? undefined : question.id
                  )
                }
              >
                <SummaryDetail.Summary>
                  Question {index + 1}
                </SummaryDetail.Summary>

                <SummaryDetail.Detail>
                  <div className="p-2">
                    <UpdateQuestionForm
                      user={user}
                      quizId={quizId}
                      question={question}
                    />
                  </div>
                </SummaryDetail.Detail>
              </SummaryDetail>
            );
          })()}
        </div>
      ))}
    </section>
  );
}
