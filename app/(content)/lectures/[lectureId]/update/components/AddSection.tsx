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
        open={openSection === "newLink"}
        toggle={() =>
          setOpenSection((prev) => (prev === "newLink" ? undefined : "newLink"))
        }
      >
        <SummaryDetail.Summary>New link</SummaryDetail.Summary>
        <SummaryDetail.Detail>
          <div className="p-2">
            <AddLinkForm lectureId={lectureId} />
          </div>
        </SummaryDetail.Detail>
      </SummaryDetail>

      <SummaryDetail
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
              <Templates />
              <h3>Form</h3>
              <AddMcqQuizForm lectureId={lectureId} />
            </div>
          </div>
        </SummaryDetail.Detail>
      </SummaryDetail>

      <SummaryDetail
        open={openSection === "newPractical"}
        toggle={() =>
          setOpenSection((prev) =>
            prev === "newPractical" ? undefined : "newPractical"
          )
        }
      >
        <SummaryDetail.Summary>New Practical Quiz</SummaryDetail.Summary>
        <SummaryDetail.Detail>
          <div className="p-2">
            <AddWrittenQuizForm lectureId={lectureId} />
          </div>
        </SummaryDetail.Detail>
      </SummaryDetail>
    </>
  );
}
