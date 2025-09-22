"use client";

import React, { useState } from "react";

import { SummaryDetail } from "@/components/SummaryDetail";
import AddLinkForm from "./AddLinkForm";
import McqTemplates from "@/components/McqTemplates";
import AddQuizForm from "./AddQuizForm";
import WrittenTemplates from "@/components/WrittenTemplates";
import ImportSourcesForm from "./ImportSourcesForm";

export default function AddSection({
  lectureId,
  yearId,
}: {
  lectureId: number;
  yearId: number;
}) {
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
            <AddLinkForm lectureId={lectureId} yearId={yearId} />
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
            <div className="layer-1-form col">
              <h3>Templates</h3>
              <McqTemplates />
              <h3>Form</h3>
              <AddQuizForm type="mcq" lectureId={lectureId} yearId={yearId} />
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
            <div className="layer-1-form col">
              <h3>Templates</h3>
              <WrittenTemplates />
              <h3>Form</h3>
              <AddQuizForm
                type="written"
                lectureId={lectureId}
                yearId={yearId}
              />
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
