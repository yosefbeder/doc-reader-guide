"use client";

import React, { useState } from "react";

import { SummaryDetail } from "@/components/SummaryDetail";
import { WrittenQuestion } from "@/types";
import AddQuestionForm from "./AddQuestionForm";
import WrittenTemplates from "@/components/WrittenTemplates";
import QuickAddForm from "./QuickAddForm";
import ButtonCopy from "@/app/(content)/mcq-quizzes/[quizId]/update/components/ButtonCopy";
import cleanWrittenQuestion from "@/utils/cleanWrittenQuestion";

export default function AddSection({
  quizId,
  questions,
}: {
  quizId: number;
  questions: WrittenQuestion[];
}) {
  const [openSection, setOpenSection] = useState<string | undefined>();

  return (
    <>
      <ButtonCopy
        text={JSON.stringify(
          questions.map((question) => cleanWrittenQuestion(question))
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
            <div className="floating flex flex-col gap-4">
              <h3>Templates</h3>
              <WrittenTemplates />
              <h3>Form</h3>
              <QuickAddForm quizId={quizId} />
            </div>
          </div>
        </SummaryDetail.Detail>
      </SummaryDetail>
    </>
  );
}
