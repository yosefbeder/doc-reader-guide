import Input from "@/components/Input";

export default function ModuleFields({
  yearId,
  defaultValues,
  formId,
}: {
  yearId: number;
  defaultValues?: {
    id: number;
    icon: string;
    name: string;
    semesterName: number;
  };
  formId?: string;
}) {
  return (
    <>
      {defaultValues && (
        <input
          form={formId}
          name="module-id"
          id={`module-${defaultValues?.id || "new"}-id`}
          className="hidden"
          defaultValue={defaultValues.id}
        />
      )}
      <Input
        form={formId}
        label="Icon"
        icon="paint-brush"
        type="url"
        name="icon"
        id={`module-${defaultValues?.id || "new"}-icon`}
        defaultValue={defaultValues?.icon}
        required
        className="mb-4"
      />
      <Input
        form={formId}
        label="Name"
        icon="book-open"
        type="text"
        name="name"
        id={`module-${defaultValues?.id || "new"}-name`}
        defaultValue={defaultValues?.name}
        required
        className="mb-4"
      />
      <Input
        form={formId}
        label="Semester"
        icon="academic-cap"
        type="number"
        name="semester-name"
        id={`module-${defaultValues?.id || "new"}-semester-name`}
        defaultValue={defaultValues?.semesterName || 1}
        required
        className="mb-4"
      />
      <input
        form={formId}
        type="number"
        name="year-id"
        id={`module-${defaultValues?.id || "new"}-year-id`}
        className="hidden"
        defaultValue={yearId}
      />
    </>
  );
}
