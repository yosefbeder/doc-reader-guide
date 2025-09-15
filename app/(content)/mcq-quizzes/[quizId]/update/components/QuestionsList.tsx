"use client";

import React from "react";
import { McqQuestion, User } from "@/types";
import UpdateQuestionForm from "./UpdateQuestionForm";
import useQuestionsDashboard from "@/lib/hooks/useQuestionsDashboard";
import { SummaryDetail } from "@/components/SummaryDetail";
import useSettings from "@/lib/hooks/useSettings";
import Toggle from "@/components/Toggle";
import AddSection from "./AddSection";
import Button from "@/components/Button";
import Checkbox from "@/components/Checkbox";
import { useSelectQuestions } from "@/lib/hooks/useSelectQuestions";
import QuestionsListToolbar from "@/components/QuestionsListToolbar";

export default function QuestionsList({
  user,
  quizId,
  questions,
}: {
  user: User;
  questions: McqQuestion[];
  quizId: number;
}) {
  const {
    settings: { mcqQuiz: settings },
  } = useSettings();
  const {
    orderedQuestions,
    questionsOpen,
    setQuestionsOpen,
    currentQuestion,
    setCurrentQuestion,
  } = useQuestionsDashboard(questions, `mcq-quiz-${quizId}`, settings.shuffle);
  const { selectedQuestions, handleCheckbox, ...rest } = useSelectQuestions({
    type: "mcq",
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
            key={question.id}
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
                    <SummaryDetail.Detail>
                      <div className="p-2">
                        <UpdateQuestionForm
                          user={user}
                          quizId={+quizId}
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
