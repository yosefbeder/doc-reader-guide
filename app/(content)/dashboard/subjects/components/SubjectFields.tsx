import Input from "@/components/Input";
import Select from "@/components/Select";
import { Module } from "@/types";

export default function SubjectFields({
  yearId,
  modules,
  defaultValues,
}: {
  yearId: number;
  modules: Module[];
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
      <Select
        label="الموديول"
        icon="academic-cap"
        name="module-id"
        id="module-id"
        options={modules.map(({ name, id }) => ({
          label: name,
          value: id,
        }))}
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
