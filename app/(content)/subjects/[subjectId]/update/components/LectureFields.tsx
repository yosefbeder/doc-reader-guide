"use client";

import Input from "@/components/Input";
import { Lecture } from "@/types";

export default function LectureFields({
  subjectId,
  defaultValues,
  formId,
}: {
  subjectId: number;
  defaultValues?: Lecture;
  formId?: string;
}) {
  return (
    <>
      {defaultValues && (
        <input
          type="number"
          name="lecture-id"
          id="lecture-id"
          className="hidden"
          defaultValue={defaultValues.id}
          form={formId}
        />
      )}
      <Input
        label="العنوان"
        icon="book-open"
        type="text"
        name="title"
        id="title"
        defaultValue={defaultValues?.title}
        required
        className="mb-4"
        form={formId}
      />
      <Input
        label="التاريخ"
        icon="calendar"
        type="date"
        name="date"
        id="date"
        defaultValue={
          defaultValues &&
          new Date(defaultValues.date).toISOString().substring(0, 10)
        }
        required
        className="mb-4"
        form={formId}
      />
      <input
        type="number"
        name="subject-id"
        id="subject-id"
        className="hidden"
        defaultValue={subjectId}
        form={formId}
      />
    </>
  );
}
