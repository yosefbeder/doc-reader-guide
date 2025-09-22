"use client";

import React, { useState } from "react";

import { SummaryDetail } from "@/components/SummaryDetail";
import AddQuestionForm from "./AddQuestionForm";
import WrittenTemplates from "@/components/WrittenTemplates";
import QuickAddForm from "./QuickAddForm";

export default function AddSection({ quizId }: { quizId: number }) {
  const [openSection, setOpenSection] = useState<string | undefined>();

  return (
    <>
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
            <div className="col">
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
