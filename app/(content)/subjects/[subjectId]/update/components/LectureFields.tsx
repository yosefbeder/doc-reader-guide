import Input from "@/components/Input";
import TextArea from "@/components/TextArea";
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
          id={`lecture-${defaultValues?.id || "new"}-id`}
          className="hidden"
          defaultValue={defaultValues.id}
          form={formId}
        />
      )}
      <TextArea
        label="Title"
        icon="book-open"
        name="title"
        id={`lecture-${defaultValues?.id || "new"}-title`}
        defaultValue={defaultValues?.title}
        required
        className="mb-4"
        form={formId}
      />
      <Input
        label="Date"
        icon="calendar-outline"
        type="date"
        name="date"
        id={`lecture-${defaultValues?.id || "new"}-date`}
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
        id={`lecture-${defaultValues?.id || "new"}-subject-id`}
        className="hidden"
        defaultValue={subjectId}
        form={formId}
      />
    </>
  );
}
