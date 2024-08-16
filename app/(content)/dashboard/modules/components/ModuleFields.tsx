import Input from "@/components/Input";

export default function ModuleFields({
  yearId,
  defaultValues,
}: {
  yearId: number;
  defaultValues?: {
    id: number;
    icon: string;
    name: string;
    semesterName: number;
  };
}) {
  return (
    <>
      {defaultValues && (
        <input
          name="module-id"
          id="module-id"
          className="hidden"
          defaultValue={defaultValues.id}
        />
      )}
      <Input
        label="الأيقونة"
        icon="paint-brush"
        type="url"
        name="icon"
        id="icon"
        defaultValue={defaultValues?.icon}
        required
        className="mb-4"
      />
      <Input
        label="الاسم"
        icon="book-open"
        type="text"
        name="name"
        id="name"
        defaultValue={defaultValues?.name}
        required
        className="mb-4"
      />
      <Input
        label="الفصل الدراسي"
        icon="academic-cap"
        type="number"
        name="semester-name"
        id="semester-name"
        defaultValue={defaultValues?.semesterName || 1}
        required
        className="mb-4"
      />
      <input
        type="number"
        name="year-id"
        id="year-id"
        className="hidden"
        defaultValue={yearId}
      />
    </>
  );
}
