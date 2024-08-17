import Input from "@/components/Input";
import Select from "@/components/Select";
import React from "react";

export type LinkPlace = "lectures" | "practical" | "final-revision";

export default function LinkFields({
  place,
  defaultValues,
}: {
  place: LinkPlace;
  defaultValues?: {
    linkId: number;
    title: string;
    subTitle: string;
    url: string;
    type: "Video" | "Record" | "PDF" | "Data";
    category: "Data" | "College" | "Summary";
    id: number;
  };
}) {
  return (
    <>
      {defaultValues && (
        <input
          id="link-id"
          name="link-id"
          defaultValue={defaultValues.linkId}
        />
      )}
      <Input
        label="العنوان"
        icon="book-open"
        type="text"
        id="title"
        name="title"
        required
        defaultValue={defaultValues && defaultValues.title}
        className="mb-4"
      />
      <Input
        label="تحت العنوان"
        icon="book-open"
        type="text"
        id="sub-title"
        name="sub-title"
        required
        defaultValue={defaultValues && defaultValues.subTitle}
        className="mb-4"
      />
      <Input
        label="الرابط"
        icon="link"
        type="url"
        id="url"
        name="url"
        required
        defaultValue={defaultValues && defaultValues.url}
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
        defaultValue={defaultValues && defaultValues.type}
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
        defaultValue={defaultValues && defaultValues.category}
        className="mb-4"
      />
      <Input
        label={place === "lectures" ? "المحاضرة" : "المادة"}
        icon="academic-cap"
        id="id"
        name="id"
        required
        defaultValue={defaultValues && defaultValues.id}
        className="mb-4"
      />
    </>
  );
}
