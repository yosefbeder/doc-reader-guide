"use client";

import React, { useState } from "react";

import { SummaryDetail } from "@/components/SummaryDetail";
import AddLinkForm from "./AddLinkForm";
import McqTemplates from "@/components/McqTemplates";
import AddMcqQuizForm from "./AddMcqQuizForm";
import AddWrittenQuizForm from "./AddWrittenQuizForm";
import WrittenTemplates from "@/components/WrittenTemplates";
import ImportSourcesForm from "./ImportSourcesForm";

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
              <McqTemplates />
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
            <div className="floating flex flex-col gap-4">
              <h3>Templates</h3>
              <WrittenTemplates />
              <h3>Form</h3>
              <AddWrittenQuizForm lectureId={lectureId} />
            </div>
          </div>
        </SummaryDetail.Detail>
      </SummaryDetail>
      <SummaryDetail
        open={openSection === "import"}
        toggle={() =>
          setOpenSection((prev) => (prev === "import" ? undefined : "import"))
        }
      >
        <SummaryDetail.Summary>Import</SummaryDetail.Summary>
        <SummaryDetail.Detail>
          <div className="p-2">
            <ImportSourcesForm lectureId={lectureId} />
          </div>
        </SummaryDetail.Detail>
      </SummaryDetail>
    </>
  );
}
