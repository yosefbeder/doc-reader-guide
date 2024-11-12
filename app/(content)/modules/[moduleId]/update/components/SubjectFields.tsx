import Input from "@/components/Input";

export default function SubjectFields({
  moduleId,
  defaultValues,
  formId,
}: {
  moduleId: number;
  defaultValues?: {
    id: number;
    icon: string;
    name: string;
    moduleId: number;
  };
  formId?: string;
}) {
  return (
    <>
      {defaultValues && (
        <input
          type="number"
          name="subject-id"
          id="subject-id"
          className="hidden"
          defaultValue={defaultValues.id}
          form={formId}
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
        form={formId}
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
        form={formId}
      />
      <input
        type="number"
        name="module-id"
        id="module-id"
        className="hidden"
        defaultValue={moduleId}
        form={formId}
      />
    </>
  );
}