import Input from "@/components/Input";
import Select from "@/components/Select";
import { Lecture, Link, Module, Subject } from "@/types";

export interface ModifiedSubject extends Subject {
  myModule: Module;
}

export interface ModifiedLecture extends Lecture {
  subject: ModifiedSubject;
}

export default function LinkFields({
  lectures,
  defaultValues,
}: {
  lectures: ModifiedLecture[];
  defaultValues?: Link;
}) {
  return (
    <>
      {defaultValues && (
        <input
          id="link-id"
          name="link-id"
          className="hidden"
          defaultValue={defaultValues.id}
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
      />
      <Input
        label="تحت العنوان"
        icon="book-open"
        type="text"
        id="sub-title"
        name="sub-title"
        required
        defaultValue={defaultValues?.subTitle}
        className="mb-4"
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
        ]}
        required
        defaultValue={defaultValues?.category}
        className="mb-4"
      />
      <Select
        label="المحاضرة"
        icon="academic-cap"
        id="lecture-id"
        name="lecture-id"
        options={lectures.map(({ id, title, type, subject }) => ({
          label:
            type == "Normal"
              ? title
              : `${subject.myModule.name} → ${subject.name} → ${title}`,
          value: id,
        }))}
        defaultValue={defaultValues?.lectureId}
        required
        className="mb-4"
      />
    </>
  );
}
