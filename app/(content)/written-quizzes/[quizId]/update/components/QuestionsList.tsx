"use client";

import Button from "@/components/Button";
import useQuestionsDashboard from "@/lib/hooks/useQuestionsDashboard";
import { WrittenQuestion } from "@/types";
import React from "react";
import UpdateQuestionForm from "./UpdateQuestionForm";
import { SummaryDetail } from "@/components/SummaryDetail";

export default function QuestionsList({
  quizId,
  questions,
}: {
  quizId: number;
  questions: WrittenQuestion[];
}) {
  const {
    orderedQuestions,
    questionsOpen,
    setQuestionsOpen,
    currentQuestion,
    setCurrentQuestion,
  } = useQuestionsDashboard(questions, `written-quiz-${quizId}`, true);

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
                    <UpdateQuestionForm quizId={quizId} question={question} />
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
