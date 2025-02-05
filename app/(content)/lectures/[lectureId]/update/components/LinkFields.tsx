import Input from "@/components/Input";
import Select from "@/components/Select";
import { Link } from "@/types";

export default function LinkFields({
  lectureId,
  defaultValues,
  formId,
}: {
  lectureId: number;
  defaultValues?: Link;
  formId?: string;
}) {
  return (
    <>
      {defaultValues && (
        <input
          type="number"
          id="link-id"
          name="link-id"
          className="hidden"
          defaultValue={defaultValues.id}
          form={formId}
        />
      )}
      <Input
        label="العنوان"
        icon="book-open"
        type="text"
        id="title"
        name="title"
        required
        defaultValue={defaultValues?.title}
        className="mb-4"
        form={formId}
      />
      <Input
        label="تحت العنوان"
        icon="book-open"
        type="text"
        id="sub-title"
        name="sub-title"
        defaultValue={defaultValues?.subTitle}
        className="mb-4"
        form={formId}
      />
      <Input
        label="الرابط"
        icon="link"
        type="url"
        id="url"
        name="url"
        required
        defaultValue={defaultValues?.url}
        className="mb-4"
        form={formId}
      />
      <Select
        label="النوع"
        icon="document"
        id="type"
        name="type"
        options={[
          { label: "Video", value: "Video" },
          { label: "Record", value: "Record" },
          { label: "PDF", value: "PDF" },
          { label: "Data", value: "Data" },
        ]}
        required
        defaultValue={defaultValues?.type}
        className="mb-4"
        form={formId}
      />
      <Select
        label="القسم"
        icon="tag"
        id="category"
        name="category"
        options={[
          { label: "Data", value: "Data" },
          { label: "College", value: "College" },
          { label: "Summary", value: "Summary" },
          { label: "Questions", value: "Questions" },
        ]}
        required
        defaultValue={defaultValues?.category}
        className="mb-4"
        form={formId}
      />
      <input
        type="number"
        id="lecture-id"
        name="lecture-id"
        className="hidden"
        defaultValue={lectureId}
        form={formId}
      />
    </>
  );
}
