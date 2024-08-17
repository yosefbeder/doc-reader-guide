import Input from "@/components/Input";

export default function LectureFields({
  defaultValues,
}: {
  defaultValues?: {
    id: number;
    title: string;
    date: string;
    subjectId: number;
  };
}) {
  return (
    <>
      {defaultValues && (
        <input
          name="lecture-id"
          id="lecture-id"
          className="hidden"
          defaultValue={defaultValues.id}
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
      />
      <Input
        label="المادة"
        icon="academic-cap"
        type="number"
        name="subject-id"
        id="subject-id"
        defaultValue={defaultValues?.subjectId}
        required
        className="mb-4"
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
      />
    </>
  );
}
