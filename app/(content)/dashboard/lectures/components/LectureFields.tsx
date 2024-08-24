import Input from "@/components/Input";
import Select from "@/components/Select";
import { Subject } from "@/types";

export default function LectureFields({
  subjects,
  defaultValues,
}: {
  subjects: Subject[];
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
      <Select
        label="المادة"
        icon="academic-cap"
        name="subject-id"
        id="subject-id"
        options={subjects.map(({ name, id, moduleName }) => ({
          label: `${moduleName} → ${name}`,
          value: id,
        }))}
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
