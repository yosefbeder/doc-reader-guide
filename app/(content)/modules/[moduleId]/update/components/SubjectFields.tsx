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
          id={`subject-${defaultValues?.id || "new"}-id`}
          className="hidden"
          defaultValue={defaultValues.id}
          form={formId}
        />
      )}
      <Input
        label="Icon"
        icon="paint-brush"
        type="url"
        name="icon"
        id={`subject-${defaultValues?.id || "new"}-icon`}
        defaultValue={defaultValues?.icon}
        required
        form={formId}
      />
      <Input
        label="Name"
        icon="book-open"
        type="text"
        name="name"
        id={`subject-${defaultValues?.id || "new"}-name`}
        defaultValue={defaultValues?.name}
        required
        form={formId}
      />
      <input
        type="number"
        name="module-id"
        id={`subject-${defaultValues?.id || "new"}-module-id`}
        className="hidden"
        defaultValue={moduleId}
        form={formId}
      />
    </>
  );
}
