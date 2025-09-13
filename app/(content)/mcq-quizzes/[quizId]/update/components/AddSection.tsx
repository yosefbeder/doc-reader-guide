"use client";

import React, { useState } from "react";

import { SummaryDetail } from "@/components/SummaryDetail";
import ButtonCopy from "./ButtonCopy";
import { McqQuestion, McqQuiz } from "@/types";
import AddQuestionForm from "./AddQuestionForm";
import McqTemplates from "@/components/McqTemplates";
import QuickAddForm from "./QuickAddForm";

export default function AddSection({
  quizId,
  questions,
}: {
  quizId: number;
  questions: McqQuestion[];
}) {
  const [openSection, setOpenSection] = useState<string | undefined>();

  return (
    <>
      <ButtonCopy
        text={JSON.stringify(
          questions.map(
            ({
              id,
              createdAt,
              updatedAt,
              quizId,
              image,
              explanation,
              ...rest
            }: any) => ({
              image: image || undefined,
              explanation: explanation || undefined,
              ...rest,
            })
          )
        )}
      />

      <SummaryDetail
        className="max-w-xl"
        open={openSection === "newQuestion"}
        toggle={() =>
          setOpenSection((prev) =>
            prev === "newQuestion" ? undefined : "newQuestion"
          )
        }
      >
        <SummaryDetail.Summary>New Question</SummaryDetail.Summary>
        <SummaryDetail.Detail>
          <div className="p-2">
            <AddQuestionForm quizId={quizId} />
          </div>
        </SummaryDetail.Detail>
      </SummaryDetail>

      <SummaryDetail
        className="max-w-xl"
        open={openSection === "quickAdd"}
        toggle={() =>
          setOpenSection((prev) =>
            prev === "quickAdd" ? undefined : "quickAdd"
          )
        }
      >
        <SummaryDetail.Summary>Quick Add</SummaryDetail.Summary>
        <SummaryDetail.Detail>
          <div className="p-2">
            <div className="floating col">
              <h3>Templates</h3>
              <McqTemplates />
              <h3>Form</h3>
              <QuickAddForm quizId={quizId} />
            </div>
          </div>
        </SummaryDetail.Detail>
      </SummaryDetail>
    </>
  );
}
