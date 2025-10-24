"use client";

import useQuestionsDashboard from "@/lib/hooks/useQuestionsDashboard";
import { User, WrittenQuestion } from "@/types";
import React from "react";
import UpdateQuestionForm from "./UpdateQuestionForm";
import { SummaryDetail } from "@/components/SummaryDetail";
import useSettings from "@/lib/hooks/useSettings";
import AddSection from "./AddSection";
import { useSelectQuestions } from "@/lib/hooks/useSelectQuestions";
import QuestionsListToolbar from "@/components/QuestionsListToolbar";
import Checkbox from "@/components/Checkbox";

export default function QuestionsList({
  user,
  quizId,
  questions,
}: {
  user: User;
  quizId: number;
  questions: WrittenQuestion[];
}) {
  console.log(questions);
  const {
    settings: { writtenQuiz: settings },
  } = useSettings();
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
  const { selectedQuestions, handleCheckbox, ...rest } = useSelectQuestions({
    type: "written",
    quizId,
    questions: orderedQuestions,
  });

  return (
    <main className="main col">
      <AddSection quizId={quizId} />
      <hr />
      <section>
        <h3 className="mb-4">Update Questions</h3>
        <QuestionsListToolbar
          questionsOpen={questionsOpen}
          toggleQuestionsOpen={() => setQuestionsOpen((prev) => !prev)}
          selectedQuestions={selectedQuestions}
          {...rest}
        />
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
                <div className={`flex gap-2 ${questionOpen ? "flex-col" : ""}`}>
                  <Checkbox
                    color="cyan"
                    checked={selectedQuestions.includes(question.id)}
                    onChange={(e) =>
                      handleCheckbox(question.id, e.target.checked)
                    }
                  />
                  <SummaryDetail
                    className="grow"
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

                    <SummaryDetail.Detail optimizeForSEO={false}>
                      <div className="p-2">
                        <UpdateQuestionForm
                          user={user}
                          quizId={quizId}
                          question={question}
                        />
                      </div>
                    </SummaryDetail.Detail>
                  </SummaryDetail>
                </div>
              );
            })()}
          </div>
        ))}
      </section>
    </main>
  );
}
