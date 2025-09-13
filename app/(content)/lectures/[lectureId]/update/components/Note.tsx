"use client";

import React, { useState } from "react";
import { useFormState } from "react-dom";

import LectureFields from "@/app/(content)/subjects/[subjectId]/update/components/LectureFields";
import ButtonSubmit from "@/components/ButtonSubmit";
import Message from "@/components/Message";
import RichTextEditor from "@/components/RichTextEditor/RichTextEditor";
import { SummaryDetail } from "@/components/SummaryDetail";
import { updateLecture } from "@/lib/actions/lectures";
import { useAddForm } from "@/lib/hooks";
import { Lecture, User } from "@/types";
import replaceImgSrc from "@/utils/replaceImgSrc";
import notUpdateable from "@/utils/isUpdateable";

function NoteRichTextEditor({ lecture }: { lecture: Lecture }) {
  const [note, setNote] = useState(replaceImgSrc(lecture?.note || ""));
  return (
    <RichTextEditor
      name="note"
      id={`lecture-${lecture.id}-note`}
      value={note}
      placeholder="Note"
      onChange={(value) => setNote(value)}
    />
  );
}

export default function Note({
  user,
  lecture,
}: {
  user: User;
  lecture: Lecture;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [formState, formAction] = useFormState(updateLecture, {});
  const { hideMessage, setHideMessage, formKey } = useAddForm(formState); // To update image src

  return (
    <SummaryDetail open={isOpen} toggle={() => setIsOpen((prev) => !prev)}>
      <SummaryDetail.Summary>Note</SummaryDetail.Summary>
      <SummaryDetail.Detail>
        <form
          className="p-2 col"
          action={formAction}
          onClickCapture={() => setHideMessage(true)}
        >
          <div className="hidden">
            <LectureFields
              subjectId={lecture.subject.id}
              defaultValues={lecture}
            />
          </div>
          <NoteRichTextEditor key={formKey} lecture={lecture} />
          {formState.message && formState.type && !hideMessage && (
            <Message type={formState.type}>{formState.message}</Message>
          )}
          <div className="flex gap-2">
            <ButtonSubmit
              disabled={notUpdateable(user, lecture.creatorId)}
              color="yellow"
            >
              Update
            </ButtonSubmit>
          </div>
        </form>
      </SummaryDetail.Detail>
    </SummaryDetail>
  );
}
