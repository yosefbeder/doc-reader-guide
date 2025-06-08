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
          name="link-id"
          id={`link-${defaultValues?.id || "new"}-id`}
          className="hidden"
          defaultValue={defaultValues.id}
          form={formId}
        />
      )}
      <Input
        label="العنوان"
        icon="book-open"
        type="text"
        name="title"
        id={`link-${defaultValues?.id || "new"}-title`}
        required
        defaultValue={defaultValues?.title}
        className="mb-4"
        form={formId}
      />
      <Input
        label="تحت العنوان"
        icon="book-open"
        type="text"
        name="sub-title"
        id={`link-${defaultValues?.id || "new"}-sub-title`}
        defaultValue={defaultValues?.subTitle}
        className="mb-4"
        form={formId}
      />
      <Input
        label="الرابط"
        icon="link"
        type="url"
        name="url"
        id={`link-${defaultValues?.id || "new"}-url`}
        required
        defaultValue={defaultValues?.url}
        className="mb-4"
        form={formId}
      />
      <Select
        label="النوع"
        icon="document"
        name="type"
        id={`link-${defaultValues?.id || "new"}-type`}
        options={[
          { label: "فيديو", value: "Video" },
          { label: "ريكورد", value: "Record" },
          { label: "ملف نصي", value: "PDF" },
          { label: "فورم", value: "Data" },
        ]}
        required
        defaultValue={defaultValues?.type}
        className="mb-4"
        form={formId}
      />
      <Select
        label="القسم"
        icon="tag"
        name="category"
        id={`link-${defaultValues?.id || "new"}-category`}
        options={[
          { label: "مصادر خارجية", value: "Data" },
          { label: "الكلية", value: "College" },
          { label: "الملخصات", value: "Summary" },
          { label: "الأسئلة", value: "Questions" },
        ]}
        required
        defaultValue={defaultValues?.category}
        className="mb-4"
        form={formId}
      />
      <input
        type="number"
        name="lecture-id"
        id={`link-${defaultValues?.id || "new"}-lecture-id`}
        className="hidden"
        defaultValue={lectureId}
        form={formId}
      />
    </>
  );
}
