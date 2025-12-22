"use client";

import { useState, ReactNode } from "react";
import { SummaryDetail } from "./SummaryDetail";

interface LectureNoteProps {
  children: ReactNode;
}

export default function LectureNote({ children }: LectureNoteProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="md:hidden">
        <SummaryDetail
          open={open}
          toggle={() => setOpen((prev) => !prev)}
          className="bg-slate-50 dark:bg-slate-800"
        >
          <SummaryDetail.Summary>Notes</SummaryDetail.Summary>
          <SummaryDetail.Detail>{children}</SummaryDetail.Detail>
        </SummaryDetail>
      </div>
      <div className="hidden md:block flex-1 rounded-xl bg-slate-50 dark:bg-slate-800">
        {children}
      </div>
    </>
  );
}
