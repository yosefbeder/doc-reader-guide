import Input from "@/components/Input";

export default function SubjectFields({
  yearId,
  defaultValues,
}: {
  yearId: number;
  defaultValues?: {
    id: number;
    icon: string;
    name: string;
    moduleId: number;
  };
}) {
  return (
    <>
      {defaultValues && (
        <input
          name="subject-id"
          id="subject-id"
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
        label="الموديول"
        icon="academic-cap"
        type="number"
        name="module-id"
        id="module-id"
        defaultValue={defaultValues?.moduleId}
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
