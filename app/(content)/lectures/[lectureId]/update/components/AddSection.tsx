"use client";

import React, { useState } from "react";

import { SummaryDetail } from "@/components/SummaryDetail";
import AddLinkForm from "./AddLinkForm";
import Templates from "@/components/Templates";
import AddMcqQuizForm from "./AddMcqQuizForm";
import AddWrittenQuizForm from "./AddWrittenQuizForm";

export default function AddSection({ lectureId }: { lectureId: number }) {
  const [openSection, setOpenSection] = useState<string | undefined>();

  return (
    <>
      <SummaryDetail
        open={openSection === "addLink"}
        toggle={() =>
          setOpenSection((prev) => (prev === "addLink" ? undefined : "addLink"))
        }
      >
        <SummaryDetail.Summary>Add Link</SummaryDetail.Summary>
        <SummaryDetail.Detail>
          <div className="p-2">
            <AddLinkForm lectureId={lectureId} />
          </div>
        </SummaryDetail.Detail>
      </SummaryDetail>

      <SummaryDetail
        open={openSection === "addMcq"}
        toggle={() =>
          setOpenSection((prev) => (prev === "addMcq" ? undefined : "addMcq"))
        }
      >
        <SummaryDetail.Summary>Add MCQ Quiz</SummaryDetail.Summary>
        <SummaryDetail.Detail>
          <div className="p-2">
            <div className="floating flex flex-col gap-4">
              <h3>Templates</h3>
              <Templates />
              <h3>Form</h3>
              <AddMcqQuizForm lectureId={lectureId} />
            </div>
          </div>
        </SummaryDetail.Detail>
      </SummaryDetail>

      <SummaryDetail
        open={openSection === "addWritten"}
        toggle={() =>
          setOpenSection((prev) =>
            prev === "addWritten" ? undefined : "addWritten"
          )
        }
      >
        <SummaryDetail.Summary>Add Written Quiz</SummaryDetail.Summary>
        <SummaryDetail.Detail>
          <div className="p-2">
            <AddWrittenQuizForm lectureId={lectureId} />
          </div>
        </SummaryDetail.Detail>
      </SummaryDetail>
    </>
  );
}
